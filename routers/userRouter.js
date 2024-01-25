const { deposit } = require("../controllers/depositCont")
const { getTransactionHistory } = require("../controllers/transactionHistCont")
const { transfer } = require("../controllers/transferCont")
const { signUp, signIn, signOut } = require("../controllers/userCont")
const { betTrans } = require("../controllers/utilBetCont")
const { airtimeTrans } = require("../controllers/utilityAirtime")
const { elecTrans } = require("../controllers/utilityElec")
const { withdraw } = require("../controllers/withdrawCont")
const { authenticate } = require("../middleware/authentication")

// const uploads = require("../utilityMW/multer")

const userRouter = require("express").Router()

// for user signing-up into the bank app
// router.post('/sign-up', uploads.single('profileImage'), signUp)
userRouter.post('/sign-up', signUp)

// for user logging-in into the bank app
userRouter.post('/sign-in', signIn)


// for user logging-out into the bank app
userRouter.post('/sign-out',authenticate, signOut)



// for user depositing into his account
userRouter.post ("/deposit",authenticate, deposit)

// for user traansfering out of the account
userRouter.post("/transfer", authenticate,transfer)

// for user withdrawing into another account
userRouter.post("/withdraw", authenticate, withdraw)

// for the user to see all transaction history
userRouter.get("/getallmyhistory", authenticate, getTransactionHistory)

// user pay for airtime
userRouter.post('/purchase-airtime', authenticate, airtimeTrans)

// user pay for bet
userRouter.post('/place-bet', authenticate, betTrans)

// user pay for electricity
userRouter.post('/pay-electbill', authenticate, elecTrans)

module.exports = userRouter