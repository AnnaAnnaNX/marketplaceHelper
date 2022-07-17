const path = require('path');
const express = require('express')
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const zip = require('express-zip');

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { renewAmountYM } = require('../scripts/ymRenewAmountFunctions');

router.route('/').post( upload.array("multFiles", 1), async (req, res, next) => {
    // #swagger.description = 'Обновление остатков YM. Note: .xls need save as .xlsx. Шаблон для остатков - http://localhost:3000/ymRenewSetAmount.xlsx'
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
        // return files for archive results
        const fileAmount = await renewAmountYM(req.files[0]);
        console.log('content');
        console.log(content);

        res.download(fileAmount, 'result.xlsx');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

module.exports = router