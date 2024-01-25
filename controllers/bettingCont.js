const bettingModel = require("../models/bettingModel")

exports.createBet = async (req, res) => {
    try {
        const {bettingName} = req.body
        const betting = await bettingModel.create({bettingName})
        betting.betttingId = betting._id
        await betting.save()

        res.status(200).json({
            message: "You have successfully created a Bet",
            betting

        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getAll = async (req, res) => {
    try {
        const betting = await bettingModel.find()
        if (!betting) {
            return res.status(200).json({
                message: "Unable to find bets"
            })
        }
        if (betting.length === 0) {
            return res.status(200).json({
                message: "There are no bets created"
            })
        }
        return res.status(200).json({
            message: "These are the bets",
            data: betting
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

