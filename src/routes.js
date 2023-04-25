
const express = require('express')
const ToolsController = require('./controllers/ToolsController')

const router = express.Router()

const scripts = require('./controllers/ScriptsRoute')
const rndScripts = require('./controllers/RndRoute')
const createReportScripts = require('./controllers/createReport')
const profitOzon = require('./controllers/profitOzon')
const ozonKonkurentyScripts = require('./controllers/ozonKonkurentyScripts')
const ymProfitGetPersentScripts = require('./controllers/ymProfitGetPersentScripts')
const ymRenewAmountScripts = require('./controllers/ymRenewAmountScripts')
const ymRenewPriceScripts = require('./controllers/ymRenewPriceScripts')
const findPriceForMarketplaceScripts = require('./controllers/findPriceForMarketplace')
const analyticPricesScripts = require('./controllers/analyticPrices')
const poiskhomeGetLinksScripts = require('./controllers/poiskhome')
const setLeftoversScripts = require('./controllers/setLeftovers')

router.use('/scripts', scripts)
router.use('/rndScripts', rndScripts)
router.use('/createReport', createReportScripts)
// router.use('/profitOzon', profitOzon)
router.use('/ozonKonkurenty', ozonKonkurentyScripts)
router.use('/ymProfitGetPersent', ymProfitGetPersentScripts)
router.use('/ymRenewAmount', ymRenewAmountScripts)
router.use('/ymRenewPrice', ymRenewPriceScripts)
router.use('/findPriceForMarketplace', findPriceForMarketplaceScripts)
router.use('/analytic-prices', analyticPricesScripts)
router.use('/poiskhome', poiskhomeGetLinksScripts)
router.use('/set-leftovers', setLeftoversScripts)


function store(req, res) {
    const tools = {}
    return res.status(201).send({})
}

module.exports = router
