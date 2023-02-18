const fileInfoForReadFile = {
    'Прайс-лист ИП Булюнов Артём Мусаевич': {
        tagName: 'TDSheet',
        rowHeader: 9,
        rowBeginProduct: 10,
        columnsNames: ['Остаток', 'Цена'],
        skuColumnName: 'Номенклатура.Код', // далее столбце будет sku
        formatters: {
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
    },
    'парсинг ЯМ': {
        tagName: 'Ассортимент',
        rowHeader: 1,
        rowBeginProduct: 2,
        columnsNames: ['name',	'sku', 'persent', 'delivery','Закупка',	'Розничная цена', 'Процент за прием денег от клиента', 'Процент рекламы'],
        skuColumnName: 'sku',
        formatters: {
            'Закупка': (val) => {
                return val && val.result;
            }
        }
    },
    'закупка Ozon': {
        tagName: 'закупка',
        rowHeader: 1,
        rowBeginProduct: 2,
        columnsNames: ['Код', 'Номенклатура', 'ШК', 'ЗЦ, руб.', 'РЦ, руб.', 'Комиссия за рекламу'],
        skuColumnName: 'Код',
        formatters: {}
    },
    'шаблон цен Ozon': {
        tagName: 'Товары и цены',
        rowHeader: 3,
        rowBeginProduct: 5,
        columnsNames: [
            'Артикул',
            'Ozon SKU ID',
            'Название',
            'Статус',
            'Видимость на OZON',
            'Объемный вес, кг',
            'Размер комиссии, %',
            'Логистика Ozon, минимум, FBO',
            'Логистика Ozon, максимум, FBO',
            'Последняя миля, FBO',
            'Обработка отправления, минимум FBS',
            'Обработка отправления, максимум FBS',
            'Логистика Ozon, минимум, FBS',
            'Логистика Ozon, максимум, FBS',
            'Логистика КГТ Ozon, минимум, FBS',
            'Логистика КГТ Ozon, максимум, FBS',
            'Последняя миля, FBS',
            'НДС, %',
            'Цена до скидки, руб.',
            'Текущая цена (со скидкой), руб.',
            'Скидка, %',
            'Скидка, руб.',
            'Цена с учетом акции, руб.',
            'Скидка, %',
            'Скидка, руб.',
            'Рыночная цена, руб.',
            'Ценовой индекс товара',
            'Настройка автоматического применения рыночной цены',
            'Минимальное значение рыночной цены, руб.',
            'Ссылка на рыночную цену',
            'Настройка автоматического добавления в акции',
            'НДС, %',
            'Цена до скидки, руб.',
            'Текущая цена (со скидкой), руб.',
            'Скидка, %',
            'Автоматически применять рыночную цену',
            'Минимальное значение рыночной цены, руб.',
            'Автоматически добавлять в акции'
        ],
        skuColumnName: 'Артикул',
        formatters: {}
    },
    'цены': {
        tagName: 'Лист1',
        rowHeader: 1,
        rowBeginProduct: 2,
        columnsNames: ['Артикул', 'Цена продажи'],
        skuColumnName: 'Артикул',
        formatters: {}
    },
    'процент эффективности': {
        tagName: 'Лист1',
        rowHeader: 1,
        rowBeginProduct: 2,
        columnsNames: ['Артикул', 'Эффективность'],
        skuColumnName: 'Артикул',
        formatters: {}
    },
    'analyticPrices остатки': {
        tagName: 'Sheet',
        rowHeader: 1,
        rowBeginProduct: 2,
        columnsNames: ['Наименование товара', 'Код товара', 'Ед', 'Ост-к', 'Цена вх','Ц розн'],
        skuColumnName: 'Код товара',
        formatters: {}
    },
    'analyticPrices ссылки': {
        tagName: 'Лист1',
        rowHeader: 4,
        rowBeginProduct: 5,
        columnsNames: [
            'Название товара',
            'Артикул производителя',
            'Код товара',
            'ИМ poiskhome.ru',
            'ОЗОН poskhome.ru',
            'ИМ Мвидео',
            'ОЗОН Мвидео'
        ],
        skuColumnName: 'Код товара',
        formatters: {}
    },
};

const templates = {
    ymAmount: 'ymRenewSetAmount.xlsx',
}

module.exports = {
    fileInfoForReadFile,
    templates
}
