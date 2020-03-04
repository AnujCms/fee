const router = require('express').Router();
const TimeTableDB = require("../database/TimeTableDB.js");
const UserEnum = require('../lookup/UserEnum');

const isPrincipal = function (req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Principal) {
        return next();
    } else {
        return res.status(200).json({ status: 0, statusDescription: "Unauthenticted user." });
    }
}
const isPrincipalOrTeacherOrStudent = function(req, res, next){
    if (req.user.role === UserEnum.UserRoles.Principal || req.user.role === UserEnum.UserRoles.Teacher || req.user.role === UserEnum.UserRoles.Student || req.user.role === UserEnum.UserRoles.FeeAccount || req.user.role === UserEnum.UserRoles.ExamHead) {
        return next();
    } else {
        return res.status(200).json({ status: 0, statusDescription: "Unauthenticted user." });
    }
}
//get subjects of selected class
router.get("/getsubjectofselectedclass/:classid", isPrincipal, async function (req, res) {
    let results = await TimeTableDB.getSubjectsOfSelectedClass(req.params.classid, req.user.userid);
    if(results.length>0){
        res.status(200).json({status:1, statusDescription:JSON.parse(results[0].subjects)});
    }else{
        res.status(200).json({status:0, statusDescription:"Not able to get subjects."});
    }
})

//get teachers of selected subjects
router.get("/getsubjectteachers/:subjectid", isPrincipal, async function (req, res) {
    let results = await TimeTableDB.getTeachersOfSelectedSubject(req.params.subjectid, UserEnum.UserRoles.Teacher, req.user.accountid, req.user.userid);
    if(results.length>0){
        res.status(200).json({status:1, statusDescription:results});
    }else{
        res.status(200).json({status:0, statusDescription:"Not able to get teacher."});
    }
})

//create periods
router.post("/createperiods", isPrincipal, async function (req, res) {
    let periodObject;
    switch (req.body.periodId) {
        case 1: periodObject = { period1: JSON.stringify([{periodId:req.body.periodId, periodStartTime:req.body.periodStartTime , periodEndTime: req.body.periodEndTime}])}
            break;
        case 2: periodObject = { period2: JSON.stringify([{periodId:req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime }])};
            break;
        case 3: periodObject = { period3: JSON.stringify([{periodId:req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime }])};
            break;
        case 4: periodObject = { period4:JSON.stringify([{periodId: req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime }])};
            break;
        case 5: periodObject = { period5:JSON.stringify([{periodId: req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime}]) };
            break;
        case 6: periodObject = { period6:JSON.stringify([{periodId: req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime}]) };
            break;
        case 7: periodObject = { period7:JSON.stringify([{periodId: req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime}]) };
            break;
        case 8: periodObject = { period8:JSON.stringify([{periodId: req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime}]) };
            break;
        case 9: periodObject = { period9:JSON.stringify([{periodId: req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime}]) };
            break;
        case 10: periodObject = { period10:JSON.stringify([{periodId: req.body.periodId, periodStartTime: req.body.periodStartTime, periodEndTime: req.body.periodEndTime}]) };
            break;
        default:
            break;
    }
    periodObject.userid = req.user.userid;
    periodObject.accountid = req.user.accountid;
    periodObject.session = JSON.parse(req.user.configdata).session;

    let results = await TimeTableDB.createPeriods(periodObject);
    if(results){
        res.status(200).json({status:1, statusDescription:"Period has been submitted successfully."});
    }else{
        res.status(200).json({status:0, statusDescription:"Not able to save period details."});
    }
})


//get periods details
router.get("/getperiodsdetails", isPrincipalOrTeacherOrStudent, async function (req, res) {
    let results = await TimeTableDB.getPeriodsDetails(req.user.accountid, JSON.parse(req.user.configdata).session);
    if(results.length>0){
        res.status(200).json({status:1, statusDescription:results});
    }else{
        res.status(200).json({status:0, statusDescription:"Not able to get teacher."});
    }
})

//create timeTAble
router.post("/savetimetable", isPrincipal, async function (req, res) {
    let timeTableObject;
    switch (req.body.periodId) {
        case 1: timeTableObject = { period1: JSON.stringify([{periodId:req.body.periodId, dayName:req.body.dayName , subjectName: req.body.subjectName, teacherName: req.body.teacherName}])}
            break;
        case 2: timeTableObject = { period2: JSON.stringify([{periodId:req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName }])};
            break;
        case 3: timeTableObject = { period3: JSON.stringify([{periodId:req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName}])};
            break;
        case 4: timeTableObject = { period4:JSON.stringify([{periodId: req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName }])};
            break;
        case 5: timeTableObject = { period5:JSON.stringify([{periodId: req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName}]) };
            break;
        case 6: timeTableObject = { period6:JSON.stringify([{periodId: req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName}]) };
            break;
        case 7: timeTableObject = { period7:JSON.stringify([{periodId: req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName}]) };
            break;
        case 8: timeTableObject = { period8:JSON.stringify([{periodId: req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName}]) };
            break;
        case 9: timeTableObject = { period9:JSON.stringify([{periodId: req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName}]) };
            break;
        case 10: timeTableObject = { period10:JSON.stringify([{periodId: req.body.periodId, dayName: req.body.dayName, subjectName: req.body.subjectName, teacherName: req.body.teacherName}]) };
            break;
        default:
            break;
    }
    timeTableObject.accountid = req.user.accountid;
    timeTableObject.userid = req.user.userid;
    timeTableObject.class = req.body.class;
    timeTableObject.section = req.body.section;
    timeTableObject.dayname = req.body.dayname;
    timeTableObject.session = JSON.parse(req.user.configdata).session;

    let results = await TimeTableDB.createTimeTable(timeTableObject);
    if(results){
        res.status(200).json({status:1, statusDescription:"TimeTable has been submitted successfully."});
    }else{
        res.status(200).json({status:0, statusDescription:"Not able to save period details."});
    }
})

//get full timetable by principal
router.get("/getfulltimetable/:classid/:section", isPrincipalOrTeacherOrStudent, async function (req, res) {
    let results = await TimeTableDB.getFullTimeTable(req.user.accountid, JSON.parse(req.user.configdata).session, req.params.classid, req.params.section);
    if(results.length>0){
        res.status(200).json({status:1, statusDescription:results});
    }else{
        res.status(200).json({status:0, statusDescription:"Not able to get time table data."});
    }
})
module.exports = router;