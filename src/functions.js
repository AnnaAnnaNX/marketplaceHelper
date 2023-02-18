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

function sleep(ms) {
    return new Promise(resolve => {setTimeout(resolve, ms);});
}

module.exports = {
    setPricies,
    showDoc,
    matchingAvailabilities,
    sleep
}
