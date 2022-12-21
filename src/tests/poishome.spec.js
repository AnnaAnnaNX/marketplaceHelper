const {
    getProductLinksToBeParsed,
    parseDevices
} = require('../scripts/analitycPriceFunctions');
const { writeRowsInExcel } = require("../helpers");
const fs = require('fs');
const path = require('path');
const { sleep } = require('../functions');
const {getProductLinks} = require("../scripts/poishomeFunctions");

const arr =
    ["https://poiskhome.ru/ProductList/Apple_iPhone_334", "https://poiskhome.ru/ProductList/Smartfony_345", "https://poiskhome.ru/ProductList/Mobilnye_telefony_84", "https://poiskhome.ru/ProductList/CHasy_Braslety_Zdorove_344", "https://poiskhome.ru/ProductList/Planshetnye_PK_443", "https://poiskhome.ru/ProductList/Aksessuary_dlya_planshetnyh_kompyuterov_166", "https://poiskhome.ru/ProductList/Portativnaya_Akustika_341", "https://poiskhome.ru/ProductList/Naushniki_249"];

test('readLinks', async () => {
    console.log('getProductLinksToBeParsed');
    const result = await getProductLinks(
        [
            {
                path: path.resolve(__dirname, '../input-files/poiskhome/groupsPoiskome.txt'),
            }
        ]
    );
    expect(result).toEqual(arr);
});

