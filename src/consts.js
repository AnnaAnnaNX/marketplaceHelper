const fileInfoForReadFile = {
    'Прайс-лист ИП Булюнов Артём Мусаевич': {
        tagName: 'TDSheet',
        rowHeader: 9,
        rowBeginProduct: 10,
        columnsNames: ['Остаток', 'Цена'],
        skuColumnName: 'Номенклатура.Код', // далее столбце будет sku
        foratters: {
            'sku': (val) => (`00000${val}`)
        }
    }
};

module.exports = {
    fileInfoForReadFile,
}