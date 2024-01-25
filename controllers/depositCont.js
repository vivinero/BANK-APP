const userModel = require("../models/userModel");
const TransHisModel = require("../models/transHistMod");
const bcrypt = require('bcrypt');

exports.deposit = async (req, res) => {
    try {
        const { userId } = req.user;
        const { amount, transacPin } = req.body;

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

        // Check if the user's acctBal is 0 or less than 50000
        if (!(checkUser.balance === 0 || checkUser.balance < 50000)) {
            return res.status(400).json({
                message: 'Invalid balance for deposit. Balance should be either 0 or less than 50000.'
            });
        }
         const checkAmount = Number(amount)
         if(!checkAmount){
            return res.status(400).json({
                message: 'Amount inputed must be of a number data type and not string'
            });
        }
        // Check for positive deposit amount
        if (checkAmount <= 0) {
            return res.status(400).json({
                message: 'Invalid deposit amount. Amount should be a positive value.'
            });
        }

        // Increment the user's account balance by the deposit amount
        const newAccountBal = checkUser.balance + checkAmount;
        checkUser.balance = newAccountBal - 10;

        // Create a transaction history for the deposit
        const deposit = await new TransHisModel({
            sender: checkUser.accountNumber,
            reciever: checkUser.accountNumber,
            amount:checkAmount,
            type: "credit"
        }).save();

        // Push the depositId to the user's deposit array
        checkUser.deposits.push(deposit._id);

        // Push the depositId to the user's TransHisModel array
        checkUser.transHist.push(deposit._id);

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
