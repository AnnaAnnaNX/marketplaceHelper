const {
    readExcelFile,
    parsePricePoisk,
    setLeftovers
} = require('../scripts/setLeftoversFunctions');
const { writeRowsInExcel } = require("../helpers");
const fs = require('fs');
const path = require('path');
const { sleep } = require('../functions');

test.skip('readExcelFile', async () => {
    const result = await readExcelFile(
        path.resolve('src', 'input-files', 'leftovers', 'liftovers-ym.xlsx'),
        // 'Остатки'
    );
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
}, 3000_000);

test.skip('parsePricePoisk', async () => {
    const result = await parsePricePoisk({
        '№ ПС': ['№ ПС', '1', '69', '1', '69'],
        'Ост-к': ['Ост-к', '0', '1', '0', '2'],
        'Код товара': ['Код товара', '240329', '240329', '332020', '332020']
    });
    expect(result).toEqual({
        '1': {
            '240329': {
                'Код товара': '240329',
                '№ ПС': '1',
                'Ост-к': '0',
            },
            '332020': {
                'Код товара': '332020',
                '№ ПС': '1',
                'Ост-к': '0',
            }
        },
        '69': {
            '240329': {
                'Код товара': '240329',
                '№ ПС': '69',
                'Ост-к': '1',
            },
            '332020': {
                'Код товара': '332020',
                '№ ПС': '69',
                'Ост-к': '2',
            }            
        }
    });
}, 3000_000);

test.skip('setLeftovers small data', async () => {
    const result = await setLeftovers([
        { path: 'C:\\Users\\Anna\\Desktop\\nick-projects\\marketplaceHelper\\src\\input-files\\leftovers\\forTest\\pricePOISK.xlsx' },
        { path: 'C:\\Users\\Anna\\Desktop\\nick-projects\\marketplaceHelper\\src\\input-files\\leftovers\\forTest\\assortYM.xlsx' },
    ]);
    await sleep(500);
    let countFiles = 0;
    const filenames = fs.readdirSync(result);
    expect(filenames.length).toEqual(2);
}, 300000_000)


test('setLeftovers big data', async () => {
    const result = await setLeftovers([
        { path: 'C:\\Users\\Anna\\Desktop\\nick-projects\\marketplaceHelper\\src\\input-files\\leftovers\\forTest\\pricePOISK-big.xlsx' },
        { path: 'C:\\Users\\Anna\\Desktop\\nick-projects\\marketplaceHelper\\src\\input-files\\leftovers\\forTest\\assortYM.xlsx' },
    ]);
    await sleep(500);
    let countFiles = 0;
    const filenames = fs.readdirSync(result);
    expect(filenames.length).toEqual(38);
}, 300000_000)



