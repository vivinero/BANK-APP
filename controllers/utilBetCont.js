const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const bettingModel = require('../models/bettingModel')
const transHistMod = require('../models/transHistMod')
// const mongoose = require("mongoose")

exports.betTrans = async (req, res)=>{
  try {
    const {userId} = req.user
    
    // const isValidObjectId = mongoose.Types.ObjectId.isValid(betId);
    
    const {betAcctNum, amount, transacPin, betId} = req.body

    const user = await userModel.findById(userId)
    const bet = await bettingModel.findById(betId)
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    if (!bet) {
        return res.status(404).json({
            message: 'BetID not found'
        });
    }
    const comparetransacPin = bcrypt.compareSync(transacPin, user.transactionPin);

    if (!comparetransacPin) {
        return res.status(400).json({
            message: 'Invalid transaction pin, please type in a correct pin'
        });
     }
      
    
     // Validate recvrAcctNum to be exactly 10 digits
    if (!/^\d{10}$/.test(betAcctNum)) {
        return res.status(400).json({
            message: 'Invalid bet account number. account number should be exactly 10 digits.'
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
    
    if (checkAmount < 50) {
        return res.status(400).json({
            message: 'Insufficient amount, bet placed needs to be 50 and above'
        });
    }

    if (checkAmount > user.balance) {
        return res.status(400).json({
            message: 'Insufficient Balance, please deposit to carry out this transaction'
        });
    }
    
    const newAccountBalForSender = user.balance - checkAmount;
    user.balance = newAccountBalForSender

    const betHistory = await new transHistMod({
        sender: user.accountNumber,
        reciever:betAcctNum,
        amount:checkAmount,
        type:"debit"
    }).save()
    
    user.betting.push(betHistory._id)
    user.transHist.push(betHistory._id)
    user.save()
     
    return res.status(200).json({
        message: `successfully deposited to betting account number ${betAcctNum}`,
        data:user
    })
  } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}