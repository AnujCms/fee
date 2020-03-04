function doseValidation(req,res){
    req.assert('dosevalue', 'Invalid dosevalue').notEmpty();
    req.assert('dosedatetime', 'Invalid dosedatetime').notEmpty();
    return req.validationErrors();
}




exports.doseValidation = doseValidation;