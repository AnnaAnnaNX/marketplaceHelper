const { reorderFiles } = require('../scripts/calsPriceAndEffFunctions')

const realFiles = [
  {
    originalname: 'процент эффективности',
    path: '/home/anna/Desktop/ann-personal-projects/calculator/marketplaceHelper/src/tests/eff(1).xlsx'
  },
  {
    originalname: 'парсинг ЯМ',
    path: '/home/anna/Desktop/ann-personal-projects/calculator/marketplaceHelper/src/tests/с_закупккой_СтройМир_шаблон_парсинга_ЯНдекса_2.xlsx'
  },
]
test('writeRowsInExcel', async () => {
  const filesOrder = ['парсинг ЯМ', 'процент эффективности']
  const files = await reorderFiles(filesOrder, realFiles)
  expect(files.map(file => (file.originalname))).toEqual(filesOrder);
});

const realFilesThreeFiles = [
  {
    originalname: 'шаблон цен Ozon',
    path: '/home/anna/Desktop/ann-personal-projects/calculator/marketplaceHelper/src/tests/Шаблон цен ОЗОН.xlsx'
  },
  {
    originalname: 'закупка Ozon',
    path: '/home/anna/Desktop/ann-personal-projects/calculator/marketplaceHelper/src/tests/закупка.xlsx'
  },
  {
    originalname: 'цены',
    path: '/home/anna/Desktop/ann-personal-projects/calculator/marketplaceHelper/src/tests/price.xlsx'
  },
]
test('writeRowsInExcel1', async () => {
  const filesOrder = ['закупка Ozon', 'шаблон цен Ozon', 'цены']
  const files = await reorderFiles(filesOrder, realFilesThreeFiles)
  expect(files.map(file => (file.originalname))).toEqual(filesOrder);
});
