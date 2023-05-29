const {
    getProductLinksToBeParsed,
    parseDevices
} = require('../scripts/analitycPriceFunctions');
const { writeRowsInExcel } = require("../helpers");
const fs = require('fs');
const path = require('path');
const { sleep } = require('../functions');
const { getProductLinks, parseLinks, parseCharacteristics, download } = require("../scripts/poishomeFunctions");

const arr =
    ["https://poiskhome.ru/ProductList/Apple_iPhone_334", "https://poiskhome.ru/ProductList/Smartfony_345", "https://poiskhome.ru/ProductList/Mobilnye_telefony_84", "https://poiskhome.ru/ProductList/CHasy_Braslety_Zdorove_344", "https://poiskhome.ru/ProductList/Planshetnye_PK_443", "https://poiskhome.ru/ProductList/Aksessuary_dlya_planshetnyh_kompyuterov_166", "https://poiskhome.ru/ProductList/Portativnaya_Akustika_341", "https://poiskhome.ru/ProductList/Naushniki_249"];

test('readLinks', async () => {
    console.log('readLinks');
    const result = await getProductLinks(
        [
            {
                path: path.resolve(__dirname, '../input-files/poiskhome/groupsPoiskome.txt'),
            }
        ]
    );
    expect(result).toEqual(arr);
});
const iphones = [
    "https://poiskhome.ru/Product/365004",
    "https://poiskhome.ru/Product/371156",
    "https://poiskhome.ru/Product/371157",
    "https://poiskhome.ru/Product/372529",
    "https://poiskhome.ru/Product/371158",
    "https://poiskhome.ru/Product/372014",
    "https://poiskhome.ru/Product/371161",
    "https://poiskhome.ru/Product/371162",
    "https://poiskhome.ru/Product/334562",
    "https://poiskhome.ru/Product/334563",
    "https://poiskhome.ru/Product/334565",
    "https://poiskhome.ru/Product/346709",
    "https://poiskhome.ru/Product/372530",
    "https://poiskhome.ru/Product/372531",
    "https://poiskhome.ru/Product/372532",
    "https://poiskhome.ru/Product/337450",
    "https://poiskhome.ru/Product/372015",
    "https://poiskhome.ru/Product/372016",
    "https://poiskhome.ru/Product/376004",
    "https://poiskhome.ru/Product/376005",
    "https://poiskhome.ru/Product/376006",
    "https://poiskhome.ru/Product/376007",
    "https://poiskhome.ru/Product/359796",
    "https://poiskhome.ru/Product/359798",
    "https://poiskhome.ru/Product/371688",
    "https://poiskhome.ru/Product/371689",
    "https://poiskhome.ru/Product/371691",
    "https://poiskhome.ru/Product/371692",
    "https://poiskhome.ru/Product/359753",
    "https://poiskhome.ru/Product/359778",
    "https://poiskhome.ru/Product/371163",
    "https://poiskhome.ru/Product/371164",
    "https://poiskhome.ru/Product/391312",
    "https://poiskhome.ru/Product/391313",
    "https://poiskhome.ru/Product/391317",
    "https://poiskhome.ru/Product/391318",
    "https://poiskhome.ru/Product/391314",
    "https://poiskhome.ru/Product/371167",
    "https://poiskhome.ru/Product/371168",
    "https://poiskhome.ru/Product/371169",
    "https://poiskhome.ru/Product/377183",
    "https://poiskhome.ru/Product/377177",
    "https://poiskhome.ru/Product/377178",
    "https://poiskhome.ru/Product/377179",
    "https://poiskhome.ru/Product/377180",
    "https://poiskhome.ru/Product/377181",
    "https://poiskhome.ru/Product/377182",
    "https://poiskhome.ru/Product/391316",
    "https://poiskhome.ru/Product/390943",
    "https://poiskhome.ru/Product/390944",
    "https://poiskhome.ru/Product/390945",
    "https://poiskhome.ru/Product/390940",
    "https://poiskhome.ru/Product/390941",
    "https://poiskhome.ru/Product/390942",
    "https://poiskhome.ru/Product/328271",
    "https://poiskhome.ru/Product/346880",
    "https://poiskhome.ru/Product/284987",
    "https://poiskhome.ru/Product/284992",
    "https://poiskhome.ru/Product/346865",
    "https://poiskhome.ru/Product/364547",
    "https://poiskhome.ru/Product/189490",
    "https://poiskhome.ru/Product/346864",
    "https://poiskhome.ru/Product/218140",
    "https://poiskhome.ru/Product/218141",
    "https://poiskhome.ru/Product/364541",
    "https://poiskhome.ru/Product/392450",
    "https://poiskhome.ru/Product/127759",
    "https://poiskhome.ru/Product/362522",
    "https://poiskhome.ru/Product/362523"
]
test('parseLinks', async () => {
    console.log('parseLinks');
    const result = await parseLinks(
    [
            'https://poiskhome.ru/ProductList/Apple_iPhone_334',
            'https://poiskhome.ru/ProductList/Kuhonnye_vesy_403'
        ]
    );
    expect(result).toEqual(iphones);
}, 1000_000);
test('parseCharacteristics', async () => {
    console.log('parseLinks');
    const result = await parseCharacteristics(
    [
            'https://poiskhome.ru/Product/371156',
            'https://poiskhome.ru/Product/365004',
            'https://poiskhome.ru/Product/372529',
            'https://poiskhome.ru/Product/294799',
            'https://poiskhome.ru/Product/318023'
          ]
    );
    expect(result).toEqual(iphones);
}, 1000_000);

test('load file', async () => {
    console.log('load file');
    const result = await download(
        'https://poiskhome.ru//Content/img/products/1000000/400000/80000/3000/600/30/0372529/Galery/2/700X700.jpg',
    );
    expect(result).toEqual(iphones);
}, 1000_000);


