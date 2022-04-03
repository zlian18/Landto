const Joi = require('joi');

module.exports.landscapeSchema = Joi.object({
    landscape: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        images: Joi.array().items(
            Joi.object({
                url: Joi.string().required(),
                key: Joi.string().required()
            }).required()
        ),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
})