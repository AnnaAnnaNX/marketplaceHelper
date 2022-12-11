const {
    getProductLinksToBeParsed,
    parseDevices
} = require('../scripts/analitycPriceFunctions');

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

test.skip('getProductLinksToBeParsed', async () => {
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
    expect(result).toEqual({});
});

