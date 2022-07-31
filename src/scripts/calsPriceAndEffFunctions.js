const ExcelJS = require('exceljs');
const { fileInfoForReadFile } = require('../consts');
const { normalizeCells, getNumberColumnByHeaders, createObjectFromColumns } = require('../utils');
const _ = require("lodash");

const universalReadExcelFileNew = async (file, filenameForConstantsFile) => {
    try {
        // определить вид файла
        // прочесть соответсвующие столбцы
        let worksheet = null;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.path);
        
        const info = fileInfoForReadFile[filenameForConstantsFile];

        // worksheet = await workbook.getWorksheet(info.tagName);
        worksheet = workbook.getWorksheet(info.tagName) || workbook.worksheets[0];
        // найти номера столбцов, и соотвествующими заголовками
        const headerRow = normalizeCells(worksheet.getRow(info.rowHeader).values);
        // console.log('headerRow');
        // console.log(headerRow);
        const { nSkuColumn, nColumns} = getNumberColumnByHeaders(info.skuColumnName, info.columnsNames, headerRow);
        // console.log('nSkuColumn, nColumns');
        // console.log(nSkuColumn, nColumns);
        // результат в двух вариантах - [col1, col2], {sku1: {все поля}}
        const columns = {};
        columns[info.skuColumnName] = info.formatters['sku']
            ? worksheet.getColumn(nSkuColumn).values.slice(info.rowBeginProduct).map(info.formatters['sku'])
            : worksheet.getColumn(nSkuColumn).values.slice(info.rowBeginProduct);
        info.columnsNames.forEach((header, i) => {
            columns[header] = info.formatters[header]
                ? worksheet.getColumn(nColumns[i]).values.slice(info.rowBeginProduct).map(info.formatters[header])
                : worksheet.getColumn(nColumns[i]).values.slice(info.rowBeginProduct);
        })
        return createObjectFromColumns(columns, info.skuColumnName);
    } catch (e) {
        console.log(e);
    }
}

const createUnionAssort = async (files, fileNamesForfileInfo ) => {
    console.log('createUnionAssort');
    const arrayOfObj = [];
    const arraysSku = [];
    for(let i=0; i<files.length; i++) {
        const obj = await universalReadExcelFileNew(files[i], fileNamesForfileInfo[i]);
        arrayOfObj.push(obj);
        arraysSku.push(Object.keys(obj));
    }
    // взять ключи-sku из всех объектов
    // функцией lodash оставить там только пересечение этих множеств

    const assortSku = _.intersection(...arraysSku);
    const accort = {};
    assortSku.forEach((sku) => {accort[sku] = {};
        arrayOfObj.forEach((obj) => {
            accort[sku] = {...accort[sku], ...obj[sku]};
        })
    })

    return accort;
}

module.exports = {
    createUnionAssort
}