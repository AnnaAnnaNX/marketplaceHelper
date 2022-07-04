const path = require('path');
const express = require('express')
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const zip = require('express-zip');

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { getInfoFromFile, writeNamesAndPricesRnd, writeRowsInExcel, calcMarkupYMAndWriteFile, getProductLinksByGroup, writeProductLink } = require('../helpers');

const { parsePersentProducts, writeResultColumnsYMProfit } = require('../scripts/ymProfitPersentFunctions');

const { parseNamesAndPrices } = require('../getListProducts');

const { setPricies, showDoc, matchingAvailabilities } = require('../functions')

const { getInfoFromFileKonkurenty, parsePricesNamesDeliveryKonkurent, writeResultColumns } = require('../scripts/konkurentyScripts.js');

const { shops } = require('../consts.json');

router.route('/').post( upload.array("multFiles", 1), async (req, res, next) => {
    // #swagger.description = 'YM маржа, парсинг процента комиссии. Логин, пароль от аккаунта ЯМ. Результат - файл с столбцами sku, name, persent, delivery.'
    /*
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['login'] = {
            in: 'formData',
            type: 'string',
            required: false,
        }
        #swagger.parameters['password'] = {
            in: 'formData',
            type: 'string',
            required: false,
        }
     */
    try {
        const inputParams = {};
        inputParams.groupLink = 'https://partner.market.yandex.ru/supplier/26020183/assortment';
        inputParams.login = req.login || 'AnnaAnnaNX@yandex.ru';
        inputParams.password = req.password || 'Visuzu54';
            
        const persentProducts = await parsePersentProducts(inputParams);

        // добавить названия столбцов для links, names, prices
        await writeResultColumnsYMProfit(persentProducts);
        res.download('./result.xlsx', 'result.xlsx');
        // res.download(path.join(__dirname, '../../', req.files[0].path), 'resul.xlsx');
    } catch (e) {
        console.log('error on YM-маржа');
        console.log(e);
        res.status(500);
    }
})

module.exports = router