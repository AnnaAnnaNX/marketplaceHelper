const path = require('path');
const express = require('express')
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const zip = require('express-zip');

const router = express.Router()

const { getInfoFromFile, writeNamesAndPricesRnd, writeRowsInExcel, calcMarkupYMAndWriteFile, getProductLinksByGroup, writeProductLink } = require('../helpers');

const { parseNamesAndPrices } = require('../getListProducts');

const { setPricies, showDoc, matchingAvailabilities } = require('../functions')

const { getDataForReport, writeReports } = require('../scripts/createReportFunctions');

const { shops } = require('../consts.json');

router.route('/').post(async (req, res, next) => {
    
    // #swagger.description = 'маржа Ozon: для переданного магазина создается файл со значениями'
    /*  #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Some description...',
            schema: {
                $shop: 'Base Station',
            }
    } */


    try {
        console.log(req.obj);
        console.log(req.body);
        const files = req.files;
        console.log('files');
        console.log(files);
        if (!req.files || !req.files.length) {
            return {'error': 'not load file'};
        }
        let content = await getDataForReport(req.files[0]);
        console.log('content');
        console.log(content);

        await writeReports(content);

        res.download('./result.xlsx', 'result.xlsx');
        // res.download(path.join(__dirname, '../../', req.files[0].path), 'resul.xlsx');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

module.exports = router