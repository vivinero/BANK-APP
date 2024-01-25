const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const airtimeModel = require('../models/airtimeMod')
const transHistMod = require('../models/transHistMod')

exports.airtimeTrans = async (req, res)=>{
    try {
        const {userId} = req.user
        const {airtimeName, phoneNumber, amount, transacPin, airtimeId}= req.body

        const user = await userModel.findById(userId)
        const airtime = await airtimeModel.findById(airtimeId)

        if(!user){
            return res.status(404).json({
                message:'User not found'
            })
        }
        if(!airtime){
            return res.status(404).json({
                message:'Unable to find airtime with this name'
            })
        }

       
        if (airtime.airtimeName !== airtimeName) {
            return res.status(400).json({
                message: 'AirtimeId and airtimeName do not match'
            });
        }
        const comparetransacPin = bcrypt.compareSync(transacPin, user.transactionPin);

        if (!comparetransacPin) {
            return res.status(400).json({
                message: 'Invalid transaction pin, please type in a correct pin'
            });
         }
          
        
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({
                message: 'Incorrect phone number.  phone number should be exactly 11 digits.'
            });
         }
    
         const checkAmount = Number(amount)
         if(!checkAmount){
            return res.status(404).json({
                message:'Amount inputed must be of a number data type and not string'
            })
         }
         if (checkAmount <= 0) {
            return res.status(400).json({
                message: 'Invalid transfer amount. Amount should be a positive value.'
            });
        }
        
        if (checkAmount < 50) {
            return res.status(400).json({
                message: 'Insufficient amount, airtime amount needs to be 50 and above'
            });
        }
    
        if (checkAmount > user.balance) {
            return res.status(400).json({
                message: 'Insufficient Balance, please deposit to carry out this transaction'
            });
        }

        const newAccountBalForSender = user.balance - checkAmount
        user.balance = newAccountBalForSender

        const airtimeHistory = await new transHistMod({
        sender: user.accountNumber,
        reciever:phoneNumber,
        amount:checkAmount,
        type:"debit"
        }).save()

        user.airtime.push(airtimeHistory._id)
        user.transHist.push(airtimeHistory._id)
        user.save()
        
        return res.status(200).json({
            message: `successfully sent airtime to ${phoneNumber}`,
            data:user
        })
        
    } catch (err) {
        res.status(500).json({
            error:err.message
        })
    }
}

