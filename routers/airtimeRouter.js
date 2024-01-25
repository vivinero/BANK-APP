const airtimeRouter = require('express').Router()


const {createAirtime, getAll} = require('../controllers/airtimeCont')

airtimeRouter.post("/create-airtime", createAirtime)

airtimeRouter.get("/allairtime", getAll)
module.exports = airtimeRouter