const XLSX = require('xlsx');

// 1. Valid File
const validData = [
    { Codigo_Proyecto: 'PRJ-100', Nombre_Proyecto: 'Valid Project 1', Periodo: 'ene-25', Ingreso_CLP: 100000, Costo_Interno_CLP: 50000, Costo_Externo_CLP: 10000 },
    { Codigo_Proyecto: 'PRJ-101', Nombre_Proyecto: 'Valid Project 2', Periodo: 'feb-25', Ingreso_CLP: 200000, Costo_Interno_CLP: 150000, Costo_Externo_CLP: 0 }
];
const validWs = XLSX.utils.json_to_sheet(validData);
const validWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(validWb, validWs, 'Sheet1');
XLSX.writeFile(validWb, 'valid.xlsx');

// 2. Invalid Columns File (Missing Costo_Externo_CLP)
const invalidColsData = [
    { Codigo_Proyecto: 'PRJ-102', Nombre_Proyecto: 'Invalid Cols', Periodo: 'mar-25', Ingreso_CLP: 100, Costo_Interno_CLP: 50, /* Costo_Externo_CLP missing */ }
];
const invalidColsWs = XLSX.utils.json_to_sheet(invalidColsData);
const invalidColsWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(invalidColsWb, invalidColsWs, 'Sheet1');
XLSX.writeFile(invalidColsWb, 'invalid_cols.xlsx');

// 3. Invalid Data File (Negative value, bad period, duplicates)
const invalidDataData = [
    { Codigo_Proyecto: 'PRJ-103', Nombre_Proyecto: 'Negative', Periodo: 'abr-25', Ingreso_CLP: -100, Costo_Interno_CLP: 50, Costo_Externo_CLP: 10 },
    { Codigo_Proyecto: 'PRJ-104', Nombre_Proyecto: 'Bad Period', Periodo: 'invalid-date', Ingreso_CLP: 100, Costo_Interno_CLP: 50, Costo_Externo_CLP: 10 },
    { Codigo_Proyecto: 'PRJ-105', Nombre_Proyecto: 'Dup', Periodo: 'may-25', Ingreso_CLP: 100, Costo_Interno_CLP: 50, Costo_Externo_CLP: 10 },
    { Codigo_Proyecto: 'PRJ-105', Nombre_Proyecto: 'Dup', Periodo: 'may-25', Ingreso_CLP: 100, Costo_Interno_CLP: 50, Costo_Externo_CLP: 10 },
];
const invalidDataWs = XLSX.utils.json_to_sheet(invalidDataData);
const invalidDataWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(invalidDataWb, invalidDataWs, 'Sheet1');
XLSX.writeFile(invalidDataWb, 'invalid_data.xlsx');

console.log('Created test Excel files.');
