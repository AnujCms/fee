const Joi = require("@hapi/joi").extend(require('@hapi/joi-date'));;

const studentEntrance = Joi.object({
    fname:Joi.string().required().max(100),
    lname:Joi.string().required().max(100),
    cellnumber:Joi.string().required().min(10).max(10),
    adharnumber:Joi.string().required().min(12).max(12),
    dob:Joi.date().format('YYYY-MM-DD').raw().required(),
    class:Joi.number().required().valid(1,2,3,4,5,6,7,8)
})

exports.studentEntrance = studentEntrance;
