var express = require('express');
var path = require('path');
var router = express.Router();
var options = {
    index: false,
    maxAge: '30d',
    redirect: false,
    setHeaders: function (res) {
        res.set('x-timestamp', Date.now());
    }
};
function configRouter()
{   
    router.use('/',express.static(path.join(__dirname,'..','production_website/assets'),options));
    return router;
}

module.exports = configRouter;
