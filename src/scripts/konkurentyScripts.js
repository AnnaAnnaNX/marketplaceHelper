const path = require('path');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];
const { shops } = require('../consts.json');
const { checkExistance  } = require('../helpers');

const getInfoFromFileKonkurenty = async (file) => {
    const content = {};
    let worksheet = null;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);

    worksheet = await workbook.getWorksheet('Лист1');
    if (!worksheet) {
        worksheet = await workbook.getWorksheet(1);
    }

    const codes = worksheet.getColumn(1).values;
    const namesList = worksheet.getColumn(2).values;
    const searchesList = worksheet.getColumn(3).values;
    const ourPrice = worksheet.getColumn(4).values;

    return {
      codes,
      namesList,
      searchesList,
      ourPrice
    };
}


const getItemInfo = async (i, page) => {

  const selectors = {
    'price': (i) => `[data-widget="searchResultsV2"] > div > div:nth-child(${i}) > a+div > div > span:nth-child(1)`,
    //'shopNameAndDelevery':  (i) => `[data-widget="searchResultsV2"] > div > div:nth-child(${i}) .tsCaption`,
    'shopNameAndDelevery':  (i) => `[data-widget="searchResultsV2"] > div > div:nth-child(${i}) .tsCaption`,
    'link':  (i) => `[data-widget="searchResultsV2"] > div > div:nth-child(${i}) > a`
  }

  let price = '';
  let shopName = '';
  let delevery = '';
  let link = '';

  try {

    if (!(await checkExistance(page, selectors.price(i)))) {
      console.log(`not found ${selectors.price(i)}`);
    } else {
      let val = await page.$eval(selectors.price(i), el => el.innerText); 
      val = val.replace('₽', '').replace(/\s/g, '').trim();
      price = parseInt(val);
    }

    if (!(await checkExistance(page, selectors.shopNameAndDelevery(i)))) {
      console.log(`not found ${selectors.shopNameAndDelevery(i)}`);   
    } else {
      const val = await page.$eval(selectors.shopNameAndDelevery(i), el => el.innerText);
      // console.log(val);
      let arr = /(.*)доставит/g.exec(val);
      delevery = arr && (arr.length > 0) && arr[1].trim();  
      arr = /продавец(.*)$/g.exec(val);
      shopName = arr && (arr.length > 0) && arr[1].trim();       
    }

    if (!(await checkExistance(page, selectors.link(i)))) {
      console.log(`not found ${selectors.link(i)}`);
    } else {
      link = await page.$eval(selectors.link(i), el => el.href);
    }

  } catch (e) {
      console.log(e);
  }

  return { price, shopName, delevery, link };

}

const parsePricesNamesDeliveryKonkurent = async (searches) => {
    try {
      console.log(searches);
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.emulate(iPhone);

      const listParams = {
      }

      for(let i = 1; i <= 3; i++) {
        listParams[`price${i}`] = [`price${i}`];
        listParams[`shopName${i}`] = [`shopName${i}`];
        listParams[`delevery${i}`] = [`delevery${i}`];
        listParams[`link${i}`] = [`link${i}`];
      }
  
      for (let i = 2; i < searches.length; i++) {

        if (!searches[i] || !searches[i].toString().trim()) {
          Object.keys(listParams).forEach(name => {
            listParams[name].push('');
          })
        } else {
        
          await page.goto(`https://www.ozon.ru/search/?from_global=true&text=${searches[i]}`);
    
          for(let i = 1; i <= 3 ; i++) {
            const { price, shopName, delevery, link } = await getItemInfo(i, page);
            listParams[`price${i}`].push(price); 
            listParams[`shopName${i}`].push(shopName);     
            listParams[`delevery${i}`].push(delevery);
            listParams[`link${i}`].push(link);
          }

        }

      }
  
      await browser.close();
  
      return listParams;
    } catch (e) {
      return { error: e }
    }
  }

const writeResultColumns = async (content) => {
  try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Ассортимент');
      const filePath = path.join(__dirname, '../result.xlsx');

      const namesColumns = [
        ,
        'codes',
        'namesList',
        'searchesList',
        'ourPrice',
        'price1',
        'shopName1',
        'delevery1',
        'link1',
        'price2',
        'shopName2',
        'delevery2',
        'link2',
        'price3',
        'shopName3',
        'delevery3',
        'link3'
      ];

      for (let i = 1; i < namesColumns.length; i++) {
        const columnName = namesColumns[i];
        worksheet.getColumn(i).values = content[columnName];
        worksheet.getColumn(i).width = 30;
      }

      await workbook.xlsx.writeFile('./result.xlsx');

  } catch(e) {
      console.log('writeNamesAndPrices');
      console.log(e);
  }
}

module.exports = {
    getInfoFromFileKonkurenty,
    parsePricesNamesDeliveryKonkurent,
    writeResultColumns
}