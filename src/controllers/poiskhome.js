const express = require('express')

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { getProductLinks, parseLinks, parseCharacteristics } = require('../scripts/poishomeFunctions');
const { writeRowsInExcel } = require('../helpers');
router.route('/getLinks').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Аналитика цен. Вх файлы: остатки http://localhost:3000/1_ostatki.xlsx, ссылки http://localhost:3000/2_links.xlsx. Имена файлов должны быть без пробелов! '
    /*
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['multFiles'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Загрузить файл с данными - текстовый файл - каждая ссылка на группу на новой строке',
            collectionFormat: 'multi',
            items: { type: 'file' }
        }
     */
    try {
        const files = req.files;
        console.log('files');
        console.log(files);

        // найти код чтения excel-файлов
        const links = await getProductLinks(files);

        // парсинг
        const linksProducts = await parseLinks(links);

        // записать результат в файл
        await writeRowsInExcel(
            [
                'link'
            ],
            linksProducts.map(link => ({ link }))
        );
        res.download('./result.xlsx', 'result.xlsx');
    } catch (e) {
        console.log('error on /getLinks');
        res.status(500);
    }
})

router.route('/getCharacteristics').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Аналитика цен. Вх файлы: остатки http://localhost:3000/1_ostatki.xlsx, ссылки http://localhost:3000/2_links.xlsx. Имена файлов должны быть без пробелов! '
    /*
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['multFiles'] = {
            in: 'formData',
            type: 'array',
            required: true,
            description: 'Загрузить файл с данными - ссылки на товар - простой текстовый файл - каждый ссылка на новой строке',
            collectionFormat: 'multi',
            items: { type: 'file' }
        }
     */
    try {
        const files = req.files;
        console.log('files');
        console.log(files);

        // найти код чтения excel-файлов
        const links = await getProductLinks(files);

        // парсинг
        const linksAndPricesObj = await parseCharacteristics(links);

        // записать результат в файл
        const rows = Object.keys(linksAndPricesObj).map(code => linksAndPricesObj[code]);
        console.log(rows);
        await writeRowsInExcel(
            [
                'link',
                'name',
                'category1',
                'category1Link',
                'category2',
                'category2Link',
                'category3',
                'category3Link',
                'price',
                'characteristics',
                'photosText',
                'countPhotos',
                'realNamePhotos'
            ],
            rows
        );
        res.download('./result.xlsx', 'result.xlsx');
    } catch (e) {
        console.log('error on /ym/calcEffByPrice');
        res.status(500);
    }
})



module.exports = router
