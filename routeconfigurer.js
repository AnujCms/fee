var express = require('express');
var ProductionWebsiteStaticsFilesRouter = require('./routes/prodStaticFilesRouter.js');
var webServiceRouter = require("./routes/webserviceRouter.js");
var path = require('path');
const swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerDefinition = {
    openapi: "3.0.0",
    components: {
        securitySchemes: {
            MobilePatientSecurity:
            {
                type: 'apiKey',
                name: 'x-access-token',
                in: 'header'
            },
            ProviderSecurity:
            {
                type: 'apiKey',
                name: 'session',
                in: 'cookie'
            }
        }
    },
    info: {
        title: 'Node Swagger API',
        version: '1.0.0',
        description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    servers:
        [{
            url: '/api',
            description: 'the api end point'
        }]
}
// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: [__dirname + '/api/ProviderAuthService.js',
    __dirname + '/api/ProviderService.js',
    __dirname + '/api/OtpService.js',
    __dirname + '/api/UserService.js',
    __dirname + '/adminapi/AccountService.js']// pass all in array

};
var swaggerSpec = swaggerJSDoc(options);


var errorHandler = function (err, req, res, next) {
    console.log(err.stack)
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({ error: err });
};

function redirectHttpToHttps(req, res, next) {
    if ((!req.secure) && req.get('X-Forwarded-Proto') && (req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + 'svmanuj.com' + req.url);
    }
    else
        next();
}
function blockDotMapFiles(req, res, next) {
    res.status(404).end();
}

function mountRoutes(app, passport) {
    if (app.settings.env === 'production') {
        app.use(redirectHttpToHttps);
        app.use('*.map', blockDotMapFiles);
    }
    app.use('/api', webServiceRouter(passport));
    app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use(errorHandler);
}

function mountStaticSite(app) {
    app.use('/HomepageAssest', ProductionWebsiteStaticsFilesRouter());
    app.use('/', express.static(path.join(__dirname, 'reactclient'), {
        maxAge: 86400000 * 365,
        index: false
    }));
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'reactclient', 'index.html'));
    });
}

exports.mountRoutes = mountRoutes;
exports.mountStaticSite = mountStaticSite;