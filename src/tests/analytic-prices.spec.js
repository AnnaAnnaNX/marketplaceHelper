const {
    getProductLinksToBeParsed,
    parseDevices
} = require('../scripts/analitycPriceFunctions');
const { writeRowsInExcel } = require("../helpers");
const fs = require('fs');
const path = require('path');
const { sleep } = require('../functions');

const linksObj = {
    "372448": {
        "Код товара": "372448",
        "Название товара": "с/м Samsung WW60A4S00CE",
        "Артикул производителя": "WW60A4S00CE",
        "ИМ poiskhome.ru": "https://poiskhome.ru/Product/372448",
        "ОЗОН poskhome.ru": "https://www.ozon.ru/product/stiralnaya-mashina-samsung-samsung-ww60a4s00ce-belyy-814744750/?asb=TefhAaBCP56KjeEr8I4Y8RdHlIoVMpSFegY3mtYaT2M%253D&asb2=0GdQS5nvNrOM0kycLfVZMRss60goPR1LutcIu-5ghr70G5joIg0qhjA0zXPsnnev&avtc=1&avte=2&avts=1670668728&keywords=WW60A4S00CE&sh=GloAfQtWHA",
        "ИМ Мвидео": "https://www.mvideo.ru/products/stiralnaya-mashina-uzkaya-samsung-ww60a4s00ce-ld-20082446"
    },
    "391111": {
        "Код товара": "391111",
        "Название товара": "с/м Samsung WW80A6S24AN",
        "Артикул производителя": "WW80A6S24AN",
        "ИМ poiskhome.ru": "https://poiskhome.ru/Product/391111",
        "ИМ Мвидео": "https://www.mvideo.ru/products/stiralnaya-mashina-uzkaya-samsung-ww80a6s24an-ld-20080244",
        "ОЗОН Мвидео": "https://www.ozon.ru/product/stiralnaya-mashina-samsung-ww80a6s24an-ld-677866184/?asb=fOSEUVyTVswNpzz4Fx8fnEvFxItsC0Jl3dvYslbA9XE%253D&asb2=qx17QE2S6ytmsyU-wFUvcV_w6cIfWxmZO7S2-Aj1GSdCjzXIUYffVbDg0mH2c5rf&avtc=1&avte=2&avts=1670678597&keywords=WW80A6S24AN&sh=GloAfUVBYQ"
    }
};

test('getProductLinksToBeParsed', async () => {
    console.log('getProductLinksToBeParsed');
    const result = await getProductLinksToBeParsed(
        [
            {
                path: '../input-files/analytic-prices/1_ОСТАТКИ_ЦС_09_12_22.xlsx',
            },
            {
                path: '../input-files/analytic-prices/2_Таблица_ссылок_для_парсинга_цен.xlsx'
            }
        ]
    );
    expect(result).toEqual(linksObj);
});

test('getProductLinksToBeParsed', async () => {
    const result = await parseDevices(linksObj);
    expect(result).toEqual({
        "372448": {
            "Код товара": "372448",
            "Название товара": "с/м Samsung WW60A4S00CE",
            "Артикул производителя": "WW60A4S00CE",
            "ИМ poiskhome.ru": "https://poiskhome.ru/Product/372448",
            "ОЗОН poskhome.ru": "https://www.ozon.ru/product/stiralnaya-mashina-samsung-samsung-ww60a4s00ce-belyy-814744750/?asb=TefhAaBCP56KjeEr8I4Y8RdHlIoVMpSFegY3mtYaT2M%253D&asb2=0GdQS5nvNrOM0kycLfVZMRss60goPR1LutcIu-5ghr70G5joIg0qhjA0zXPsnnev&avtc=1&avte=2&avts=1670668728&keywords=WW60A4S00CE&sh=GloAfQtWHA",
            "ИМ Мвидео": "https://www.mvideo.ru/products/stiralnaya-mashina-uzkaya-samsung-ww60a4s00ce-ld-20082446",
            "ИМ poiskhome.ru price": expect.any(Number),
            "ОЗОН poskhome.ru price": expect.any(Number),
            "ИМ Мвидео price": expect.any(Number)
        },
        "391111": {
            "Код товара": "391111",
            "Название товара": "с/м Samsung WW80A6S24AN",
            "Артикул производителя": "WW80A6S24AN",
            "ИМ poiskhome.ru": "https://poiskhome.ru/Product/391111",
            "ИМ Мвидео": "https://www.mvideo.ru/products/stiralnaya-mashina-uzkaya-samsung-ww80a6s24an-ld-20080244",
            "ОЗОН Мвидео": "https://www.ozon.ru/product/stiralnaya-mashina-samsung-ww80a6s24an-ld-677866184/?asb=fOSEUVyTVswNpzz4Fx8fnEvFxItsC0Jl3dvYslbA9XE%253D&asb2=qx17QE2S6ytmsyU-wFUvcV_w6cIfWxmZO7S2-Aj1GSdCjzXIUYffVbDg0mH2c5rf&avtc=1&avte=2&avts=1670678597&keywords=WW80A6S24AN&sh=GloAfUVBYQ",
            "ИМ poiskhome.ru price": expect.any(Number),
            "ИМ Мвидео price": expect.any(Number),
            "ОЗОН Мвидео price": expect.any(Number)
        }
    });
}, 3000_000);

test('writeRowsInExcel', async () => {
    const linksAndPricesObj = {
        "372448": {
            "Код товара": "372448",
            "Название товара": "с/м Samsung WW60A4S00CE",
            "Артикул производителя": "WW60A4S00CE",
            "ИМ poiskhome.ru": "https://poiskhome.ru/Product/372448",
            "ОЗОН poskhome.ru": "https://www.ozon.ru/product/stiralnaya-mashina-samsung-samsung-ww60a4s00ce-belyy-814744750/?asb=TefhAaBCP56KjeEr8I4Y8RdHlIoVMpSFegY3mtYaT2M%253D&asb2=0GdQS5nvNrOM0kycLfVZMRss60goPR1LutcIu-5ghr70G5joIg0qhjA0zXPsnnev&avtc=1&avte=2&avts=1670668728&keywords=WW60A4S00CE&sh=GloAfQtWHA",
            "ИМ Мвидео": "https://www.mvideo.ru/products/stiralnaya-mashina-uzkaya-samsung-ww60a4s00ce-ld-20082446",
            "ИМ poiskhome.ru price": 36290,
            "ОЗОН poskhome.ru price": 35473,
            "ИМ Мвидео price": 39999
        },
        "391111": {
            "Код товара": "391111",
            "Название товара": "с/м Samsung WW80A6S24AN",
            "Артикул производителя": "WW80A6S24AN",
            "ИМ poiskhome.ru": "https://poiskhome.ru/Product/391111",
            "ИМ Мвидео": "https://www.mvideo.ru/products/stiralnaya-mashina-uzkaya-samsung-ww80a6s24an-ld-20080244",
            "ОЗОН Мвидео": "https://www.ozon.ru/product/stiralnaya-mashina-samsung-ww80a6s24an-ld-677866184/?asb=fOSEUVyTVswNpzz4Fx8fnEvFxItsC0Jl3dvYslbA9XE%253D&asb2=qx17QE2S6ytmsyU-wFUvcV_w6cIfWxmZO7S2-Aj1GSdCjzXIUYffVbDg0mH2c5rf&avtc=1&avte=2&avts=1670678597&keywords=WW80A6S24AN&sh=GloAfUVBYQ",
            "ИМ poiskhome.ru price": 58990,
            "ИМ Мвидео price": 56999,
            "ОЗОН Мвидео price": 44649
        }
    };
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
    await sleep(3000);
    const isExists = fs.existsSync(path.resolve(__dirname, '../../result.xlsx'));
    expect(isExists).toEqual(true);
});

