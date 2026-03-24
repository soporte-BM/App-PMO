import { periodToApiFormat } from '../utils/format.js';

/**
 * StorageService — ahora un adaptador sobre ApiService.
 * Mantiene la misma interfaz que antes (mismos métodos),
 * pero todos devuelven Promises en vez de valores síncronos.
 *
 * Los componentes deben usar await o .then() al llamar a estos métodos.
 */
import { ApiService } from './apiService.js';

export const StorageService = {

    // ── CLOSURES / ENTRIES ──────────────────────────────────────────────

    getAllEntries: async () => {
        return ApiService.getAllEntries();
    },

    getEntriesByProject: async (projectName) => {
        const all = await ApiService.getAllEntries();
        return all.filter(e => e.project_name === projectName || e.project === projectName);
    },

    saveEntry: async (entry) => {
        return ApiService.saveEntry(entry);
    },

    updateEntry: async (entryId, updatedData) => {
        // El backend actualiza via POST /closures (upsert), no hay PATCH aún.
        // Combinamos el id con los datos actualizados para reenviar.
        return ApiService.saveEntry({ ...updatedData, id: entryId });
    },

    // ── PROYECTOS ────────────────────────────────────────────────────────

    getProjects: async () => {
        const projects = await ApiService.getProjects();
        // Normalizar al formato que espera el frontend
        return projects.map(p => ({
            id: p.id,
            code: p.project_code,
            name: p.name,
            status: p.status === 'ACTIVE' ? 'Activo' : 'Inactivo'
        }));
    },

    saveProject: async (project) => {
        const payload = {
            project_code: project.code,
            name: project.name,
            status: project.status === 'Activo' ? 'ACTIVE' : 'INACTIVE'
        };
        return ApiService.createProject(payload);
    },

    // ── PROFESIONALES / RECURSOS ─────────────────────────────────────────

    getProfessionals: async (period) => {
        if (!period) {
            // Sin periodo, traemos todos los recursos activos sin tarifas
            const resources = await ApiService.getResources();
            return resources.map(r => ({
                id: r.id,
                name: r.resource_name,
                role: r.role,
                period: null,
                directRate: null,
                indirectRate: null
            }));
        }
        // Con periodo, traemos recursos + sus tarifas para ese mes
        const rates = await ApiService.getRates(period);
        return rates.map(r => ({
            id: r.resource_id,
            name: r.resource_name,
            period,
            directRate: r.direct_rate,
            indirectRate: r.indirect_rate,
            currency: r.currency
        }));
    },

    saveProfessional: async (pro) => {
        // Crear recurso si no existe (ignorar error si ya existe)
        if (!pro.id) {
            try {
                await ApiService.createResource({
                    resource_name: pro.name,
                    role: pro.role || 'Consultor'
                });
            } catch (e) {
                // El recurso ya existe en BD — continuar para actualizar tarifa
                console.warn(`Recurso ${pro.name} ya existe, actualizando tarifa.`);
            }
        }
        // Guardar tarifa si viene con periodo y valores
        if (pro.period && (pro.directRate != null || pro.indirectRate != null)) {
            const apiPeriod = periodToApiFormat(pro.period);
            await ApiService.saveRates(apiPeriod, [{
                resourceName: pro.name,
                directRate: pro.directRate || 0,
                indirectRate: pro.indirectRate || 0
            }]);
        }
    },
    },

    saveProfessionalsBulk: async (prosList) => {
        if (!prosList.length) return;
        const period = prosList[0].period;
        // Crear recursos nuevos que no existan
        for (const pro of prosList) {
            if (!pro.id) {
                try {
                    await ApiService.createResource({
                        resource_name: pro.name,
                        role: pro.role || 'Consultor'
                    });
                } catch (e) {
                    // Si ya existe en BD, ignorar el error de duplicado
                    console.warn(`Recurso ${pro.name} ya existe, actualizando tarifa.`);
                }
            }
        }
        // Guardar todas las tarifas del periodo en bloque
        if (period) {
            const apiPeriod = periodToApiFormat(period);
            const rates = prosList.map(pro => ({
                resourceName: pro.name,
                directRate: pro.directRate || 0,
                indirectRate: pro.indirectRate || 0
            }));
            await ApiService.saveRates(apiPeriod, rates);
        }
    },

    clearData: () => {
        console.warn('clearData no está soportado en modo API.');
    }
};
