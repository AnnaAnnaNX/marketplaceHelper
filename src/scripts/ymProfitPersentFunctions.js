const path = require('path');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];
const { shops } = require('../consts.json');
const { checkExistance  } = require('../helpers');
const { sleep } = require('../functions');

const selectorLogin = '[name="login"]';
const selectorPassword = '[name="passwd"]';
const selectorButton = '[type="submit"]';
const selectorCheckAuth = '.user__icon';
const selectorRow = '[data-e2e-row-offer-id]';
const selectorNameByN = (N) => (`[data-e2e-row-offer-id]:nth-child(${N}) [data-e2e="offer-name"]`);
const selectorSKUByN = (N) => (`[data-e2e-row-offer-id]:nth-child(${N}) [data-e2e="offer-id"]`);
const selectorForHoverByN = (N) => (`[data-e2e-row-offer-id]:nth-child(${N}) [data-e2e="tariff-cell-price"] span`);
const selectorCloseHover = '[class^="___sticky-bar"] button';
const selectorPersentByCaterory = '[class^="___root"] > [class^="___unit"]:nth-child(1) div div div div [data-e2e-i18n-key="pages.assortment:tariff-drawer.percent-value"]';
const selectorDeliveryFrom = '[data-spacer="true"] +[class^="___unit"] [class^="___unit"]:nth-child(3) [data-e2e-i18n-key="pages.assortment:tariff-tooltip.content.value"]';
const selectorComission = (N) => (`[data-e2e-row-offer-id]:nth-child(${N}) td>div>.__use--inline_1dsct_1>.___unit_1dsct_1:nth-child(2) .__use--inline_1dsct_1`);

const durationPause = 1000;

  const auth = async (page, login, password) => {
    try {
        const authLink = 'https://passport.yandex.ru/auth/welcome?retpath=https://market.yandex.ru/partners';
    
        await page.goto(authLink);

        if (!await checkExistance(page, selectorLogin)) return {success: false};
        await page.type(selectorLogin, login, {delay: 20});
        await page.keyboard.press('Enter');
        if (!await checkExistance(page, selectorPassword)) return {success: false};
        await page.type(selectorLogin, password, {delay: 20});
        await page.keyboard.press('Enter');
        // if (!await checkExistance(page, selectorCheckAuth)) return {success: false, page: page};

        await sleep(durationPause*5);
        return {success: true};
    } catch (e) {
        console.log('auth');
        console.log(e);
        return { success: false };
    };
  }

  // sku - array SKU
  const parsePersentProducts = async (inputParams) => {
    try {

        console.log('parsePersentProducts');
        const browser = await puppeteer.launch({headless: false});
        let page = await browser.newPage();
        await page.emulate(iPhone);

        const { assortimentLink, login, password } = inputParams;
        const result = await auth(page, login, password);
        if (!result.success) return { success: false };
        // page = result.page;
  
        const listParams = {
        }
  
        listParams.sku = ['sku'];
        listParams.name = ['name'];
        listParams.persent= ['persent'];
        listParams.delivery = ['delivery'];
        listParams.comission = ['comission'];
    
        let i = 1;
        let elsCount = 0;
        do {
            try {
              await page.goto(`${assortimentLink}?page=${i}`);
              await sleep(durationPause*5);
              if (!await checkExistance(page, selectorRow)) break;
              
              elsCount = await page.$$eval(selectorRow, els => els.length);
              if (elsCount) {
                for(let j = 1; j <= elsCount; j++) {
                  const name = await page.$eval(selectorNameByN(j), el => el.innerText);      
                  const sku = await page.$eval(selectorSKUByN(j), el => el.innerText);  
                   
                  const comissionValue = await page.$eval(selectorComission(j), el => el.innerText);   
                  // check begin with FBS
                  let comission = /[0-9][0-9 ]+/gi.exec(comissionValue)
                  comission = comission ?
                   comission[0].replace(/\s/g, '') 
                   : comission;
                  
                  let persent = '';
                  let delivery = '';

                  // click on hover
                  // await checkExistance(page, selectorForHoverByN(j))
                  // console.log(`click on ${j} product`);
                  // await page.click(selectorForHoverByN(j));
                  // await sleep(durationPause); 
                  // await button
                  // if (await checkExistance(page, selectorCloseHover)) {
                  // // get persent, delivery
                  //   persent = await page.$eval(selectorPersentByCaterory, el => el.innerText);      
                  //   let arr = /[.,0-9]+/gi.exec(persent);
                  //   persent = arr && arr[0] || persent;
                  //   delivery = await page.$eval(selectorDeliveryFrom, el => el.innerText); 
                  //   arr = /[.,0-9]+/gi.exec(delivery);
                  //   delivery = arr && arr[0] || delivery;
                  //   await checkExistance(page, selectorCloseHover)
                  //   console.log(`click close window ${j} product`);  
                  //   await page.click(selectorCloseHover);  
                  //   await sleep(durationPause); 
                  // }

                  listParams.name.push(name || '');                
                  listParams.sku.push(sku || '');  
                  listParams.persent.push(persent || '');
                  listParams.delivery.push(delivery || '');
                  listParams.comission.push(comission || '');
                }
              }      
            } catch (e) {
              console.log(e);
            }
            i++;
        } while(elsCount && (i<=2));
    
        await browser.close();
    
        console.log('listParams');
        console.log(listParams);

        return listParams;


    } catch(e) {
        console.log('getPersentProducts');
        console.log(e);
    }
  }

  const 
  writeResultColumnsYMProfit = async (content) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ассортимент');
        const filePath = path.join(__dirname, '../result.xlsx');
  
        const namesColumns = [
          ,
          'name',                
          'sku',
          'persent',
          'delivery',
          'comission',
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
    parsePersentProducts,
    writeResultColumnsYMProfit
}