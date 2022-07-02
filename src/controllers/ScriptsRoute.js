const path = require('path');
const express = require('express')
const ExcelJS = require('exceljs');
const zip = require('express-zip');

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { getInfoFromFile, writeNamesAndPrices, writeRowsInExcel, calcMarkupYMAndWriteFile } = require('../helpers');

const { parseNamesAndPrices } = require('../getListProducts');

const { setPricies, showDoc, matchingAvailabilities } = require('../functions')

const { shops } = require('../consts.json');

router.route('/').post( upload.array("multFiles", 1), async (req, res, next) => {
    // #swagger.description = 'Подставляет наличие и цену из файла источника в целевые файлы'.
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['multFiles'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Загрузите сначала файл sales_dynamics, затем Шаблон загрузки линз',
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
        let content = await getInfoFromFile(req.files[0]);
        console.log('content');
        console.log(content);
        for (const nameShop of ['https://rnd.4stm.ru/']) {
            const obj = await parseNamesAndPrices(nameShop, content[nameShop].links);
            content[nameShop].names = obj && obj.names;
            content[nameShop].prices = obj && obj.prices;
            content[nameShop].codes = obj && obj.codes;
            content[nameShop].imgs = obj && obj.imgs;
        }
        // добавить названия столбцов для links, names, prices
        await writeNamesAndPrices(content);
        res.download('./result.xlsx', 'result.xlsx');
        // res.download(path.join(__dirname, '../../', req.files[0].path), 'resul.xlsx');
    } catch (e) {
        console.log('error on calculate');
        res.status(500);
    }
})

module.exports = router