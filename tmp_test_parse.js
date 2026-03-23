const fs = require('fs');
const XLSX = require('xlsx');

const fakeStorage = [];

global.window = {
    confirm: () => true,
    alert: (msg) => console.log('ALERT:', msg)
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

const MOCK_DATA = [];
let ALL_ENTRIES = [];
let PROJECTS = [];
global.StorageService = {
    getAllEntries: () => ALL_ENTRIES,
    getProjects: () => PROJECTS,
    saveProject: (p) => PROJECTS.push(p),
    saveEntry: (e) => ALL_ENTRIES.push(e),
    updateEntry: (id, params) => {}
};

global.parsePeriodToMmmYy = (period) => {
    return 'oct-23';
};

try {
    const wb = XLSX.readFile('test_import_v2.xlsx');
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws);

    const firstRow = data[0];
    const required = ['Codigo_Proyecto', 'Nombre_Proyecto', 'Jefe_Proyecto', 'Periodo', 'Ingreso_CLP', 'Costo_Interno_CLP', 'Costo_Externo_CLP', 'Status'];
    const missing = required.filter(col => !(col in firstRow));
    if (missing.length > 0) {
        console.log('Faltan columnas obligatorias: ' + missing.join(', '));
    } else {
        console.log("No missing columns!");
    }
} catch (err) {
    console.error(err);
}
