const path = require('path');
const express = require('express')
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const zip = require('express-zip');

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { getInfoFromFile, writeNamesAndPricesRnd, writeRowsInExcel, calcMarkupYMAndWriteFile, getProductLinksByGroup, writeProductLink } = require('../helpers');

const { parseNamesAndPrices } = require('../getListProducts');

const { setPricies, showDoc, matchingAvailabilities } = require('../functions')

const { shops } = require('../consts.json');

router.route('/').post( upload.array("multFiles", 1), async (req, res, next) => {
    // #swagger.description = 'https://rnd.4stm.ru/ - узнать Name, price, img, code'.
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['multFiles'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Загрузить файл с ссылками',
            collectionFormat: 'multi',
            items: { type: 'file' }
        }
     */
    try {
        const files = req.files;
        console.log('files');
        console.log(files);
        if (!req.files || !req.files.length) {
            return {'error': 'not load file'};
        }
        let content = await getInfoFromFile(req.files[0]);
        console.log('content');
        console.log(content);
        const nameShop = 'https://rnd.4stm.ru/';
        // for (const nameShop of ['https://rnd.4stm.ru/']) {
        const obj = await parseNamesAndPrices(nameShop, content[nameShop].links);
        content[nameShop].links = [...content[nameShop].links.slice(1)];
        content[nameShop].names = obj && obj.names;
        content[nameShop].prices = obj && obj.prices;
        content[nameShop].imgs = obj && obj.imgs;
        content[nameShop].codes = obj && obj.codes;
        // }
        // добавить названия столбцов для links, names, prices
        await writeNamesAndPricesRnd(content);
        res.download('./result.xlsx', 'result.xlsx');
        // res.download(path.join(__dirname, '../../', req.files[0].path), 'resul.xlsx');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

router.route('/getLinks').get(async (req, res, next) => {
    // #swagger.description = 'https://rnd.4stm.ru/ - найти ссылки'.
    try {
        const groups = require('../scripts/listGroupRndTest.json');
        //const group = require('../scripts/listGroupRnd.json');

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); 

        let links = [];
        let groupsForWrite = [];
        for(let i = 0; i < groups.length; i++) {
            const newLinks = await getProductLinksByGroup(groups[i], page);
            links = [...new Set([...links, ...newLinks])];
            groupsForWrite = [ ...groupsForWrite, ...Array(newLinks.length).fill(groups[i])];
            await writeProductLink({ groups: groupsForWrite, links: links });
        }

        await browser.close();

        res.download('./result.xlsx', 'result.xlsx');
        // res.download(path.join(__dirname, '../../', req.files[0].path), 'resul.xlsx');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

module.exports = router