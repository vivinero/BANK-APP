const mongoose = require('mongoose');

const bettingSchema = new mongoose.Schema({
    bettingName:{
        type: String,
        enum:["Sporty-Bet", 'Bet-King', "Bet-9ja", "1x-Bet"],
        required: true
    },
    betttingId: { 
        type: String, 
     },


}, {timestamps:true});

const betting = mongoose.model('betting', bettingSchema);

module.exports = betting;
