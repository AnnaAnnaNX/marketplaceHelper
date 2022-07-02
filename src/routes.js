
const express = require('express')
const ToolsController = require('./controllers/ToolsController')

const router = express.Router()

const scripts = require('./controllers/ScriptsRoute')
const rndScripts = require('./controllers/RndRoute')
const createReportScripts = require('./controllers/createReport')
const profitOzon = require('./controllers/profitOzon')
const ozonKonkurentyScripts = require('./controllers/ozonKonkurentyScripts')

router.use('/scripts', scripts)
router.use('/rndScripts', rndScripts)
router.use('/createReport', createReportScripts)
// router.use('/profitOzon', profitOzon)
router.use('/ozonKonkurenty', ozonKonkurentyScripts)


function store(req, res) {
    const tools = {}
    return res.status(201).send({})
}

module.exports = router