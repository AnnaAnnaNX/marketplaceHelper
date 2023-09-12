const path = require('path');
const express = require('express')
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const zip = require('express-zip');

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { createUnionAssort, ymCalculateEff, ymCalculatePrice, ozonCalculateEff, ozonCalculatePrice } = require('../scripts/calsPriceAndEffFunctions');

const { writeRowsInExcel } = require('../helpers');

const { universalReadExcelFileNew } = require('../scripts/calsPriceAndEffFunctions')
const { ozonParseProductInfo } = require('../scripts/ozonParseProductInfo')

router.route('/ym/calcEffByPrice').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Загрузите файл с товарами и ссылками на товары конкурентов'
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

        const assort = await universalReadExcelFileNew(files[0], 'ozon product info');
        // console.log(assort);

        const result = await ozonParseProductInfo(assort)
        // console.log(result)


        const rows = Object.keys(result).map((sku) => result[sku]);
        const fileProductInfo = await writeRowsInExcel([
            'id',
            'Конкурент 1 на озоне цена',
            'Конкурент 2 на озоне цена',
            'Конкурент 3 на озоне цена',
            'Конкурент 4 на озоне цена',
            'Конкурент 5 на озоне цена'
        ], rows);

        res.download(fileProductInfo, 'result.xlsx');
    } catch (e) {
        console.log('error on /ym/calcEffByPrice');
        res.status(500);
    }
})

module.exports = router