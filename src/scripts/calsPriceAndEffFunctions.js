const ExcelJS = require('exceljs');
const { fileInfoForReadFile } = require('../consts');
const {
    normalizeCells,
    getNumberColumnByHeaders,
    createObjectFromColumns,
    setMinMax
 } = require('../utils');
const _ = require("lodash");
const {
    ymEffByPrice,
    ymPriceByEff,
    ozonEffByPrice,
    ozonPriceByEff
} = require('../calculateMarketplaceCommission/index');
const path = require('path');

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
        const arr = worksheet.getColumn(nSkuColumn).values;
        columns[info.skuColumnName] = info.formatters && info.formatters['sku']
            ? worksheet.getColumn(nSkuColumn).values.slice(info.rowBeginProduct).map(el => (el.text ? el.text : el)).map(info.formatters['sku'])
            : worksheet.getColumn(nSkuColumn).values.slice(info.rowBeginProduct).map(el => (el.text ? el.text : el));
        info.columnsNames.forEach((header, i) => {
            const arr = worksheet.getColumn(nColumns[i]).values;
            columns[header] = info.formatters &&  info.formatters[header]
                ? worksheet.getColumn(nColumns[i]).values.slice(info.rowBeginProduct).map(el => (el.text ? el.text : el)).map(info.formatters[header])
                : worksheet.getColumn(nColumns[i]).values.slice(info.rowBeginProduct).map(el => (el.text ? el.text : el));
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
        console.log('obj');
        console.log(obj);
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

const ymCalculateEff = (assort) => {
    try {
        const skuList = Object.keys(assort);
        skuList.forEach((sku) => {
            const obj = assort[sku];

            try {
                obj['МГ/КГ'] = obj['delivery'] == 400 ? 'КГ' : 'МГ';
                const { eff, commission } = ymEffByPrice(
                    parseFloat(obj['Цена продажи']),
                    parseFloat(obj['Закупка']),
                    parseFloat(obj['persent']),
                    parseFloat(obj['Процент за прием денег от клиента']),
                    parseFloat(obj['Процент рекламы']),
                    obj['МГ/КГ']
                );
                obj['Эффективность'] = eff;
                obj['Комиссия маркетплейса'] = commission;
            } catch (e) {
                obj['Эффективность'] = '-';
                obj['Комиссия маркетплейса'] = '-';
            }

            // obj['МГ/КГ'] = obj['delivery'] == 400 ? 'КГ' : 'МГ';
            // obj['Размещение товаров на витрине'] = parseFloat(obj['Цена продажи'])
            //     * parseFloat(obj['persent']) / 100;
            // obj['Приём и перевод платежа покупателя'] = parseFloat(obj['Цена продажи'])
            //     * parseFloat(obj['Процент за прием денег от клиента']) / 100;
            // if (obj['МГ/КГ'] === 'КГ') {
            //     obj['Доставка покупателю'] = 400;
            // } else {
            //     const val = parseFloat(obj['Цена продажи']) * 0.05;
            //     obj['Доставка покупателю'] = setMinMax(val, 60, 350);
            // }
            // obj['Обработка заказа в сортировочном центре или пункте приема'] = 45;

            // obj['Комиссия маркетплейса'] = parseFloat(obj['Размещение товаров на витрине'])
            //     + parseFloat(obj['Приём и перевод платежа покупателя'])
            //     + parseFloat(obj['Доставка покупателю'])
            //     + parseFloat(obj['Обработка заказа в сортировочном центре или пункте приема']);

            // obj['Реклама'] = parseFloat(obj['Цена продажи'])
            //     * parseFloat(obj['Процент рекламы']) / 100;

            // obj['Эффективность'] = (parseFloat(obj['Цена продажи'])
            //     - parseFloat(obj['Закупка'])
            //     - parseFloat(obj['Комиссия маркетплейса'])
            //     - parseFloat(obj['Реклама'])) / parseFloat(obj['Закупка']);
            assort[sku] = obj;
        });
        return assort;
    } catch(e) {
        console.log(e);
        throw new Error();
    }
}


const ymCalculatePrice = (assort) => {
    try {
        const skuList = Object.keys(assort);
        skuList.forEach((sku) => {
            const obj = assort[sku];
            obj['МГ/КГ'] = obj['delivery'] == 400 ? 'КГ' : 'МГ';



            try {
                obj['МГ/КГ'] = obj['delivery'] == 400 ? 'КГ' : 'МГ';
                obj['Цена продажи'] = ymPriceByEff(
                    parseFloat(obj['Эффективность']),
                    parseFloat(obj['Закупка']),
                    parseFloat(obj['persent']),
                    parseFloat(obj['Процент за прием денег от клиента']),
                    parseFloat(obj['Процент рекламы']),
                    obj['МГ/КГ']
                );
            } catch (e) {
                obj['Цена продажи'] = '-';
            }

            assort[sku] = obj;
        });
        return assort;
    } catch(e) {
        console.log(e);
        throw new Error();
    }
}

const ozonCalculateEff = (assort) => {
    try {
        const skuList = Object.keys(assort);
        skuList.forEach((sku) => {
            const obj = assort[sku];

            try {
                obj['МГ/КГ'] = parseInt(obj['Последняя миля, FBS'], 10) == 0 ? 'КГ' : 'МГ';
                const { eff, commission } =  ozonEffByPrice(
                    parseFloat(obj['Цена продажи']),
                    parseFloat(obj['ЗЦ, руб.']),
                    parseFloat(obj['Размер комиссии, %']),
                    parseFloat(obj['Комиссия за рекламу']),
                    parseFloat(obj['Объемный вес, кг']),
                    obj['МГ/КГ']
                );
                obj['Эффективность'] = eff;
                obj['Комиссия маркетплейса'] = commission;
            } catch (e) {
                obj['Эффективность'] = '-';
                obj['Комиссия маркетплейса'] = '-';
            }
            assort[sku] = obj;
        });
        return assort;
    } catch(e) {
        console.log(e);
        throw new Error();
    }
}


const ozonCalculatePrice = (assort) => {
    try {
        const skuList = Object.keys(assort);
        skuList.forEach((sku) => {
            const obj = assort[sku];
            obj['МГ/КГ'] = obj['delivery'] == 400 ? 'КГ' : 'МГ';
            try {
                obj['МГ/КГ'] = obj['delivery'] == 400 ? 'КГ' : 'МГ';
                obj['Цена продажи'] = ozonPriceByEff(
                    parseFloat(obj['Эффективность']),
                    parseFloat(obj['ЗЦ, руб.']),
                    parseFloat(obj['Размер комиссии, %']),
                    parseFloat(obj['Комиссия за рекламу']),
                    parseFloat(obj['Объемный вес, кг']),
                    obj['МГ/КГ']
                );
            } catch (e) {
                obj['Цена продажи'] = '-';
            }
            assort[sku] = obj;
        });
        return assort;
    } catch(e) {
        console.log(e);
        throw new Error();
    }
}

const reorderFiles = async (filesOrder, realFiles) => {
  try {
    // const filesOrder = ['парсинг ЯМ', 'процент эффективности']
    const tabsForFilesOrder = filesOrder
      .map(fileName => (fileInfoForReadFile[fileName].tagName))

    // get realFileTabNames
    // read files in circle
    const workbook = new ExcelJS.Workbook();
    let realFileTabs = []
    for(const file of realFiles){
      const excelFile = await workbook.xlsx.readFile(file.path)
      const tabs = workbook._worksheets.map(tab => (tab.name)).filter(el => el)
      realFileTabs.push(tabs)
    }

    const files = []
    for(const requiredTab of tabsForFilesOrder){
      for(const [i, tabs] of Object.entries(realFileTabs)) {
        if (tabs.includes(requiredTab)) {
          files.push(realFiles[i])
          realFileTabs = [...realFileTabs.slice(0, i), ...realFileTabs.slice(i, realFileTabs.length)]
          realFiles = [...realFiles.slice(0, i), ...realFiles.slice(i, realFileTabs.length)]
          break
        }
      }
    }
    return files
  } catch(e) {
    console.log(e)
    throw new Error()
  }
}

module.exports = {
    createUnionAssort,
    ymCalculateEff,
    ymCalculatePrice,
    ozonCalculateEff,
    ozonCalculatePrice,
    universalReadExcelFileNew,
    reorderFiles
}
