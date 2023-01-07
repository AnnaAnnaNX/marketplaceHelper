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
const { checkExistance } = require('../helpers')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const request = require('request');

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
                    // ...links
                    links[0]
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
        while (i <= 1) {
            await page.goto(`${link}/?CurrentPage=${i}`);
            i++;
            const hrefs = await page.$$eval('.catalog-item-title', as => as.map(a => a.href));
            links = [...links, ...hrefs];
            // const disabledNext = await checkExistance(page, '.paginator__button.paginator__button_next.disabled');
            // if (disabledNext) {
                return links;
            // }
        }
        return links;
    } catch (e) {
        console.log('error');
        console.log(e);
        return links;
    }
};
const parseCharacteristics = async (links) => {
    try {
        const dirName = path.resolve(__dirname, '../','photos', uuidv4());
        console.log(`folder with photos ${dirName}`);
        fs.mkdirSync(dirName);

        // открыть браузер
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        // цикл по товарам
        const linksObj = {};
        for (const link of links) {
            try {
                linksObj[link] = await parseDevice(page, link, dirName);
            } catch (e) {
                console.log(`error parseCharacteristics ${link}`);
                console.log(e);
            }
        }

        // закрыть браузер
        await browser.close();
        return linksObj;
    } catch (e) {
        console.log('Error');
        console.log(e);
    }
}

const download = function(uri, dirname, filename, callback){
    const fullFilename = path.resolve(dirname, filename);
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(fullFilename)).on('close', callback);
    });
};

const parseDevice = async(page, link, dirName) => {
    await page.goto(link);
    const name = await page.$eval('.card-name', el => el.innerText);
    let categoryArray = await page.$$eval(".horizontal-menu li a", (list) => list.map((elm) => ({name: elm.innerText, link: elm.getAttribute('href')})));

    console.log('categoryArray');
    console.log(categoryArray);

    categoryArray.pop();

    const priceText = await page.$eval('.card-new-price', el => el.getAttribute('content'));
    const characteristics = await page.$eval('section#specifications', el => el.innerText);
    // const characteristics = (await page.$$eval("section#specifications td", (list) => list.map((elm) => elm.textContent)));

    let photos = [];
    photos = await page.$$eval(".card-carousel-img", (list) => list.map((elm) => 'https://poiskhome.ru' + elm.getAttribute('rel')));
    if (!photos.length) {
        photos = [await page.$eval('.img-responsive', el => ('https://poiskhome.ru' + el.getAttribute('src')))];
    }
    const photosText = photos.join(';');

    let realNamePhotos = [];
    const linkArr = link.split('/');
    const filename = linkArr[linkArr.length - 1];
    let i = 1;
    for (const photo of photos) {
        const currentFilename = `${filename}_${i}`;
        i++;
        let newFilename = '';
        await download(photo, dirName,  currentFilename, () => {});
        console.log('newFilename');
        console.log(newFilename);
        // console.log(result);
        realNamePhotos.push(path.resolve(dirName,  currentFilename));
    }
    // realNamePhotos = realNamePhotos.join(';');

    const price = priceText ? parseInt(priceText) : '';
    return {
        link,
        name,
        category1: categoryArray[1] && categoryArray[1].name,
        category1Link: categoryArray[1] && categoryArray[1].link,
        category2: categoryArray[2] && categoryArray[2].name,
        category2Link: categoryArray[2] && categoryArray[2].link,
        category3: categoryArray[3] && categoryArray[3].name,
        category3Link: categoryArray[3] && categoryArray[3].link,
        price,
        characteristics,
        photosText,
        countPhotos: realNamePhotos.length,
        realNamePhotos: realNamePhotos.join(';'),
    }
};

module.exports = {
    getProductLinks,
    parseLinks,
    parseCharacteristics,
    download
}
