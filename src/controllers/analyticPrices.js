const express = require('express')

const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'upload/' })

const { getProductLinksToBeParsed, parseDevices } = require('../scripts/analitycPriceFunctions');
const { writeRowsInExcel } = require('../helpers');
router.route('/').post( upload.array("multFiles", 10), async (req, res, next) => {
    // #swagger.description = 'Аналитика цен. Вх файлы: остатки http://localhost:3000/1_ostatki.xlsx, ссылки http://localhost:3000/2_links.xlsx. Имена файлов должны быть без пробелов! '
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
        const linksObj = await getProductLinksToBeParsed(files);

        // парсинг
        const linksAndPricesObj = await parseDevices(linksObj);

        // записать результат в файл
        const rows = Object.keys(linksAndPricesObj).map(code => linksAndPricesObj[code]);
        await writeRowsInExcel(
            [
                'Код товара',
                'Название товара',
                'ИМ poiskhome.ru price',
                'ОЗОН poskhome.ru price',
                'ИМ Мвидео price',
                'ОЗОН Мвидео price'
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
