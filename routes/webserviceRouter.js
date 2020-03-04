var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var validator = require('express-validator');
var isAuthenticated = function (req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).end();
};

function configRouter() {
    router.use(bodyParser.json({
        limit: "2mb"
    }));
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(validator());
    router.use("/emailservice", require('../api/EmailService.js'));
    router.use("/timetableservice", require('../api/TimeTableService.js'));
    router.use("/notificationservice", require('../api/NotificationsService.js'));
    router.use("/eventsservice", require('../api/EventsService.js'));
    router.use("/providerauthservice",require('../api/ProviderAuthService.js'));
    router.use("/superadminservice",isAuthenticated, require("../api/SuperAdminService.js"));
    router.use("/principalservice",isAuthenticated, require("../api/PrincipalService.js"));
    router.use("/teacherservice",isAuthenticated, require("../api/TeacherService.js"));
    router.use("/entranceexamservice",isAuthenticated, require("../api/EntranceExamService.js"));
    router.use("/studentfeeservice",isAuthenticated, require("../api/StudentFeeService.js"));
    router.use("/studentservice", require("../api/StudentService.js"));
    router.use("/logbookservice",isAuthenticated, require("../api/LogbookService.js"));

    return router;
}

module.exports = configRouter;