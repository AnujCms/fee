const passport = require('passport');
const expressSession = require('client-sessions');
const routeConfigurer = require('./routeconfigurer.js');
const compress = require('compression');
const envVariable = require("./config/envValues.js");
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

function configureExpressApp(app) {
    // you will need to use cookieParser to expose cookies to req.cookies
    app.use(cookieParser());
    app.disable('x-powered-by');
    app.use(compress());
    app.use(helmet({
        noCache:true
    }));
    app.use(expressSession({
        cookieName: 'session', // cookie name dictates the key name added to the request object
        secret: envVariable.sessionSecret, // 'blargadeeblargblarg', // should be a large unguessable string
        duration: 20 *60 * 1000,
        activeDuration:  10 * 60 * 1000,
        cookie: {
            path: '/', // cookie will only be sent to requests under '/api'
             // duration of the cookie in milliseconds, defaults to duration above
            ephemeral: false, // when true, cookie expires when the browser closes
            httpOnly: true, // when true, cookie is not accessible from javascript
            secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    var configPassportForLocal = require('./Passport_Auth.js');
    configPassportForLocal(passport);
    // app.set('authProvider', passport);
    routeConfigurer.mountRoutes(app, passport);
    routeConfigurer.mountStaticSite(app);
}

exports.configureExpressApp = configureExpressApp;