const path = require('path');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const { typeFilesWithFields } = require('./consts.json');
const { shops } = require('./consts.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const writeNamesAndPrices = async (content) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ассортимент');
        const filePath = path.join(__dirname, '../result.xlsx');

        // for (const nameShop of Object.keys(shops)) {
        //     const obj = await parseNamesAndPrices(nameShop, content[nameShop].links);
        //     // content = await parseShop('nameShop', content, req.files[0]);
        //     content[nameShop].names = obj && obj.names;
        //     content[nameShop].prices = obj && obj.prices;
        // }
        for (let i = 0; i < Object.keys(shops).length; i++) {
            worksheet.getColumn(i*2 + 1).values = content[Object.keys(shops)[i]].names;
            // if (true) {worksheet.getColumn(i*3 + 1).values = content[Object.keys(shops)[i]].links;}
            worksheet.getColumn(i*2 + 2).values = content[Object.keys(shops)[i]].prices;
        }
        for (let i = 0; i < 9; i++) {
            worksheet.getColumn(i + 1).width = 30;
       }

        await workbook.xlsx.writeFile('./result.xlsx');

    } catch(e) {
        console.log('writeNamesAndPrices');
        console.log(e);
    }
}

const writeNamesAndPricesRnd = async (content) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Лист1');
        const filePath = path.join(__dirname, '../result.xlsx');

        // for (const nameShop of Object.keys(shops)) {
        //     const obj = await parseNamesAndPrices(nameShop, content[nameShop].links);
        //     // content = await parseShop('nameShop', content, req.files[0]);
        //     content[nameShop].names = obj && obj.names;
        //     content[nameShop].prices = obj && obj.prices;
        // }
        const nameShop = 'https://rnd.4stm.ru/';
        // for (let i = 0; i < Object.keys(shops).length; i++) {
        worksheet.getColumn(1).values = content[nameShop].links;
        // if (true) {worksheet.getColumn(i*3 + 1).values = content[Object.keys(shops)[i]].links;}
        worksheet.getColumn(2).values = content[nameShop].names;
        worksheet.getColumn(3).values = content[nameShop].prices;
        worksheet.getColumn(4).values = content[nameShop].imgs;
        worksheet.getColumn(5).values = content[nameShop].codes;
        // }
        // for (let i = 0; i < 9; i++) {
        //     worksheet.getColumn(i + 1).width = 30;
        // }

        await workbook.xlsx.writeFile('./result.xlsx');

    } catch(e) {
        console.log('writeNamesAndPrices');
        console.log(e);
    }
}

const writeProductLink = async (content) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Лист1');
        const filePath = path.join(__dirname, '../result.xlsx');
        worksheet.getColumn(1).values = content.groups;
        worksheet.getColumn(2).values = content.links;
        await workbook.xlsx.writeFile('./result.xlsx');

    } catch(e) {
        console.log('writeProductLink');
        console.log(e);
    }
}

const writeRowsInExcel = async (headers, rows) => {
    try {
        // try {
        //     fs.unlinkSync(path.join(__dirname, '../result.xlsx'));
        // } catch(e) {}

        // const headers = req && req.body && req.body.headers;
        // const rows = req && req.body && req.body.rows;
        console.log('headers');
        console.log(headers);
        console.log('rows');
        console.log(rows);
        // res.status(200).json({ data: rows });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ассортимент');
        // const filePath = path.join(__dirname, '../result.xlsx');
        const filePath = path.join(__dirname, '../', 'results', `${uuidv4()}.xlsx`);

        const headersArr = headers.map(el => (el.value ? el.value : el));
        const rowsArr = rows.map(row => {
            const arr = [];
            headersArr.forEach((header) => {
                if (row && header && row[header]) {
                    arr.push(row[header]);
                } else {
                    arr.push(null);
                }
            });
            return arr;
        });
        const alf = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const rowExcel = worksheet.getRow(1);
        headersArr.forEach((header, j) => {
            rowExcel.getCell(alf[j]).value = header;
        });
        rowsArr.forEach((row, i) => {
            const rowExcel = worksheet.getRow(i + 2);
            headersArr.forEach((header, j) => {
                rowExcel.getCell(alf[j]).value = row[j];
            });
        })


        for (let i = 0; i < headersArr.length; i++) {
            if (worksheet.getColumn(i)) worksheet.getColumn(i).width = 30;
        }

        await workbook.xlsx.writeFile(filePath);


        // await setPricies(files[0]);


        // res.download(filePath);
        return filePath;

    } catch (error) {
        return { error: error.message };
    }
}

const format = (val, fieldName) => {
    if (!val || (typeof val === 'number')) {
        return val;
    }
    console.log(`val - ${val}`);
    if ((fieldName === 'quantityGoodsAtOurStore')
    || (fieldName === 'quantityGoodsAtSupplier')
    || (fieldName === 'count')) {
        const q = val.replace(/</gi, '').replace(/>/gi, '');
        console.log(`q = ${q}`);
        return parseInt(q, 10);
    }
    if ((fieldName === 'retailPrice')
    || (fieldName === 'purchasePrice')) {
        return  parseInt(val.replace(/ /gi, ''), 10);
    }
    return val;
}

const getCellText = (cell) => {
    if (typeof cell === 'string') {
        return cell;
    }
    console.log(cell
        && cell.richText
        && (typeof cell.richText))
    if (cell
        && cell.richText
        && (typeof cell.richText === 'object')) {
            const texts = cell.richText.map((el) => (el && el.text));
            return texts.join('');
    }
}

const getExcelNumbersColumns = async (worksheet) => {
    try {
        const row = await worksheet.getRow(3).values;
        row;
        const rowValues = row.map((el) => {
            console.log(typeof el);
            const val = getCellText(el);
            return val && val.trim();
        });

        console.log(rowValues);

        return [
            "Название товара *",
            "Цена *",
            "Вес с упаковкой, кг *",
            "Ваш SKU *",
            "Габариты с упаковкой, см *"
        ].map((name) => {
            return rowValues.indexOf(name);
        });
    } catch (e) {
        console.log(e);
        return null;
    }
}

const getInfoFromFile = async (file) => {
    const content = {};
    let worksheet = null;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);

    worksheet = await workbook.getWorksheet('Лист1');
    if (!worksheet) {
        worksheet = await workbook.getWorksheet(1);
    }

    for (const nameShop of Object.keys(shops)) {
        content[nameShop] = {};
        const links = worksheet.getColumn(shops[nameShop].columnNumber).values;
        content[nameShop].links = links.map((el) => (el && el.text ? el.text : el));
    }

    return content;
}

async function readYMOutput(file) {
    console.log('readYMOutput');
    // get product info while type file
    const content = await getInfoFromFile('ym', file);
    return content;

}

const getGabar = (row) => {
    if (!row
        || !row.weightKg
        || !row.lenths) {
        return null;
    }
    const weight = parseFloat(row.weightKg);
    if (weight >= 15) {
        return 'Крупногабарит';
    }
    const arr = row.lenths.split('/').map((el) => (parseFloat(el)));
    if (!arr || arr.length < 3) {
        return null;
    }
    let isLittle = true;
    arr.forEach((el) => {if (el>=150) {isLittle = false;}});
    if (isLittle) {
        return 'Мелкогабарит';
    }
    return 'Крупногабарит';
}

const normalize = (val, minim, maxim) => {
    if (val < minim) return minim;
    if (val > maxim) return maxim;
    return val;
}

const getFBYStore = (gabar, price) => {
    if (!gabar || !price) {
        return new Error();
    }
    if (gabar === 'Мелкогабарит') {
        return normalize(price*.04, 25, 100);
    }
    if (gabar === 'Крупногабарит') {
        return 250;
    }
    return new Error();
}

const formatNum = (num) => {
    console.log('num');
    console.log(num);
    if (!num) {
        return 0;
    }
    // if (typeof num !== 'number') {
    //     return num;
    // }
    try {
        return num.toFixed(2);
    } catch (e) {
        console.log(num);
        return 0;
    }
}

const calcMarkupYMAndWriteFile = async (content) => {
    try {
        console.log('calcMarkupYMAndWriteFile');

        const contentWithGabar = content.map((row) => {
            const price = parseFloat(row.retailPrice);
            if (!row.retailPrice) {
                return {
                    ...row,
                    errors: 'empty price'
                };
            }
            // const weight = row.weightKg;
            // ['Габариты с упаковкой, см *']
            const gabar = getGabar(row);
            if ((gabar !== 'Мелкогабарит')
                && (gabar !== 'Крупногабарит')) {
                    return {
                        ...row,
                        errors: 'не получилось определить габарит'
                    };
            }
            console.log(`gabar ${gabar}`);
            const razmNaVitr = price * .07; // "Комиссия за размещение на витрине"
            const agentVozn = price * .01; // "Прием и перечисление денег от покупателя (агентское вознаграждение)""
            const store = []; // "Обработка и хранение товара на складе"
            store.fby = getFBYStore(gabar, price);
            const otgr = [];// "Отгрузка заказа в сортировочный центр или пункт приема"
            otgr.fbs = 30;
            const magMin = [];// "Магистраль Min"
            if (gabar === 'Мелкогабарит') {
                magMin.fbs = normalize(price * 0.01, 25, 250);
            } else {
                magMin.fbs = normalize(price * 0.01, 25, 500);
            }
            if (gabar === 'Мелкогабарит') {
                magMin.fby = normalize(price * 0.01, 10, 100);
            } else {
                magMin.fby = normalize(price * 0.01, 50, 500);
            }
            const magMax = [];// "Магистраль Max"
            if (gabar === 'Мелкогабарит') {
                magMax.fbs = normalize(price * 0.05, 50, 500);
            } else {
                magMax.fbs = normalize(price * 0.05, 125, 1500);
            }
            if (gabar === 'Мелкогабарит') {
                magMax.fby = normalize(price * 0.01, 10, 100);
            } else {
                magMax.fby = normalize(price * 0.01, 50, 500);
            }
            const dostPotr = [];// "Стоимость услуг по доставке Товаров Потребителям"
            if (gabar === 'Мелкогабарит') {
                dostPotr.fbs = normalize(price * 0.04, 55, 200);
            } else {
                dostPotr.fbs = 350;
            }
            if (gabar === 'Мелкогабарит') {
                dostPotr.fby = normalize(price * 0.04, 25, 100);
            } else {
                dostPotr.fby = 250;
            }
            dostPotr.expr = normalize(price * 0.04, 55, 200);

            const arr = {};
            ['fbs', 'dbs', 'fby', 'expr'].forEach((model) => {
                console.log(model);
                let val = 0;let text = [];
                val += razmNaVitr || 0; text.push(`размещение на витрине(${formatNum(razmNaVitr)})`);
                val += agentVozn || 0; text.push(`агентское вознаграждение(${formatNum(agentVozn)})`);
                val += store[model] || 0; text.push(`обработка и хранение товара на складе(${formatNum(store[model])})`);
                val += otgr[model] || 0; text.push(`отгрузка заказа в пункт приема(${formatNum(otgr[model])})`);
                // val += magMin[model] || 0; text.push(`Магистраль Min(${formatNum(magMin[model])})`);
                text.push(`Магистраль Min(${formatNum(magMin[model])})`);
                // val += magMax[model] || 0; text.push(`Магистраль Max(${formatNum(magMax[model])})`);
                text.push(`Магистраль Max(${formatNum(magMax[model])})`);
                val += dostPotr[model] || 0; text.push(`доставке потребителям(${formatNum(dostPotr[model])})`);

                console.log(text.join(', '));
                arr[model] = {
                    'min': val,
                    'max': val + Math.max(magMin[model] || 0, magMax[model] || 0),
                    'text': text.join(', ')
                };
            });


            return {
                ...row,
                gabar,
                fbsMin: arr.fbs.min,
                fbsMax: arr.fbs.max,
                fbsText: arr.fbs.text,
                dbs: arr.dbs.min,
                dbsText: arr.dbs.text,
                fbyMin: arr.fby.min,
                fbyMax: arr.fby.max,
                fbyText: arr.fby.text,
                expr: arr.expr.min
            }
        });

        return contentWithGabar;
    } catch (e) {
        console.log('error on ');
        console.log(e);
        return new Error(e);
    }
}

const checkExistance = async (page, selector) => {
    try {
        await page.waitForSelector(selector);
    } catch(e) {}
    const elsCount = await page.$$eval(selector, els => els.length);

    console.log('elsCount length');
    console.log(elsCount);
    if (!elsCount) {
      console.log('there are not tag for '+selector+' selector');
      return null;
    }
    return true;
}

const getProductLinksByGroup = async (group, page) => {
    try {
        // const browser = await puppeteer.launch({ headless: false });
        // const page = await browser.newPage();
        // await page.setDefaultNavigationTimeout(0);

        // get count page
        await page.goto(`${group}?page=1`);
        let countPage = 1;
        if (!(await checkExistance(page, '.results'))) {
            console.log('not found .results');
        } else {
            name = await page.$eval('.results', el => el.innerText);
            const arr = / (\d)*\).$/g.exec(name);
            countPage = arr && arr[1] && arr[1].toString() || 1;
        }

        // get links in array
        let links = [];
        for (let i = 1; i <= countPage; i++) {
            await page.goto(`${group}?page=${i}`);
            const newLinks = await page.$$eval(".good-title a", (list) => list.map((elm) => elm.href));
            links = [...links, ...newLinks]
        }

        // await browser.close();

        return links;
    } catch (e) {
        return { error: e }
    }
}

module.exports = {
    writeNamesAndPrices,
    writeNamesAndPricesRnd,
    getInfoFromFile,
    readYMOutput,
    writeRowsInExcel,
    calcMarkupYMAndWriteFile,
    getProductLinksByGroup,
    writeProductLink,
    checkExistance
}
