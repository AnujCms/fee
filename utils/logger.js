var winston = require('winston');
var node_env = process.env.NODE_ENV || 'local';
var envVariable = require('../config/envValues.js');
winston.emitErrs = true; // catch unhandled exceptions
var Mail = require('winston-mail').Mail;
var logger = new(winston.Logger)({
    transports: [

     new(winston.transports.DailyRotateFile)({
            name: 'all-logs',
            level: 'info',
            filename: envVariable.logFilePath,
            json: true,
            colorize: false,
            zippedArchive: true,
            exitOnError: false,
            timestamp: true
        }),
         new(winston.transports.Console)({
            name: 'console-log',
            level: 'info',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true

        })
    ],

    exitOnError: false



});



logger.handleExceptions(new winston.transports.File({
    filename: envVariable.exceptionLogFilePath,
}));
logger.exitOnError = false;


module.exports = logger;