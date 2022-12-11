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
        for (const shop of ['ИМ poiskhome.ru', 'ОЗОН poskhome.ru', 'ИМ Мвидео', 'ОЗОН Мвидео']) {
            for (const code of codes) {
                linksObj[code];
                if (linksObj[code][shop]) {
                    linksObj[code][`${shop} price`] = await parseDevice[shop](page, linksObj[code][shop]);
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

const parseDevice = {
    'ИМ poiskhome.ru': async(page, link) => {
        await page.goto(link);
        const priceText = await page.$eval('.card-new-price', el => el.getAttribute('content'));
        return priceText ? parseInt(priceText) : '-';
    },
    'ОЗОН poskhome.ru': async(link) => {return 1;},
    'ИМ Мвидео': async(link) => {return 1;},
    'ОЗОН Мвидео': async(link) => {return 1;},
};

module.exports = {
    getProductLinksToBeParsed,
    parseDevices,
}
