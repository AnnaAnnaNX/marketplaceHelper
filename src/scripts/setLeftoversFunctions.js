const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { fileInfoForReadFile, templates } = require('../consts.js');
const { uniqueReadExcelFile } = require('../utils.js');
const { v4: uuidv4 } = require('uuid');
const { sleep } = require('../functions');

// { number_store: name_store }
const storeNames = {
    1:	'№1 Склад Ростов',
    19:	'№19 ТД Нагибина 32',
    24:	'№24 ТД Малиновского',
    26:	'№26 Ессентуки',
    28:	'№28 ТД Миллерово',
    37:	'№37 Батайск',
    39:	'№39 Геленджик',
    41:	'№41 Изобильный',
    42:	'№42 Грозный',
    48:	'№48 Новочеркасск',
    59:	'№59 Невинномысск №2',
    60:	'№60 ТД Поиск-Мега',
    67:	'№67 Шахты (маг.)',
    69:	'№69 Россошь 2',
    71:	'№71 ТД Пятигорск-2',
    73:	'№73 Новороссийск',
    81:	'№81 Ставрополь (Космос)',
    89:	'№89 ТД Черкесск',
    91:	'№91 ТД Анапа',
    96:	'№96 Каменск',
    98:	'№98 ТД Тихорецк',
    111:	'№111 Назрань',
    118:	'№118 Владикавказ-3',
    124:	'№124 ТРЦ Парк',
    129:	'№129 Ростов Хайер',
    130:	'№130 Ставрополь Хайер',
    139:	'№139 Георгиевск 2',
    141:	'№141 Сальск (маг.)',
    142:	'№142 Анапа Хайер',
}

const parsePricePoisk = (columns) => {
    try {
        // remove headers
        // columns['№ ПС'] = columns['№ ПС'].slice(1);
        // columns['Код товара'] = columns['Код товара'].slice(1);
        // columns['Ост-к'] = columns['Ост-к'].slice(1);
        
        const data = {};
        columns['№ ПС'].forEach((el, i) => {
            if (!data[el]) {
                data[el] = {};
            }
            const code = columns['Код товара'][i];
            data[el][code] = {
                'Код товара': code,
                '№ ПС': columns['№ ПС'][i],
                'Ост-к': columns['Ост-к'][i],
            };

        })
        return data;
    } catch (e) {
        console.log(e);
    }
}

const readExcelFile = async (pathToFile, tabName) => {
    console.log('readExcelFile 0')
    const workbook = new ExcelJS.Workbook();
    if (!fs.existsSync(path.resolve(pathToFile))) {
        console.log('not exists file');
    }
    await workbook.xlsx.readFile(path.resolve(pathToFile));
    // worksheet = await workbook.getWorksheet(tabName);
    console.log('readExcelFile')
    return workbook;
}

// // получвет исходные сто
// const createColumnsWithOverloads

const setLeftovers = async (files) => {
    try {
        // вызов функции универсального чтения файла
        const content = await uniqueReadExcelFile(files[0], "Прайс ПОИСК.xlsx");
        // console.log(content.columns);
        const parsePricePoiskData  = parsePricePoisk(content.columns)
        console.log('parsePricePoiskData', parsePricePoiskData);

        // get sku list (read Ассортимент Яндекс.xlsx)
        console.log('assortimentYM');
        const assortimentYM = (await uniqueReadExcelFile(files[1], "Ассортимент Яндекс.xlsx")).columns['Ваш SKU *'];
        // console.log(assortimentYM);

        // create folder (upload)
        const nameFolder = uuidv4();
        const pathToFiles = path.resolve('src', 'upload', nameFolder);
        console.log(0)
        fs.mkdirSync(pathToFiles);
        console.log(1)
        const pathToFilesYM =  path.resolve(pathToFiles, 'YM');
        fs.mkdirSync(pathToFilesYM);

        // workbook.useSharedStrings = false; // ?
        // console.log(workbook.useSharedStrings)
        // console.log(3)
        const keysParsePricePoiskData = Object.keys(parsePricePoiskData);
        for (const warehouseNumber of keysParsePricePoiskData) {
            console.log('warehouseNumber', warehouseNumber)
            const workbook = await readExcelFile(path.resolve('src', 'input-files', 'leftovers', 'liftovers-ym.xlsx'));

            console.log(2)
            worksheet = await workbook.getWorksheet('Остатки');
            // worksheet = await workbook.getWorksheet('Остатки');
            // await worksheet.spliceRows(0, 10000); not working
            // создавать копию в начале цикла, работать с копией, а не все время открывать файл
            // const workbook = await readExcelFile(path.resolve('src', 'input-files', 'leftovers', 'liftovers-ym.xlsx'));
            
            // worksheet = await workbook.getWorksheet('Остатки');
 
            // очистить все строки сначала
            console.log(4)
            // assortimentYM.forEach(async (sku, i) => {
            let iFact = 0;
            for (const i of [...Array(assortimentYM.length).keys()]) {
                const sku=assortimentYM[i];
                // console.log(5)
                // const rowExcel = await worksheet.getRow(i + 2).values;
                const productData = parsePricePoiskData[warehouseNumber][sku];
                if (!productData) {
                    // console.log(`Не найдены сведения об остатках для товара ${sku} из склада ${warehouseNumber}`)
                    await worksheet.addRow([ '', '', sku.toString(), '', 0], iFact + 2);
                    iFact++;
                } else {
                    // console.log('productData', productData)
                    // rowExcel.values = [ '', '', productData['Код товара'], '', productData['Ост-к']];
                    // rowExcel.getCell('C').value = productData['Код товара'];
                    // rowExcel.getCell('E').value = productData['Ост-к'];
                    const rowExcel = await worksheet.addRow([ '', '', productData['Код товара'].toString(), '', productData['Ост-к']], iFact + 2); // delete two last values  - , warehouseNumber, iFact
                    // console.log(`rowExcel.values`, rowExcel.values);
                    iFact++;
                }
            }

            console.log('before write', warehouseNumber, storeNames[warehouseNumber])
            // await sleep(100);
            
            // await worksheet.commit();
            // await workbook.xlsx.writeFile(path.resolve(pathToFilesYM, `YM-${storeNames[warehouseNumber]}-${warehouseNumber}`));
            await workbook.xlsx.writeFile(path.resolve(pathToFilesYM, `YM-${
                storeNames[warehouseNumber]
                ? storeNames[warehouseNumber]
                : 'НЕТ_ИМЕНИ'
            }-${warehouseNumber}.xlsx`));
            
            
            await sleep(100);
            console.log('after write')
        }
        return pathToFiles;
    } catch (e) {
        return { success: false };
    }
}

module.exports = {
    parsePricePoisk,
    setLeftovers,
    readExcelFile,
}