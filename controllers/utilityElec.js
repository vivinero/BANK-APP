const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const electricityMod = require('../models/electricityMod')
const transHistMod = require('../models/transHistMod')

exports.elecTrans = async (req, res)=>{
  try {
    const {userId} = req.user
    
    const {elecAcctNum, amount, transacPin, elecId} = req.body

    const user = await userModel.findById(userId)
    const electricity = await electricityMod.findById(elecId)
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    if (!electricity) {
        return res.status(404).json({
            message: 'electricity id not found'
        });
    }
    const comparetransacPin = bcrypt.compareSync(transacPin, user.transactionPin);

    if (!comparetransacPin) {
        return res.status(400).json({
            message: 'Invalid transaction pin, please type in a correct pin'
        });
     }
      
    
     // Validate recvrAcctNum to be exactly 10 digits
    if (!/^\d{8}$/.test(elecAcctNum)) {
        return res.status(400).json({
            message: 'Invalid electricity account number. It should be exactly 8 digits.'
        });
     }

    const checkAmount = Number(amount)
    if(!checkAmount){
        return res.status(400).json({
            message: 'Amount inputed must be of a number data type and not string'
        });
    }

    if (checkAmount <= 0) {
        return res.status(400).json({
            message: 'Invalid transfer amount. Amount should be a positive value.'
        });
    }
    
    if (checkAmount < 1000) {
        return res.status(400).json({
            message: 'Insufficient amount, electricity payment placed is to be 1000 and above'
        });
    }

    if (checkAmount > user.balance) {
        return res.status(400).json({
            message: 'Insufficient Balance, please deposit to carry out this transaction'
        });
    }
    
    const newAccountBalForSender = user.balance - checkAmount;
    user.balance = newAccountBalForSender - 10

    const electricityHist = await new transHistMod({
        sender: user.accountNumber,
        reciever:elecId,
        amount:checkAmount,
        type:"debit"
    }).save()
    
    user.electricity.push(electricityHist._id)
    user.transHist.push(electricityHist._id)
    user.save()
     
    return res.status(200).json({
        message: `successfully paid for an electricity token`,
        data:user
    })
  } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}