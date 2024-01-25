const joi = require('joi')

const myValidate = joi.object({
    firstname:joi.string()
    .min(3)
    .max(15),

    lastname:joi.string()
    .min(3)
    .max(15),

    email:joi.string()
    .email({
        minDomainSegments:2, 
        tlds:{allow: ['com','net','ng']}
    }),
  
    phoneNumber:joi.string()
    .pattern(new RegExp('^[0-9]'))
    .min(11)
    .max(11),

    userPassword:joi.string()
    .pattern(new RegExp('^[0-9]')).min(6).max(6),

    confirmPassword:joi.string()
    .pattern(new RegExp('^[0-9]')).min(6).max(6),

    transactionPin:joi.string()
    .pattern(new RegExp('^[0-9]')).min(4).max(4),
})

module.exports= {myValidate}