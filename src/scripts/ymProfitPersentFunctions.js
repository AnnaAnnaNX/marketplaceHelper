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
const selectorPrice = (N) => (`[data-e2e-row-offer-id]:nth-child(${N}) [data-e2e="basic-price-cell"] input`)
const selectorNextButton = '[title=""]:last-child'
const selectorLoadMoreButton = '[data-e2e="returns-pager"]';
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

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
        return {success: true, page: page};
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

        const { assortimentLink, login, password, startPage, numberOfPage } = inputParams;
        const numberOfPageEdit = parseInt(numberOfPage) || 1000;
        const result = await auth(page, login, password);
        // if (!result.success) return { success: false };
        page = result.page;

        const listParams = {
        }

        listParams.sku = ['sku'];
        listParams.name = ['name'];
        // listParams.persent= ['persent'];
        // listParams.delivery = ['delivery'];
        listParams.comission = ['comission'];
        listParams.priceValue = ['priceValue'];
    
        let i = parseInt(startPage) || 1;
        let elsCount = 0;
        await page.goto(`${assortimentLink}&page=${i}`);
        // await page.goto(`${assortimentLink}&page=${i}`);
        const n = (parseInt(startPage) || 1 ) + numberOfPageEdit
        do {
            try {
              // await page.goto(`${assortimentLink}&page=${i}`);
              await sleep(durationPause*5);
              if (!await checkExistance(page, selectorRow)) break;
              elsCount = await page.$$eval(selectorRow, els => els.length);

              if (elsCount) {
                console.log(`page ${i} elsCount ${elsCount}`);
                for(let j = 1; j <= elsCount; j++) {
                  try {
                    let name = '';
                    if (await checkExistance(page, selectorNameByN(j))) {
                      name = await page.$eval(selectorNameByN(j), el => el.innerText);      
                    }
                    let sku = '';
                    if (await checkExistance(page, selectorSKUByN(j))) {
                      sku = await page.$eval(selectorSKUByN(j), el => el.innerText);  
                    }
                    
                    let comissionValue = ''
                    if (await checkExistance(page, selectorComission(j))) {
                      comissionValue = await page.$eval(selectorComission(j), el => el.innerText);   
                    }
                    // check begin with FBS
                    let comission = /[0-9][0-9 ]+/gi.exec(comissionValue)
                    comission = comission ?
                    comission[0].replace(/\s/g, '') 
                    : comission;
                    
                    let persent = '';
                    let delivery = '';

                    let priceValue = ''
                    if (await checkExistance(page, selectorPrice(j))) {
                      priceValue = await page.$eval(selectorPrice(j), el => el.value);
                    }
                    priceValue = priceValue ?
                    priceValue.replace(/\s/g, '') 
                    : priceValue; 

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
                    // listParams.persent.push(persent || '');
                    // listParams.delivery.push(delivery || '');
                    listParams.comission.push(comission || '');
                    listParams.priceValue.push(priceValue || '');
                  } catch (e) {
                    console.log(e);
                    console.log('error in row');
                  }
                }
              }
            } catch (e) {
              console.log(e);
              console.log('error in page');
            }
            i++;
            await page.click(selectorNextButton)
        } while(elsCount && (i<n));
    
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
        // const filePath = path.join(__dirname, '../result.xlsx');
        const filePath = path.join(__dirname, '../../', 'results', `${uuidv4()}.xlsx`);
        console.log('filePath');
        console.log(filePath);

        const namesColumns = [
          ,
          'name',
          'sku',
          'comission',
          'priceValue'
        ];

        for (let i = 1; i < namesColumns.length; i++) {
          const columnName = namesColumns[i];
          worksheet.getColumn(i).values = content[columnName];
          worksheet.getColumn(i).width = 30;
        }

        await workbook.xlsx.writeFile(filePath);
        return filePath;
    } catch(e) {
        console.log('writeNamesAndPrices');
        console.log(e);
    }
  }


  // selectors table
    const type1Selector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(1) button`; // click for popup
    const type2Selector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(1)  .style-offerName___ovtNd`;
    const type3Selector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(1)  span>[data-e2e-i18n-key]`;

    const createdSelector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(2) [data-e2e="return-created-date"]`;
    const updatedSelector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(2) div+ div>.___Tag___XnCAY`;

    const numberOrderSelector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(3)`;

    const statusSelector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(5)`;

    const summSelector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(5)`;
      // ₽

    const shop1Selector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(7) [class^=___unit]:first-child`;
    const shop2Selector = `[data-e2e="tableRow"]:nth-child(${N}) td:nth-child(7) [class^=___unit]:last-child`;

  // selectors popup
    const dataRetutnSelector = `[role="radiogroup"] + div .___root_k72io_1 .___root_k72io_1`;
	  const reasonRetutnSelector = `[data-e2e="return-drawer-content"] tbody tr>td:nth-child(2)>[data-tid-prop]`;
    const closePopupSelector = `[aria-label="Закрыть"]`;

  const parseReturns = async (inputParams) => {
    try {

        console.log('parseReturns');
        const browser = await puppeteer.launch({headless: false});
        let page = await browser.newPage();
        await page.emulate(iPhone);

        const { assortimentLink, login, password } = inputParams;
        const result = await auth(page, login, password);
        // if (!result.success) return { success: false };
        page = result.page;

        const listParams = {}
        listParams.type1 = 'type1';
        listParams.type2 = 'type2';
        listParams.type3 = 'type3';
    
        listParams.created = 'created';
        listParams.updated = 'updated';

        listParams.numberOrder = 'numberOrder';
    
        listParams.status = 'status';
        listParams.summ = 'summ';
        
        listParams.shop1 = 'shop1';
        listParams.shop2 = 'shop2';

        listParams.dataRetutn = 'dataRetutn';
        listParams.reasonRetutn = 'reasonRetutn';

        await page.goto(assortimentLink);

        await sleep(durationPause*5);

        // const morebutton = await page.evaluateHandle(() => {
        //   const result = document.querySelector('[data-e2e="returns-pager"]');
        //   return result;
        // });
        await page.$eval(selectorLoadMoreButton, btn => btn.scrollIntoView());
        await page.click(selectorLoadMoreButton)
        // scroll buttom
        let i = 0;
        while ((i < 10) && (await checkExistance(page, selectorLoadMoreButton))) {
          i++;
          await page.$eval(selectorLoadMoreButton, btn => btn.scrollIntoView());
          await page.click(selectorLoadMoreButton)
          await sleep(durationPause);
        }

        let elsCount = 0;
        await page.goto(assortimentLink);
        try {
          // await page.goto(`${assortimentLink}&page=${i}`);
          if (!await checkExistance(page, selectorRow)) throw new Error(`not found selectorRow ${selectorRow}`);
          elsCount = await page.$$eval(selectorRow, els => els.length);

          if (elsCount) {
            console.log(`page ${i} elsCount ${elsCount}`);
            for(let j = 1; j <= elsCount; j++) {
              try {
                let name = '';
                if (await checkExistance(page, selectorNameByN(j))) {
                  name = await page.$eval(selectorNameByN(j), el => el.innerText);      
                }
                let sku = '';
                if (await checkExistance(page, selectorSKUByN(j))) {
                  sku = await page.$eval(selectorSKUByN(j), el => el.innerText);  
                }
                
                let priceValue = ''
                if (await checkExistance(page, selectorPrice(j))) {
                  priceValue = await page.$eval(selectorPrice(j), el => el.value);
                }
                priceValue = priceValue ?
                priceValue.replace(/\s/g, '') 
                : priceValue; 

                listParams.name.push(name || '');                
                listParams.sku.push(sku || '');
              } catch (e) {
                console.log(e);
                console.log('error in row');
              }
            }
          }
        } catch (e) {
          console.log(e);
          console.log('error in page');
        }
    
        await browser.close();

        console.log('listParams');
        console.log(listParams);

        return listParams;


    } catch(e) {
        console.log('getPersentProducts');
        console.log(e);
    }
  }

module.exports = {
    parsePersentProducts,
    writeResultColumnsYMProfit,
    parseReturns
}
