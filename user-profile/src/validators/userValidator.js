const Joi = require('joi');

exports.userSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
});
