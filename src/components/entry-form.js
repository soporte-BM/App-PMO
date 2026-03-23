import { StorageService } from '../services/storage.js';
import { parsePeriodToMmmYy, formatCurrency } from '../utils/format.js';

export async function renderEntryForm(container) {
    const activeProjects = (await StorageService.getProjects()).filter(p => p.status === 'Activo');
    const allProfessionals = await StorageService.getProfessionals();
    const uniqueProNames = [...new Set(allProfessionals.map(p => p.name))].sort();

    const html = `
        <div class="form-container">
            <h2 style="margin-bottom: 1.5rem">Nuevo Registro de Proyecto</h2>
            <form id="projectForm">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Proyecto</label>
                        <select name="project" class="form-input" required>
                            <option value="" disabled selected>Seleccione un proyecto activo...</option>
                            ${activeProjects.map(p => `<option value="${p.name}">${p.name} (${p.code})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Periodo (Mes/Año)</label>
                        <input type="month" id="entry-month" name="month" class="form-input" required>
                    </div>
                </div>

                <div class="form-row">
                     <div class="form-group">
                        <label class="form-label">Ingreso Mensual (CLP)</label>
                        <input type="number" name="revenue" class="form-input" required min="0" step="1000">
                    </div>
                     <div class="form-group">
                        <label class="form-label">Costos de Terceros</label>
                        <input type="number" name="thirdPartyCosts" class="form-input" value="0" min="0">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tipo de Registro</label>
                        <select name="tipoRegistro" class="form-input" required>
                            <option value="REAL" selected>Real</option>
                            <option value="PROYECCION">Proyección</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Equipo de Trabajo (Horas & Tarifas)</label>
                    <div id="professionals-list" class="dynamic-list">
                        <!-- Items will be here -->
                    </div>
                    <button type="button" id="add-pro-btn" class="btn-secondary" style="margin-top: 10px">+ Agregar Profesional</button>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancel-btn">Cancelar</button>
                    <button type="submit" class="btn-primary">Guardar Proyecto</button>
                </div>
            </form>
        </div>
    `;

    container.innerHTML = html;

    // Attach Logic
    const list = document.getElementById('professionals-list');
    const addBtn = document.getElementById('add-pro-btn');
    const form = document.getElementById('projectForm');
    const monthInput = document.getElementById('entry-month');

    // Recalculates rate for a specific row
    const updateRowRate = (row) => {
        const rawMonth = monthInput.value; // format: 'YYYY-MM'
        const month = parsePeriodToMmmYy(rawMonth);
        const nameSelect = row.querySelector('[name="pro_name"]');
        const rateDisplayInput = row.querySelector('[name="pro_rate_display"]');
        const rateInput = row.querySelector('[name="pro_rate"]');
        
        if (!month || !nameSelect.value) {
            rateDisplayInput.value = '';
            rateInput.value = '';
            return;
        }

        // Find matching professional in DB exactly for that name and period
        const pro = allProfessionals.find(p => p.name === nameSelect.value && p.period === month);
        if (pro) {
            const beRate = Number(pro.directRate) + Number(pro.indirectRate);
            rateDisplayInput.value = formatCurrency(beRate);
            rateInput.value = beRate;
        } else {
            rateDisplayInput.value = '';
            rateInput.value = '';
            // Only alert if both are filled but not found to avoid annoying popups while typing
            alert(`No se encontró Tarifa definida para ${nameSelect.value} en el periodo ${month}. Por favor regístrela en el Maestro de Profesionales.`);
            nameSelect.value = '';
        }
    };

    // Recalculate all rows when global month changes
    monthInput.addEventListener('change', () => {
        const rows = list.querySelectorAll('.list-item');
        rows.forEach(updateRowRate);
    });

    // Function to add a professional row
    const addProfessionalRow = () => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <select name="pro_name" class="form-input" style="flex:2" required>
                <option value="" disabled selected>Seleccione Profesional...</option>
                ${uniqueProNames.map(name => `<option value="${name}">${name}</option>`).join('')}
            </select>
            <input type="number" name="pro_hours" placeholder="Horas" class="form-input" style="flex:1" min="0" required>
            <input type="text" name="pro_rate_display" placeholder="Tarifa B/E Auto" class="form-input" style="flex:1; background-color: #f3f4f6; cursor: not-allowed;" readonly required>
            <input type="hidden" name="pro_rate">
            <button type="button" class="btn-remove">×</button>
        `;

        div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
        
        // Listen to select change to update rate
        div.querySelector('[name="pro_name"]').addEventListener('change', () => updateRowRate(div));
        
        list.appendChild(div);
    };

    // Add first row by default
    addProfessionalRow();

    addBtn.addEventListener('click', addProfessionalRow);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const professionals = [];

        // Parse dynamic rows
        const names = formData.getAll('pro_name');
        const hours = formData.getAll('pro_hours');
        const rates = formData.getAll('pro_rate');

        names.forEach((name, i) => {
            if (name) {
                professionals.push({
                    name,
                    hours: Number(hours[i]),
                    rate: Number(rates[i])
                });
            }
        });

        const entry = {
            project: formData.get('project'),
            month: parsePeriodToMmmYy(formData.get('month')),
            revenue: Number(formData.get('revenue')),
            thirdPartyCosts: Number(formData.get('thirdPartyCosts')),
            tipoRegistro: formData.get('tipoRegistro') || 'REAL',
            professionals
        };

        await StorageService.saveEntry(entry);
        alert('Proyecto guardado exitosamente');
        window.location.reload(); // Simple reload to go back to dashboard
    });
}
