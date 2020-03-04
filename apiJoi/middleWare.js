const _ = require('lodash');

module.exports = (schemaObject,validateDataForm,useJoiError = false) => {
    // useJoiError determines if we should respond with the base Joi error
    // boolean: defaults to false
    const _useJoiError = _.isBoolean(useJoiError) && useJoiError;


    // Joi validation options
    const _validationOptions = {
        abortEarly: true, // abort after the last validation error
        allowUnknown: false, // allow unknown keys that will be ignored
        stripUnknown: true, // remove unknown keys from the validated data
    };

    // return the validation middleware
    return (req, res, next) => {

        const method = req.method.toLowerCase();


            // get schema for the current route
            let body = req.body;
            if(validateDataForm === 'body'){
                body = req.body;
            }
            else if(validateDataForm === 'params'){
                body = req.params;
            }
            else if(validateDataForm === 'query'){
                body = req.query;
            }
            const _schema = schemaObject;

            if (_schema) {
                // Validate req.body using the schema and validation options
                let result = schemaObject.validate(body, _validationOptions)
                if(result.error){
                    const JoiError = {
                        status: 'failed',
                        error: {
                            original: result.error._original,

                            // fetch only message and type from each error
                            details: _.map(result.error.details, ({message, type}) => ({
                                message: message.replace(/['"]/g, ''),
                                type
                            }))
                        }
                    };
                    return res.status(422).json(JoiError);
                }
                else{
                    req.body = result.value
                }
            }
        next();
    };
};