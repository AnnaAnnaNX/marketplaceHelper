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
        // const files = req.files;
        // console.log('files');
        // console.log(files);
        //
        // const assort = await universalReadExcelFileNew(files[0], 'ozon product info');
        // console.log(assort);
        //
        // const result = await ozonParseProductInfo(assort)
        // console.log(result)


const result = {
    "961": {
        "id": "961",
        "Конкурент 1 на озоне": "https://www.ozon.ru/product/koltso-uplotnitelnoe-prokladka-dlya-kolby-sistemy-ochistki-vody-10sl-723693161/?asb=Vr2xOG%252F5hEqVqSlUvGH8PD4oL33ZEi8NrpCdmI4ZPow%253D&asb2=m-Ow-iqZHChhjls3Fu1iY6wS8YrdVtKemcSWkFc5X5mi_cwWwXnDEaNV7gARoIk7&avtc=1&avte=2&avts=1694094442&keywords=%D0%9A%D0%BE%D0%BB%D1%8C%D1%86%D0%BE+%D1%83%D0%BF%D0%BB%D0%BE%D1%82%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%BE%D0%BB%D0%B1%D1%8B+10%22&sh=xvDpuvc3kA",
        "Конкурент 2 на озоне": "https://www.ozon.ru/product/uplotnitelnoe-koltso-dlya-kolby-filtrov-10-sl-unicorn-757715687/?asb=LSzULhjN8q90ntPzo4VZ9t0lX5W7PysKAdI3IrT5eWg%253D&asb2=ICs0dWtkNOU1qNWwTK-VJSoyXmD3PVrACuRv-d4mg2ipRjVCi51ail_6ntdnxvl5&avtc=1&avte=2&avts=1694094442&keywords=%D0%9A%D0%BE%D0%BB%D1%8C%D1%86%D0%BE+%D1%83%D0%BF%D0%BB%D0%BE%D1%82%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%BE%D0%BB%D0%B1%D1%8B+10%22&sh=xvDpukDLFQ",
        "Конкурент 3 на озоне": "https://www.ozon.ru/product/uplotnitelnoe-koltso-dlya-siney-kolby-filtrov-10-bb-aquapro-724153410/?asb=IKBr1U7fvpbnz16JXSzFDUF6tCVhmpbaSh110lpJx5I%253D&asb2=tvQbZS_aLahvYsZeAiqPqUdofHQ8eSpsOj8qdy0MXMRruKvBkeNLpIB6v-4CP-U6&avtc=1&avte=2&avts=1694094442&keywords=%D0%9A%D0%BE%D0%BB%D1%8C%D1%86%D0%BE+%D1%83%D0%BF%D0%BB%D0%BE%D1%82%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%BE%D0%BB%D0%B1%D1%8B+10%22&sh=xvDpuqcYEQ",
        "Конкурент 4 на озоне": "https://www.ozon.ru/product/koltso-uplotnitelnoe-dlya-geyzer-tayfun-23338-dlya-kolby-filtrov-10-sl-298233514/?advert=vQbdBdEK0jfwJYuttzfZMTqWomB47GHMT03buqi6JYMa7W2hD2vCdF-DWKDvhahvkT7t_LD3mdZMAs188cU2t4g2Tb2PzP9M9AN7Agyqxut6imGvQbFDSTSaOlMgHwMGjAyYrlThr3ceao8t_0X4Q-O9fe5WNX6K7twXdhUrvqaXZzJqxVisxGCxlsnhH-sbVyVs-xpOiqYXZBrD_q0c6KpnXFFrl-T92Kq58EqLhhshS52qqtIrTcI0KLY6bKZZK4EznKgD2og5QXw6_ig7l1GwpO_x000c_rXhaWBWm5Ah_lN5QySEsn64czG6yNdsUEmBPx4xQIcYsncYTiFkg&avtc=1&avte=2&avts=1694094442&keywords=%D0%9A%D0%BE%D0%BB%D1%8C%D1%86%D0%BE+%D1%83%D0%BF%D0%BB%D0%BE%D1%82%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%BE%D0%BB%D0%B1%D1%8B+10%22&sh=xvDpukEEfA",
        "Конкурент 5 на озоне": "https://www.ozon.ru/product/uplotnitelnoe-koltso-prokladka-dlya-kolb-filtra-razmera-slim-line-10-854982302/?asb=%252B%252B6J8Dp1mq%252B35O7s9o15LgXe9H0EJpvTwijaGqZ5nHPlM5nnaA26kUBdWd4OSwcy&asb2=GXm1KwVRhIwG9h1_iSA8DIrg6ClL4wI_zlbT81whiW1Eenl54Ne645Em4iHvqMsfcaN-XM2i7wezZtCCggRHhADkL62OXrsHyShqNczaPLwoMqqLPH9DuTqrnqmBsvsqM9sEKedDUvxpAEhz1VMryoUGB4SpZE7XYX3NtnWx4N8&avtc=1&avte=2&avts=1694094442&keywords=%D0%9A%D0%BE%D0%BB%D1%8C%D1%86%D0%BE+%D1%83%D0%BF%D0%BB%D0%BE%D1%82%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D0%B4%D0%BB%D1%8F+%D0%BA%D0%BE%D0%BB%D0%B1%D1%8B+10%22&sh=xvDpuptpzg",
        "Конкурент 2 на озоне_price": 121,
        "Конкурент 3 на озоне_price": 250,
        "Конкурент 4 на озоне_price": "",
        "Конкурент 5 на озоне_price": 246,
        "Конкурент 6 на озоне_price": 235
    },
    "1357": {
        "id": "1357",
        "Конкурент 1 на озоне": "https://www.ozon.ru/product/kartridzh-atoll-mp-5v-vspenennyy-polipropilen-175974825/?asb=QiU5RGV7JK6T6AJ8YLZg%252FFcA6r5vddVC5str46xD%252FNs%253D&asb2=tJjyltsbO4XCIQrFN4HRzRNnqUuB4j_ReBDPPRpeHTsm9hPZBcqRjJDUdnv9UOz2&avtc=1&avte=2&avts=1694093880&keywords=ATOLL+%D0%BA%D0%B0%D1%80%D1%82%D1%80%D0%B8%D0%B4%D0%B6+%D0%9C%D0%9F-5%D0%92&sh=xvDpurGFhQ",
        "Конкурент 2 на озоне": "https://www.ozon.ru/product/kartridzh-atoll-mp-5v-vspenennyy-polipropilen-410699658/?asb=k59eq5L82Q5nlpSI3Y4MU2UXwn%252F85CJr7LEIVQBuKIo%253D&asb2=YC1c_5tfbYEsVKtcjaNWgdqG59U-UZ2GnxHinqcitzL0fpy4xgM7RfdVraumCoy2&avtc=1&avte=2&avts=1694093880&keywords=ATOLL+%D0%BA%D0%B0%D1%80%D1%82%D1%80%D0%B8%D0%B4%D0%B6+%D0%9C%D0%9F-5%D0%92&sh=xvDpurenig",
        "Конкурент 3 на озоне": "https://www.ozon.ru/product/kartridzh-atoll-mp-5v-1063511504/?asb=lXNQxHZrCa7onXYDjqiCDPr7cEursgOvziS%252BrzxRoKo%253D&asb2=_ruyM24CH1v-kS3ENx4G3ZxA9f_rMQOovrmuxPrRcfdpjbKcQWDgKQAGiQLxfBlg&avtc=1&avte=2&avts=1694093928&keywords=ATOLL+%D0%BA%D0%B0%D1%80%D1%82%D1%80%D0%B8%D0%B4%D0%B6+%D0%9C%D0%9F-5%D0%92&sh=xvDpunJSgw",
        "Конкурент 4 на озоне": "https://www.ozon.ru/product/smennyy-kartridzh-rusfiltr-mp-5v-10-meh-ochistka-5-mkm-821292317/?asb=9pnoTZAge8RjGyDvtBcDbvp%252FFQgCphoDy5vgn%252FVA9MI%253D&asb2=_in1FdyOFwB8HxXCzWyClxmcUT0L7FpuDMMu1EkGc-5Ya_Yas2JODCsXmz_eKkRc&avtc=1&avte=2&avts=1694093947&keywords=ATOLL+%D0%BA%D0%B0%D1%80%D1%82%D1%80%D0%B8%D0%B4%D0%B6+%D0%9C%D0%9F-5%D0%92&sh=xvDpugN9VA",
        "Конкурент 5 на озоне": "https://www.ozon.ru/product/smennyy-kartridzh-rusfiltr-mp-5v-10-meh-ochistka-5-mkm-821290670/?asb=thHMmgi00M1rOoEmp%252F4FE2PZI2QNqHX8qW321xEu81g%253D&asb2=mDiK-mItVms5TJdXhIS28fyshgYVyGrk876fbKu_0FiMOB4ePQoafbCdY3DCIzws&avtc=1&avte=2&avts=1694093947&keywords=ATOLL+%D0%BA%D0%B0%D1%80%D1%82%D1%80%D0%B8%D0%B4%D0%B6+%D0%9C%D0%9F-5%D0%92&sh=xvDpuj_lug",
        "Конкурент 2 на озоне_price": 250,
        "Конкурент 3 на озоне_price": "",
        "Конкурент 4 на озоне_price": 354,
        "Конкурент 5 на озоне_price": "",
        "Конкурент 6 на озоне_price": ""
    },
    "1933": {
        "id": "1933"
    },
    "2194": {
        "id": "2194",
        "Конкурент 1 на озоне": "https://www.ozon.ru/product/pesok-kvartsevyy-graviy-fr-2-5-mm-meshok-25-kg-912938338/?asb=wxARfErlyS21BtCZhipxz0irAciDbRzmYuJWQrgcz98%253D&asb2=DZU7tw0Pn0KWosQ5eCdW8cN1TiCEHdzrvrQjYmiHRuzjhp5DCQCao9VilA0QEdqS&avtc=1&avte=2&avts=1694094177&keywords=%D0%93%D1%80%D0%B0%D0%B2%D0%B8%D0%B9%2F%D0%9A%D0%B2%D0%B0%D1%80%D1%86+2-5%D0%BC%D0%BC&sh=xvDpun3xKw",
        "Конкурент 2 на озоне_price": ""
    }
}







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