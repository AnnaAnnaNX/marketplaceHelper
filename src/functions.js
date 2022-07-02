const {
    getNamePriceObj,
    getSkuPriceObj,
    checkHasAssortimentPage,
    setPriceTargetInAssortiment,
    setPriceToTargetWithoutAssortiment,
    showExcelContent,
    matchingAvailabilitiesFunc
} = require('./helpers');

const setPricies = async (targerFileName) => {

    await setPriceTargetInAssortiment(targerFileName);

}

const matchingAvailabilities = async (sourceFileName, targerFileName) => {
    await matchingAvailabilitiesFunc(sourceFileName, targerFileName);
}

const showDoc = async (file) => {
    return await showExcelContent(file);
}

module.exports = {
    setPricies,
    showDoc,
    matchingAvailabilities
}