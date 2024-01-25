const mongoose = require('mongoose');

const transHisSchema = new mongoose.Schema({
    sender:{
        type: String,
        required: true
    },
    reciever: { 
        type: String, 
        required: true
     },
    amount: { 
        type: Number, 
        required: true 
    },
    type:{
        type:String,
        enum:["debit", "credit"],
        required:true
    }


}, {timestamps:true});

const transHist = mongoose.model('TransHistory', transHisSchema);

module.exports = transHist;
