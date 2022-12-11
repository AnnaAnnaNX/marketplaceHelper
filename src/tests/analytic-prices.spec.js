const {
    getProductLinksToBeParsed
} = require('../scripts/analitycPriceFunctions');
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
    expect(result).toEqual({});
    done();
    // todo: тест для КГ
});
