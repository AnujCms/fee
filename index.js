var http = require("http");
var express = require("express");
var envVariable = require("./config/envValues.js");

var db = require('./database/db.js');

var server;
    var app = express();
    app.set('port', envVariable.port);
    db.connect('mode', function (err) {
        if (err) {
            console.log('Unable to connect to MySQL.', err)
        } else {
            require("./ConfigApp").configureExpressApp(app);
            server = http.createServer(app);
            server.listen(app.get('port'), function () {
                console.log('Express server listening on port ' + app.get('port'));
            });
        }
    });
 
