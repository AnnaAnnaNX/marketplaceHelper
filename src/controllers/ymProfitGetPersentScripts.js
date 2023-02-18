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
        #swagger.parameters['assortimentLink'] = {
            in: 'formData',
            type: 'string',
            required: false,
        }
     */
    try {
        const inputParams = {};
        inputParams.login = (req.body && req.body.login) || 'AnnaAnnaNX@yandex.ru';
        inputParams.password = (req.body && req.body.password) || 'fsdg646KUJGKI___';
        inputParams.assortimentLink = (req.body && req.body.assortimentLink) || 'https://partner.market.yandex.ru/supplier/26020183/assortment';

        const persentProducts = await parsePersentProducts(inputParams);

        // добавить названия столбцов для links, names, prices
        const pathToResultFile = await writeResultColumnsYMProfit(persentProducts);
        console.log('pathToResultFile');
        console.log(pathToResultFile);
        res.download(pathToResultFile, 'result.xlsx');
    } catch (e) {
        console.log('error on YM-маржа');
        console.log(e);
        res.status(500);
    }
})

module.exports = router
