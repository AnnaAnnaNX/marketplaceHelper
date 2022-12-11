const express = require('express')

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { getProductLinksToBeParsed } = require('../scripts/analitycPriceFunctions');

router.route('/').post( upload.array("multFiles", 10), async (req, res, next) => {
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

        // найти код чтения excel-файлов
        const links = await getProductLinksToBeParsed(files);

        // найти код парсинга товара по списку ссылок

        // найти код записи в excel-файл

        // res.download('./result.xlsx', 'result.xlsx');
    } catch (e) {
        console.log('error on /ym/calcEffByPrice');
        res.status(500);
    }
})

module.exports = router
