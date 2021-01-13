//VALIDATION
const Joi = require('@hapi/joi')

//Register Validation
//how is this different?: function registerValidation() {}
const registerValidation = data => { //we don't put () around data?
    const schema = Joi.object({
        name: Joi.string().min(6).required(), //Joi is library
        email: Joi.string().min(6).required().email(), //does this allow 
        // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        password: Joi.string().min(6).required()
        //repeat_password: Joi.ref('password') //how do I quickly make these added (promises?) go on separate lines?
    })
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(), //does this allow 
        // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        password: Joi.string().min(6).required()
        //repeat_password: Joi.ref('password') //how do I quickly make these added (promises?) go on separate lines?
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
