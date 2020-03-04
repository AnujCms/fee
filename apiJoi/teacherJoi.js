const Joi = require("@hapi/joi").extend(require('@hapi/joi-date'));;

const studentRegistration = Joi.object({
    firstname:Joi.string().required(),
    lastname:Joi.string().required(),
    dob:Joi.date().format('YYYY-MM-DD').raw().required(),
    mothername:Joi.string().required(),
    fathername:Joi.string().required(),
    cellnumber:Joi.string().max(10).min(10).required(),
    adharnumber:Joi.string().max(12).min(12).required(),
    gender:Joi.number().valid(1,2).required(),
    religion:Joi.number().valid(1,2,3,4).required(),
    category:Joi.number().valid(1,2,3,4).required(),
    category:Joi.number().valid(1,2,3).required(),
    locality:Joi.number().valid(1,2).required(),
    parmanentaddress:Joi.string().max(100).required(),
    localaddress:Joi.string().max(100).required(),
    images:Joi.string().allow('').allow(null),
    studentid:Joi.string().allow('').allow(null)
})
const studentCreateResult = Joi.object({
    examinationtype:Joi.number().required().valid(1,2,3,4),
    subjectid:Joi.number().required().valid(1,2,3,4,5,6,7,8,9,10,11,12),
    totalMarks:Joi.number().required().min(1),
    obtainMarks:Joi.number().required().min(0)
})
const studentCreateAttendance = Joi.object({
    monthName:Joi.number().required().valid(1,2,3,4,5,6,7,8,9,10,11,12),
    totalClasses:Joi.number().required().min(1),
    presentClasses:Joi.number().required().min(0)
})
exports.studentRegistration = studentRegistration;
exports.studentCreateResult = studentCreateResult;
exports.studentCreateAttendance = studentCreateAttendance;