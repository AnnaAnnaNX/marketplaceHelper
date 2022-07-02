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

const { getDataForReport, writeReports } = require('../scripts/createReportFunctions');

const { shops } = require('../consts.json');

router.route('/').post( upload.array("multFiles", 1), async (req, res, next) => {
    // #swagger.description = 'create report - result two tabs in file: FBO and FBS. Сохранить исх файл в LibbreOffice перед вычислением!'
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