const Joi = require('joi');
module.exports.parkSchema = Joi.object({
    name: Joi.string().required(),
    parking: Joi.string().required(), 
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
}).required();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
    }).required()
})