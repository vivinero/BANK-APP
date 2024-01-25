const bettingRouter =require('express').Router()


const {betTrans} = require('../controllers/airtimeCont')
const { createBet, getAll } = require('../controllers/bettingCont')
 
bettingRouter.post("/create-bet", createBet)
bettingRouter.get("/all-bets", getAll)

module.exports = bettingRouter