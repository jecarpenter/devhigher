const Joi = require('@hapi/joi');


//Schema for Registration and Log in
const registrationSchema = Joi.object({

    name: Joi.string().min(6).required().max(255),

    email: Joi.string().min(6).required().email(),

    password: Joi.string().min(6).required(),

})



const loginSchema = Joi.object({

    email: Joi.string().min(6).required().email(),

    password: Joi.string().min(6).required(),

})


const Validation = schema => data => schema.validate(data);



module.exports.registerValidation = Validation(registrationSchema)

module.exports.loginValidation = Validation(loginSchema)