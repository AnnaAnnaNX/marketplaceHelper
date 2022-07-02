const puppeteer = require('puppeteer');
const fs = require('fs');
const { shops } = require('./consts.json');

//name
const selectorProductLink = {
  'viza-yacht': 'h1',
  'akuaboat.ru': 'h1[itemprop="name"]',
  'tactic-boat.com': 'h1:nth-child(2).intro__title_large',
  'sharkboats.ru': 'h2 span',
  'wyatboat.com': 'h1[itemprop="name"]',
  'water-way-boat.ru': '.content h4:first-child',
  'armada64.ru': '.article-title',
  'salut-boats.ru': '.page-title-block .b-title',
  'xn--80axddk': 'h1',
  'malutka.org': 'div h1',
  'moreman.ru': '.info-titles h1',
  'lodki-lodki.ru': '.product_name_wrap_mobile [itemprop="name"]'
};
//price
const selectorNextButton = {
  'viza-yacht': 'dd:nth-child(2) .actualprice',
  'akuaboat.ru': 'p .woocommerce-Price-amount',
  'tactic-boat.com': 'h1+.intro__price',
  'sharkboats.ru': '.productPrice',
  'wyatboat.com': 'span.price-order:first-child',
  'water-way-boat.ru': '.content h4:first-child',
  'armada64.ru': '.article-title',
  'salut-boats.ru': '.price .price',
  'xn--80axddk': '.model-page__price b',
  'malutka.org': 'div.price',
  'moreman.ru': '.mini-goods  .product-item__price-cur b',
  'lodki-lodki.ru': '.price.have_discount > [data-price]:first-child'
};

const selectorLinkAfterSearch = '.b-product-gallery__title';
const selectorBigPictureLink = '.b-product-image img';
const selectorArt = '[data-qaid="product_code"]';
const selectorName = '[data-qaid="product_name"]';
const selectorCount = '[data-qaid="presence_data"]';
const selectorCharacteristics = '.b-product-info';

const checkExistance = async (page, selector) => {
    const elsCount = await page.$$eval(selector, els => els.length);
  
    console.log('elsCount length');
    console.log(elsCount);
    if (!elsCount) {
      console.log('there are not tag for '+selector+' selector');
      return null;
    }
    return true;
}

const getShop = (link) => {
  if (!link) return null;
  
  if (/viza-yacht.ru/.test(link)) {
    return 'viza-yacht';
  }
  if (/akuaboat.ru/.test(link)) {
    return 'akuaboat.ru';
  }
  if (/tactic-boat.com/.test(link)) {
    return 'tactic-boat.com';
  }
  if (/sharkboats.ru/.test(link)) {
    return 'sharkboats.ru';
  }
  if (/wyatboat.com/.test(link)) {
    return 'wyatboat.com';
  }
  if (/water-way-boat.ru/.test(link)) {
    return 'water-way-boat.ru';
  }
  if (/armada64.ru/.test(link)) {
    return 'armada64.ru';
  }
  if (/salut-boats.ru/.test(link)) {
    return 'salut-boats.ru';
  }
  if (/xn--80axddk/.test(link)) {
    return 'xn--80axddk';
  }
  if (/malutka.org/.test(link)) {
    return 'malutka.org';
  }
  if (/moreman.ru/.test(link)) {
    return 'moreman.ru';
  }
  if (/lodki-lodki.ru/.test(link)) {
    return 'lodki-lodki.ru';
  }
  return null;
}

const formatName = (name, shop) => {
  if (shop === 'water-way-boat.ru') {
    const arr = name && name.split('                                       ');
    if (arr && arr.length) {
      return arr[0] && arr[0].toString().trim();
    }
  }
  return name && name.toString().trim();
}

const formatPrice = (price, shop) => {
  if (!price) {
    return price;
  }
  if (shop === 'water-way-boat.ru') {
    const arr = price && price.split(`         `);
    console.log(JSON.stringify(arr));
    if (arr && arr.length && (arr.length > 0)) {
      price = arr[arr.length - 1] && arr[arr.length - 1].toString().trim();
    }
  }
  if (shop === 'armada64.ru') {
    const arr = /(\d+ )+/.exec(price);
    price = arr && arr.length && arr[0];
  }
  let newPrice = price.toString().trim();
  newPrice = newPrice.replace(' ', '').replace(',', '').replace('руб.', '');
  newPrice = newPrice.replace('Цена', '');
  newPrice = newPrice.replace('=', '');
  newPrice = newPrice.replace('от', '');
  newPrice = newPrice.replace('₽', '');
  newPrice = newPrice.replace('р.', '');
  newPrice = newPrice.toString().trim()
  
  return newPrice;
}


const parseNamesAndPrices = async (shopName, links) => {
  try {
    console.log(links);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
      
    const names = [];
    const prices = [];
    const codes = [];
    const imgs = [];

    for (let i = 1; i < links.length; i++) {

      
      let name = '';
      let price = '';

      try {
        await page.goto(links[i]);
        if (shopName === 'https://www.shop.mega-optim.ru') {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        if (!(await checkExistance(page, shops[shopName].selectorName))) {
          console.log('not found selectorName');        
        } else {
          name = await page.$eval(shops[shopName].selectorName, el => el.innerText);      
        }

        if (!(await checkExistance(page, shops[shopName].selectorPrice))) {
          console.log('not found selectorPrice');        
        } else {
          price = await page.$eval(shops[shopName].selectorPrice, el => el.innerText);      
          // price = parseInt(price.replace(' ', ''), 10);
          price = price.toString().trim();
          price = price.replace(/\.\d\d$/g, '');
          price = price.match(/\d+/g);
          price = parseInt(price.join(''), 10);
        }

        if (shopName === 'https://rnd.4stm.ru/') {

          let img = '';
          if (!(await checkExistance(page, shops[shopName].selectorImage))) {
            console.log('not found selectorImage');        
          } else {
            img = await page.$eval(shops[shopName].selectorImage, el => el.getAttribute('href'));
            // img = await page.$eval(shops[shopName].selectorImage, el => el);
          }
          imgs[i] = img;

          let code = '';
          if (!(await checkExistance(page, shops[shopName].selectorCode))) {
            console.log('not found selectorCode');        
          } else {
            code = await page.$eval(shops[shopName].selectorCode, el => el.innerText);
          }
          codes[i] = code;

        }

      } catch (e) {
          console.log(e);
      }

      names[i] = name;
      prices[i] = price;
    }

    await browser.close();
    names[1] = 'Names';
    prices[1] = 'Prices';
    if (shopName === 'https://rnd.4stm.ru/') {
      codes[1] = 'Codes';
      imgs[1] = 'Imgs';
    }

    const resultObj =  {
      names: names,
      prices: prices
    }
    if (shopName === 'https://rnd.4stm.ru/') {
      resultObj.codes = codes;
      resultObj.imgs = imgs;
    }
    return resultObj;
  } catch (e) {
    return { error: e }
  }
}

const parsePriceName = async (link) => {
  try {
    console.log(link);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    await page.goto(link);
    let i = 0;
    let linkToProduct = null;
    let pictureLink = null;
    let art = null;
    let name = null;
    let count = null;
    let characteristics = '';
    let minTemp = null;
    let mosh = null;
    let cocol = null;
    let diametr = null;
    let dlina = null;
    let countInSet = null;
    let color = null;

    // while (true) {
      if (!(await checkExistance(page, selectorLinkAfterSearch))) {
        console.log('not found selectorLinkAfterSearch');
        await browser.close();
        return {
        };
      }
      // if (!(await checkExistance(page, selectorNextButton[shop]))) {
      //     console.log('not fount price');
      //     await browser.close();
      //     return {
      //       link: null,
      //       name: null
      //     };
      // }
      linkToProduct =  await page.$eval(selectorLinkAfterSearch, el => el.getAttribute('href'));
      console.log('linkToProduct');
      console.log(linkToProduct);
      // await page.waitForTimeout(1000);
      await page.goto(linkToProduct);
      await page.setDefaultNavigationTimeout(0); 
      if (!(await checkExistance(page, selectorBigPictureLink))) {
        console.log('not found selectorBigPictureLink');
        await browser.close();
        return {
        };
      }
      try {
        pictureLink =  await page.$eval(selectorBigPictureLink, el => el.getAttribute('src'));
      } catch (e) {}
      console.log('pictureLink');
      console.log(pictureLink);

      if (!(await checkExistance(page, selectorArt))) {
        console.log('not found selectorArt');
        await browser.close();
        return {
        };
      }
      try {
        art =  await page.$eval(selectorArt, el => el.innerHTML);
      } catch (e) {}
      console.log('art');
      console.log(art);

      
      if (!(await checkExistance(page, selectorName))) {
        console.log('not found selectorName');
        await browser.close();
        return {
        };
      }
      try {
        name =  await page.$eval(selectorName, el => el.innerHTML);
      } catch (e) {}
      console.log('name');
      console.log(name);


      if (!(await checkExistance(page, selectorCount))) {
        console.log('not found selectorCount');
        await browser.close();
        return {
        };
      }
      try {
        count =  await page.$eval(selectorCount, el => el.innerHTML);
      } catch (e) {}
      console.log('count');
      console.log(count);

      
      if (!(await checkExistance(page, selectorCharacteristics))) {
        console.log('not found selectorCharacteristics');
        await browser.close();
        return {
        };
      }
      try {
        characteristics =  await page.$eval(selectorCharacteristics, el => el.innerText);
      } catch (e) {}
      console.log('characteristics');
      console.log(characteristics);
      
      let result = /Минимальная цветовая температура([ а-я0-9К]*)[А-Я]*/.exec(characteristics);
      minTemp = result && result.length && result[1];

      result = /Мощность([ а-я0-9Вт]*)[А-Я]*/.exec(characteristics);
      mosh = result && result.length && result[1];

      result = /Цоколь([ а-я0-9A-Z]*)[А-Я]*/.exec(characteristics);
      cocol = result && result.length && result[1];

      result = /Диаметр([ а-я0-9а-я]*)[А-Я]*/.exec(characteristics);
      diametr = result && result.length && result[1];

      result = /Длина([ а-я0-9а-я]*)[А-Я]*/.exec(characteristics);
      dlina = result && result.length && result[1];

      result = /Количество в упаковке([ а-я0-9\.]*)[А-Я]*/.exec(characteristics);
      countInSet = result && result.length && result[1];

      result = /Цвет колбы лампочки([ а-я0-9]*)[А-Я]*/.exec(characteristics);
      color = result && result.length && result[1];



    
    // }
    await browser.close();

    return {
      link: linkToProduct,
      pictureLink: pictureLink,
      art,
      name,
      count,
      minTemp,
      mosh,
      cocol,
      diametr,
      dlina,
      countInSet,
      color
    };
  } catch(e) {
    console.log(e);
    return null;
  }

};

module.exports = {
  parseNamesAndPrices,
  parsePriceName
}