const path = require('path');
const fs = require('fs');
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

const { setLeftovers } = require('../scripts/setLeftoversFunctions');

router.route('/').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Получение остатков по складам.'
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['multFiles'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Загрузить файл с данными',
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
        const pathToFiles = await setLeftovers(req.files);

        // res.zip(fs.readdirSync(path.resolve(pathToFiles, 'YM')));
        const pathFolder = pathToFiles; // path.resolve('src', 'upload', '027022c2-41bd-45d6-bfcb-24e049abbdd2');
        const pathFolderYM = path.resolve(pathFolder, 'YM');
        const listFiles = fs.readdirSync(pathFolderYM)
          .map((nameFile) => ({
            path: path.resolve(pathFolderYM, nameFile),
            name: nameFile
          }));
        console.log(listFiles);
        res.zip(listFiles);
        // res.download('result.xlsx', 'result.xlsx');
    } catch (e) {
        console.log('error on YM-маржа');
        console.log(e);
        res.status(500);
    }
})

module.exports = router
