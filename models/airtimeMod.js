const mongoose = require('mongoose');

const airtimeSchema = new mongoose.Schema({
    airtimeName:{
        type: String,
        enum:["AIRTEL", "MTN", "ETISALAT", "GLO"],
        required: true
    },
    airtimeId: { 
        type: String, 
     },


}, {timestamps:true});

const airtime = mongoose.model('airtime', airtimeSchema);

module.exports = airtime;
