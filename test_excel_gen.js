const XLSX = require('xlsx');

const data = [
    {
        Codigo_Proyecto: 'PRJ-TEST-01',
        Nombre_Proyecto: 'Test Coexistencia',
        Jefe_Proyecto: 'Admin',
        Periodo: 'oct-23',
        Ingreso_CLP: 100000,
        Costo_Interno_CLP: 20000,
        Costo_Externo_CLP: 5000,
        Status: 'REAL'
    },
    {
        Codigo_Proyecto: 'PRJ-TEST-01',
        Nombre_Proyecto: 'Test Coexistencia',
        Jefe_Proyecto: 'Admin',
        Periodo: 'oct-23',
        Ingreso_CLP: 120000,
        Costo_Interno_CLP: 30000,
        Costo_Externo_CLP: 5000,
        Status: 'PROYECCION'
    },
    {
        Codigo_Proyecto: 'PRJ-TEST-01',
        Nombre_Proyecto: 'Test Coexistencia',
        Jefe_Proyecto: 'Admin',
        Periodo: 'nov-23',
        Ingreso_CLP: 200000,
        Costo_Interno_CLP: 40000,
        Costo_Externo_CLP: 10000,
        Status: 'PROYECCION'
    }
];

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Proyectos_Historicos');
XLSX.writeFile(workbook, 'test_import_v2.xlsx');
console.log('test_import_v2.xlsx generated successfully');
