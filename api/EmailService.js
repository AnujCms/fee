const EmailService = require('../EmailService/EmailService');
const envVariable = require("../config/envValues.js");
const router = require('express').Router();

//delete Users
router.post("/contactus", async function (req, res) {
    let mailOptions = {
        from: req.body.emailid,
        to: envVariable.emailDetails.RECIEVER,
        subject: "Software Enquiry",
        text: 
        `Name: ${req.body.name} 
        Cell Number: ${req.body.cellnumber} 
        Email Id: ${req.body.emailid}
        Message: ${req.body.message}
        Edusamadhan`
      };
      EmailService.transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(200).json({status:0, statusDescription:"Sorry! Not able to send the email."});
        } else {
            res.status(200).json({status:1, statusDescription:"Your query has been recieved successfully. We will get back to you soon."});
        }
      });
})

module.exports = router;