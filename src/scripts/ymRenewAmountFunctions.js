const path = require('path');
const ExcelJS = require('exceljs');
const { fileInfoForReadFile, templates } = require('../consts.js');
const { uniqueReadExcelFile } = require('../utils');

const writeYMAmount = async (content) => {
    try {
        let worksheet = null;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.resolve(__dirname, '..', 'inputFiles', templates.ymAmount));
        
        worksheet = await workbook.getWorksheet(fileInfoForReadFile['ymRenewSetAmount.xlsx'].tagName);

        const skuValues = content.columns.sku;
        let rowForWrite = fileInfoForReadFile['ymRenewSetAmount.xlsx'].rowBeginProduct;
        skuValues.forEach((sku, i) => {
            if (sku && sku.toString().trim() && content.object[sku]['Остаток']) {
                worksheet.getRow(rowForWrite).values =  ['', '', sku, '', content.object[sku]['Остаток']];
                rowForWrite++;
            }
        });
        
        const filename = `./upload/result${Math.random().toString(36)}.xlsx`;
        await workbook.xlsx.writeFile(filename);
        return filename;
    } catch(e) {
        console.log('writeYmAmount');
        console.log(e);
    }
} 

const renewAmountYM = async (file) => {
    try {
        // вызов функции универсального чтения файла
        const content = await uniqueReadExcelFile(file, "Прайс-лист ИП Булюнов Артём Мусаевич");
        console.log(content);
        const fileAmount = await writeYMAmount(content);
        return fileAmount;
    } catch (e) {
        return { success: false };
    }
}

module.exports = {
    renewAmountYM,
}