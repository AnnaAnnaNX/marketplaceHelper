const path = require('path');
const express = require('express')
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const zip = require('express-zip');

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { createUnionAssort } = require('../scripts/calsPriceAndEffFunctions');

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

        // res.download(fileAmount, 'result.xlsx');
        res.send('111');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

router.route('/ym/calcPriceByEff').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Загрузите файлы Парсинга ЯМ, eff'
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

        const assort = await createUnionAssort(files, ['парсинг ЯМ', 'процент эффективности']);
        console.log(assort);

        // res.download(fileAmount, 'result.xlsx');
        res.send('111');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

router.route('/ozon/calcEffByPrice').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Загрузите файлы Закупка, Шаблон цен, price'
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

        const assort = await createUnionAssort(files, ['закупка Ozon', 'шаблон цен Ozon', 'цены']);
        console.log(assort);

        // res.download(fileAmount, 'result.xlsx');
        res.send('111');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

router.route('/ozon/calcPriceByEff').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Загрузите файлы Закупка, Шаблон цен, eff'
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

        const assort = await createUnionAssort(files, ['закупка Ozon', 'шаблон цен Ozon', 'процент эффективности']);
        console.log(assort);

        // res.download(fileAmount, 'result.xlsx');
        res.send('111');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

module.exports = router