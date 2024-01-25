const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    SendrAcctNum: {
        type: String,
        required: true
    },
    recvrAcctNum: {
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
    },
    userId:{
        type:String,
        required:true
    }
    
});

const transferModel = mongoose.model('transfers', transferSchema);

module.exports = transferModel;
