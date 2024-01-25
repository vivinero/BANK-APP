const userModel = require("../models/userModel");
const TransHisModel = require("../models/transHistMod");

exports.getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.user;

        // Check whether the userId is present in the database
        const checkUser = await userModel.findById(userId);

        if (!checkUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Retrieve the user's transaction history
        const transactionHistory = await TransHisModel.find({
            $or: [
                { sender: checkUser.accountNumber },
                { receiver: checkUser.accountNumber }
            ]
        }).sort({ createdAt: -1 
       
    });

        return res.status(200).json({
            message: 'Transaction history retrieved successfully',
            transactionHistory
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
