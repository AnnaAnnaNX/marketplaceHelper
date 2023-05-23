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

router.route('/ym/calcEffByPrice').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Загрузите файлы Парсинга ЯМ, price'
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

        const assort = await createUnionAssort(files, ['парсинг ЯМ', 'цены']);
        console.log(assort);

        const resultArayWithEff = ymCalculateEff(assort);
        console.log('resultArayWithEff');
        console.log(resultArayWithEff);

        const rows = Object.keys(assort).map((sku) => resultArayWithEff[sku]);
        await writeRowsInExcel([
            'sku', 'name', 'Категория товара', 'Цена продажи', 'Эффективность',
            'Закупка', 'Комиссия маркетплейса', 'Реклама', 'МГ/КГ'
        ], rows);

        res.download('./result.xlsx', 'result.xlsx');
    } catch (e) {
        console.log('error on /ym/calcEffByPrice');
        res.status(500);
    }
})

module.exports = router