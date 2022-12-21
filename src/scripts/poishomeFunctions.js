const fs = require('fs');
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
const { checkExistance } = require('../helpers');

const getProductLinks = (files) => {
    try {
        console.log(files);
        const text = fs.readFileSync(files[0].path, 'utf8');
        console.log(text);
        return text.split('\n').filter(el => el);
    } catch (e) {
        console.log(e);
    }
}

const parseLinks = async (links) => {
    try {
        let allProductLinks = [];

        // открыть браузер
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        // цикл по товарам
        for (const link of links) {
            try {
                const links = await parse(page, link);
                console.log(`find ${links.length} links`);
                allProductLinks = [
                    ...allProductLinks,
                    ...links
                ];
            } catch (e) {
                console.log('error parseLinks');
            }
        }

        // закрыть браузер
        await browser.close();
        return allProductLinks;
    } catch (e) {
        console.log(e);
    }
}

const parse =  async(page, link) => {
    // await page.goto(link);
    let links = [];
    let i = 1;
    try {
        while (true) {
            await page.goto(`${link}/?CurrentPage=${i}`);
            i++;
            const hrefs = await page.$$eval('.catalog-item-title', as => as.map(a => a.href));
            links = [...links, ...hrefs];
            const disabledNext = await checkExistance(page, '.paginator__button.paginator__button_next.disabled');
            if (disabledNext) {
                return links;
            }
        }
        return links;
    } catch (e) {
        console.log('error');
        console.log(e);
        return links;
    }
    };

module.exports = {
    getProductLinks,
    parseLinks
}
