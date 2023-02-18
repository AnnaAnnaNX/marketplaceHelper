const {
    parsePersentProducts,
} = require('../scripts/ymProfitPersentFunctions');
const { writeRowsInExcel } = require("../helpers");
const fs = require('fs');
const path = require('path');
const { sleep } = require('../functions');

const params = {
    "login": "AnnaAnnaNX@yandex.ru",
    "password": "fsdg646KUJGKI___",
    "assortimentLink": "https://partner.market.yandex.ru/supplier/26020183/assortment"
};

test('parsePersentProducts', async () => {
    console.log('parsePersentProducts');
    const result = await parsePersentProducts(params);
    // expect(result).toEqual(linksObj);
}, 10000000);
