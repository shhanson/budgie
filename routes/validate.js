const Joi = require('joi');

const schema = Joi.object().keys({first: Joi.string().min(3).max(30).required(), last: Joi.string().min(2).max(30).required(), email: Joi.string().email().required(), password: Joi.string().min(5).max(15).required()});

module.exports = schema;
