const eletricityModel = require("../models/electricityMod")


exports.createElect = async (req, res) => {
    try {
        const {eletricityName} = req.body
        const eletricity = await eletricityModel.create({eletricityName})
        
        eletricity.eletricityId = eletricity._id
        await eletricity.save()

        res.status(200).json({
            message: "You have successfully created an electricty",
            eletricity
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.getAll = async (req, res) => {
    try {
        const eletricity = await eletricityModel.find()
        if (!eletricity) {
            return res.status(200).json({
                message: "Unable to find eletricities"
            })
        }
        if (eletricity.length === 0) {
            return res.status(200).json({
                message: "There are no eletricities created"
            })
        }
        return res.status(200).json({
            message: "These are the eletricities",
            data: eletricity
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

