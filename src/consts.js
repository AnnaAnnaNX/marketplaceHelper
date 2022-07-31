const fileInfoForReadFile = {
    'Прайс-лист ИП Булюнов Артём Мусаевич': {
        tagName: 'TDSheet',
        rowHeader: 9,
        rowBeginProduct: 10,
        columnsNames: ['Остаток', 'Цена'],
        skuColumnName: 'Номенклатура.Код', // далее столбце будет sku
        foratters: {
            'sku': (val) => (`000000${val}`)
        }
    },
    'ymRenewSetAmount.xlsx': {
        tagName: 'Остатки',
        nColumn: {
            sku: 3,
            amount: 5,
        },
        rowBeginProduct: 3,
    }
};

const templates = {
    ymAmount: 'ymRenewSetAmount.xlsx',
}

module.exports = {
    fileInfoForReadFile,
    templates
}