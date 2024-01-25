const userModel = require("../models/userModel");
const withdrawModel = require("../models/withdrawModel")
const TransHisModel = require("../models/transHistMod");
const bcrypt = require('bcrypt');

exports.withdraw = async (req, res) => {
    try {
        const { userId } = req.user;
        const { amount, transacPin, recieverAcctNum } = req.body;

        // Check whether the userId is present in the database
        const checkUser = await userModel.findById(userId);

        if (!checkUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Check the user's transacPin is the same as the req.body transacPin
        const comparetransacPin = bcrypt.compareSync(transacPin, checkUser.transactionPin);

        if (!comparetransacPin) {
            return res.status(400).json({
                message: 'Invalid transaction pin, please type in a correct pin'
            });
        }

      
         const checkAmount = Number(amount)
         if(!checkAmount){
            return res.status(400).json({
                message: 'Amount to be deposited must be of a number data type and not string'
            });
        }

        // Check for positive deposit amount
        if (checkAmount <= 0) {
            return res.status(400).json({
                message: 'Invalid deposit amount. Amount should be a positive value.'
            });
        }
         
          // Check if the account balance is greater than the amount for the transfer
          if (checkAmount > checkUser.balance) {
            return res.status(400).json({
                message: 'Insufficient Balance, please deposit to carry out this transaction'
            });
        }
        
          // Validate recvrAcctNum to be exactly 10 digits
          if (!/^\d{10}$/.test(recieverAcctNum)) {
            return res.status(400).json({
                message: 'Invalid receiver account number. It should be exactly 10 digits.'
            });
        }

        // decrement the user's account balance by the deposit amount
        const newAccountBal = checkUser.balance - checkAmount;
        checkUser.balance = newAccountBal - 10

        // Create a transaction history for the deposit
        const withdraw = await new withdrawModel({
            SendrAcctNum: checkUser.accountNumber,
            recvrAcctNum:recieverAcctNum,
            amount:checkAmount,
            type: "debit"
        }).save();

        // Push the depositId to the user's deposit array
        checkUser.withdraws.push(withdraw._id);

        // Push the depositId to the user's TransHisModel array
        checkUser.transHist.push(withdraw._id);

        // Save the user's data
        await checkUser.save();

        // Check the success and return the user's data
        return res.status(200).json({
            message: 'Deposit successful',
            checkUser
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
