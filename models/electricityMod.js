const mongoose = require('mongoose');

const electricitySchema = new mongoose.Schema({
    eletricityName:{
        type: String,
        enum:["AEDC", 'BEDC', "EKEDC"],
        required: true
    },
    eletricityId: { 
        type: String, 
     },


}, {timestamps:true});

const eletricity = mongoose.model('eletricity', electricitySchema);

module.exports = eletricity;
