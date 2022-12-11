const ExcelJS = require('exceljs');
const { fileInfoForReadFile } = require('../consts');
const {
    normalizeCells,
    getNumberColumnByHeaders,
    createObjectFromColumns,
    setMinMax
 } = require('../utils');
const _ = require("lodash");
const {
    ymEffByPrice,
    ymPriceByEff,
    ozonEffByPrice,
    ozonPriceByEff
} = require('../calculateMarketplaceCommission/index');
const { universalReadExcelFileNew } = require('./calsPriceAndEffFunctions');

const getProductLinksToBeParsed = async (files) => {
    try {
        const leftoverGoods = await universalReadExcelFileNew(files[0], 'analyticPrices остатки');
        const linksGoods = await universalReadExcelFileNew(files[1], 'analyticPrices ссылки');
        const leftoverGoodsCodes = Object.keys(leftoverGoods);
        const linksGoodsCodes = Object.keys(linksGoods);
        // if existance links for good
        const goodsCodesForParse = leftoverGoodsCodes.filter(el => linksGoodsCodes.includes(el));
        const resultLinksGoods = {};
        goodsCodesForParse.forEach(code => {
            resultLinksGoods[code] = linksGoods[code];
        });
        return resultLinksGoods;
    } catch (e) {
        console.log(e);
    }
}



module.exports = {
    getProductLinksToBeParsed
}
