const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require:true
    },
    lastName:{
        type: String,
        require:true
    }, 
    // profileImage:{
    //     type: String,
    //     require:true
    // }, 
    phoneNumber:{
        type: String,
        require:true,
        unique:true
    },
    email:{
        type: String,
        require:true,
        unique:true
    },
    password:{
        type: String,
        require:true
    },
    transactionPin:{
        type: String,
        require:true
    },
    accountNumber: { 
        type: String, 
        unique: true, 
        required: true 
    },
    fullName: { 
        type: String, 
        unique: true, 
        required: true 
    },
    balance: { 
        type: Number,
        default: 0 
    },
    userId:{
        type: String,
        required:true
    },
    withdraws:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"withdraws",
    }],
    transfers:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"transfers",
    }],
    deposits:[{
        type: String
    }],
    transHist:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"TransHistory",
    }],
    electricity:[{
        type: String,
    }],
    betting:[{
        type: String,
    }],
    airtime:[{
        type: String,
    }]
    
},{timestamp:true})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel