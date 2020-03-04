const nodemailer = require('nodemailer');
const envVariable = require("../config/envValues.js");

exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: envVariable.emailDetails.USER,
    pass: envVariable.emailDetails.PASS
  }
});

