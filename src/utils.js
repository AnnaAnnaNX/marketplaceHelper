const ExcelJS = require('exceljs');
const { fileInfoForReadFile, templates } = require('./consts.js');

const normalizeCells = (cells) => {
    return cells
        ? cells.map((el) => (el ? el.toString().trim() : el))
        : cells;
}

const getNumberColumnByHeaders = (skuColumnName, headers, allHeaders) => {
    const nSkuColumn = allHeaders.indexOf(skuColumnName);
    const nColumns = headers.map((header) => (allHeaders.indexOf(header)));
    return {nSkuColumn, nColumns};
}

const createObjectFromColumns = (columns) => {
    const headers = Object.keys(columns);
    const resultObj = {};
    columns['sku'].forEach((val, i) => {
        const obj = {};
        headers.map((header) => {
            obj[header] = columns[header][i];
        });
        resultObj[val] = obj;
    });
    return resultObj;
}

const uniqueReadExcelFile = async (file, filenameForConstantsFile) => {
    try {
        // определить вид файла
        // прочесть соответсвующие столбцы
        let worksheet = null;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.path);
        
        const info = fileInfoForReadFile["Прайс-лист ИП Булюнов Артём Мусаевич"];

        // worksheet = await workbook.getWorksheet(info.tagName);
        worksheet = workbook.worksheets[0];
        // найти номера столбцов, и соотвествующими заголовками
        const headerRow = normalizeCells(worksheet.getRow(info.rowHeader).values);
        console.log(headerRow);
        const { nSkuColumn, nColumns} = getNumberColumnByHeaders(info.skuColumnName, info.columnsNames, headerRow);
        console.log(nSkuColumn, nColumns);   
        // результат в двух вариантах - [col1, col2], {sku1: {все поля}}
        const columns = {};
        columns['sku'] = info.foratters['sku']
            ? worksheet.getColumn(nSkuColumn).values.slice(info.rowBeginProduct).map(info.foratters['sku'])
            : worksheet.getColumn(nSkuColumn).values.slice(info.rowBeginProduct);
        info.columnsNames.forEach((header, i) => {
            columns[header] = info.foratters[header]
                ? worksheet.getColumn(nColumns[i]).values.slice(info.rowBeginProduct).map(info.foratters[header])
                : worksheet.getColumn(nColumns[i]).values.slice(info.rowBeginProduct);
        })
        return {columns, object: createObjectFromColumns(columns)};
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    uniqueReadExcelFile,
    createObjectFromColumns,
    getNumberColumnByHeaders,
    normalizeCells 
}