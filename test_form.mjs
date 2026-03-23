import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable"
});

// We need to wait for scripts to run
dom.window.addEventListener("load", () => {
    console.log("DOM loaded. Simulating user action...");
    // LocalStorage mocking since JSDOM might not carry our data over the script execution correctly without it
    const StorageService = dom.window.StorageService; // If it's exposed, which it isn't directly.
});

// Let's just mock the logic manually to see what it does
import { parsePeriodToMmmYy, formatCurrency } from './src/utils/format.js';

const allProfessionals = [
    { name: 'Juan P.', period: 'ene-25', directRate: 80000, indirectRate: 20000 }
];

const mockRow = {
    nameSelect: { value: 'Juan P.' },
    rateDisplayInput: { value: '' },
    rateInput: { value: '' }
};

const updateRowRate = (rawMonth) => {
    const month = parsePeriodToMmmYy(rawMonth);
    const nameSelect = mockRow.nameSelect;
    const rateDisplayInput = mockRow.rateDisplayInput;
    const rateInput = mockRow.rateInput;
    
    if (!month || !nameSelect.value) {
        rateDisplayInput.value = '';
        rateInput.value = '';
        return;
    }

    const pro = allProfessionals.find(p => p.name === nameSelect.value && p.period === month);
    if (pro) {
        const beRate = Number(pro.directRate) + Number(pro.indirectRate);
        rateDisplayInput.value = formatCurrency(beRate);
        rateInput.value = beRate;
    } else {
        rateDisplayInput.value = '';
        rateInput.value = '';
        console.log("Alert: No se encontró Tarifa");
    }
};

updateRowRate('2025-01');
console.log("Result for 2025-01 (ene-25):", mockRow);

updateRowRate('2025-02');
console.log("Result for 2025-02 (feb-25):", mockRow);
