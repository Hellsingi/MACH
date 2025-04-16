const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(0).max(160).required()
});

const updateUserSchema = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email(),
    age: Joi.number().integer().min(0).max(160)
}).min(1);

module.exports = { userSchema, updateUserSchema };
