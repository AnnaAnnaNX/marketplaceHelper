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
const { universalReadExcelFileNew } = require('./calsPriceAndEffFunctions');
const puppeteer = require('puppeteer');
const { sleep } = require('../functions');

const getProductLinksToBeParsed = async (files) => {
    try {
        const leftoverGoods = await universalReadExcelFileNew(files[0], 'analyticPrices остатки');
        const linksGoods = await universalReadExcelFileNew(files[1], 'analyticPrices ссылки');
        const leftoverGoodsCodes = Object.keys(leftoverGoods);
        const linksGoodsCodes = Object.keys(linksGoods);
        // if existance links for good
        const goodsCodesForParse = leftoverGoodsCodes.filter(el => linksGoodsCodes.includes(el));
        const resultLinksGoods = {};
        goodsCodesForParse.forEach(code => {
            resultLinksGoods[code] = linksGoods[code];
        });
        return resultLinksGoods;
    } catch (e) {
        console.log(e);
    }
}

const parseDevices = async (linksObj) => {
    try {
        // открыть браузер
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        // цикл по товарам
        const codes = Object.keys(linksObj);
        for (const shop of [
            'ИМ poiskhome.ru',
            'ОЗОН poskhome.ru',
            'ИМ Мвидео',
            'ОЗОН Мвидео'
        ]) {
            for (const code of codes) {
                linksObj[code];
                if (linksObj[code][shop]) {
                    try {
                        linksObj[code][`${shop} price`] = await parseDevice[shop](page, linksObj[code][shop]);
                    } catch (e) {
                        console.log(`error get price by link ${linksObj[code][shop]}`);
                    }
                }
            }
        }

        // закрыть браузер
        await browser.close();
        return linksObj;
    } catch (e) {
        console.log(e);
    }
}

const ozon = async (page, link) => {
    await page.goto(link);
    let priceText = await page.$eval('[slot="content"] span>span', el => el.innerText);
    priceText = priceText.replace(/[&thinsp;|₽| | ]/g, '');
    return priceText ? parseInt(priceText) : '';
}

const parseDevice = {
    'ИМ poiskhome.ru': async(page, link) => {
        await page.goto(link);
        const priceText = await page.$eval('.card-new-price', el => el.getAttribute('content'));
        return priceText ? parseInt(priceText) : '';
    },
    'ОЗОН poskhome.ru': ozon,
    'ИМ Мвидео': async(page, link) => {
        await page.goto(link);
        await sleep(1000);
        let priceText = await page.$eval('mvideoru-product-details-card span.price__main-value', el => el.innerText);
        priceText = priceText.replace(/[&thinsp;|₽| | | ]/g, '');
        return priceText ? parseInt(priceText) : '';
    },
    'ОЗОН Мвидео': ozon,
};

module.exports = {
    getProductLinksToBeParsed,
    parseDevices
}
