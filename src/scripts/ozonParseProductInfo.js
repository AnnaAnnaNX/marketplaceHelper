const puppeteer = require('puppeteer');
const { checkExistance  } = require('../helpers');
const {sleep} = require("../functions");
// const iPhone = puppeteer.devices['iPhone 11'];

const durationPause = 1000
const ozonParseProductInfo = async (linkObject) => {
    try {
        console.log(ozonParseProductInfo);
        // const browser = await puppeteer.launch({headless: false});
        // await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
        // const page = await browser.newPage();
        // await page.goto('https://www.ozon.ru/product/kartridzh-atoll-mp-5v-vspenennyy-polipropilen-175974825/?asb=QiU5RGV7JK6T6AJ8YLZg%252FFcA6r5vddVC5str46xD%252FNs%253D&asb2=tJjyltsbO4XCIQrFN4HRzRNnqUuB4j_ReBDPPRpeHTsm9hPZBcqRjJDUdnv9UOz2&avtc=1&avte=2&avts=1694093880&keywords=ATOLL+%D0%BA%D0%B0%D1%80%D1%82%D1%80%D0%B8%D0%B4%D0%B6+%D0%9C%D0%9F-5%D0%92&sh=xvDpurGFhQ');
        // await sleep(durationPause*5);
        // await page.emulate(iPhone);

        const listParams = {
        }

        const ids = Object.keys(linkObject)

        for(let j = 0; j < ids.length; j++) {
        // ids.forEach(async (id) => {
            const id = ids[j]
            for(let i = 1; i < 6; i++) {
            // [1, 2, 3, 4, 5].forEach(async (i) => {
                const link = linkObject[id][`Конкурент ${i} на озоне`]
                if (link) {
                    let page = null
                    let browser = null
                    let successGoto = false
                    try {
                        browser = await puppeteer.launch({headless: false});
                        page = await browser.newPage();
                        await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
                        await page.goto(link);
                        //await sleep(durationPause*5);
                        successGoto = true
                    } catch (e) {
                        console.log('successGoto = false')
                        console.log(link)
                    }

                    if (successGoto) {
                        linkObject[id][`Конкурент ${i + 1} на озоне_price`] = await gitPriceByLink(page)
                    }

                    await browser.close();

                }
            }
        }

        // await browser.close();

        return linkObject;
    } catch (e) {
        return { error: e }
    }
}


const gitPriceByLink = async (page) => {

    const selectors = {
        'price ozon without card': '[data-widget="webPdpGrid"] [data-widget="webPrice"] >div>div:nth-child(2) div:first-child>div:first-child>span:first-child',
        'ozon with card': '[data-widget="webPdpGrid"] [data-widget="webPrice"] >div>div:nth-child(1) div:first-child>div:first-child>span:first-child'
    }

    let price = '';

    try {

        if (!(await checkExistance(page, selectors['price ozon without card']))) {
            console.log(`not found ${selectors.price(i)}`);
        } else {
            let val = await page.$eval(selectors['price ozon without card'], el => el.innerText);
            val = val.replace('₽', '').replace(/\s/g, '').trim();
            price = parseInt(val);
        }

        if (!price) {
            if (!(await checkExistance(page, selectors['ozon with card']))) {
                console.log(`not found ${selectors.price(i)}`);
            } else {
                let val = await page.$eval(selectors['ozon with card'], el => el.innerText);
                val = val.replace('₽', '').replace(/\s/g, '').trim();
                price = parseInt(val);
            }
        }


    } catch (e) {
        console.log(e);
    }

    return price

}

module.exports = {
    ozonParseProductInfo,
}