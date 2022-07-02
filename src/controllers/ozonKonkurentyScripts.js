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

const { getInfoFromFileKonkurenty, parsePricesNamesDeliveryKonkurent, writeResultColumns } = require('../scripts/konkurentyScripts.js');

const { shops } = require('../consts.json');

router.route('/').post( upload.array("multFiles", 1), async (req, res, next) => {
    // #swagger.description = 'Ozon-конкуренты. Вх файл - список запросов для поиска https://www.ozon.ru/search/?from_global=true&sorting=price&text=CATKLF-GG1 Пример входного файла http://localhost:3000/inputFileOzonKonkurenty.xlsx'
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
        let content = await getInfoFromFileKonkurenty(req.files[0]);
        console.log('content');
        console.log(content);
        const pricesNamesDeliveryKonkurent = await parsePricesNamesDeliveryKonkurent(content.searchesList);
            
        // добавить названия столбцов для links, names, prices
        await writeResultColumns({
            ...content,
            ...pricesNamesDeliveryKonkurent
        });
        res.download('./result.xlsx', 'result.xlsx');
        // res.download(path.join(__dirname, '../../', req.files[0].path), 'resul.xlsx');
    } catch (e) {
        console.log('error on Ozon-конкуренты');
        res.status(500);
    }
})

module.exports = router