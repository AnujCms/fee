const router = require('express').Router();
const logbookDB = require("../database/LogbookDB");
const UserEnum = require('../lookup/UserEnum');

function isProviderOrCoWorkerOrAdminOrSuperAdmin(req, res, next) {
    if (req.user.role == UserEnum.UserRoles.FeeAccount || req.user.role === UserEnum.UserRoles.Teacher || req.user.role === UserEnum.UserRoles.Student || req.user.role === UserEnum.UserRoles.ExamHead || req.user.role === UserEnum.UserRoles.Principal || req.user.role === UserEnum.UserRoles.SuperAdmin) {
        next();
    } else {
        return res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
    }
}

//get assign subjects
router.get("/:studentid/assignsubjects", isProviderOrCoWorkerOrAdminOrSuperAdmin, async function (req, res) {
    let result = await logbookDB.getAssignSubjectToClass(req.params.studentid, req.user.accountid);
    if (result.length > 0) {
        res.status(200).json({ status: 1, statusDescription: JSON.parse(result[0].subjects) });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the subjetcs' })
    }
})
//get Student Result
router.get("/:studentid/:teacherid/:examtype/:subjectArray/getresult", isProviderOrCoWorkerOrAdminOrSuperAdmin, async function (req, res) {
    let result = await logbookDB.getStudentResult(req.params.studentid, (req.params.teacherid || req.user.userid), req.params.examtype, req.params.subjectArray,JSON.parse(req.user.configdata).session);
    if (result.length > 0) {
        res.status(200).json({ status: 1, statusDescription: result[0] });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Student result is not recorded.' });
    }
})
//get Student Attendance by class teacher
router.get("/:studentid/:teacherid/studentattendance", isProviderOrCoWorkerOrAdminOrSuperAdmin, async function (req, res) {
    let attendance = await logbookDB.getStudentsAttendances(req.params.teacherid, req.params.studentid,JSON.parse(req.user.configdata).session);
    if (attendance.length > 0) {
        let attendanceObj = {
            studentid: attendance[0].studentid,
            january: attendance[0].january,
            jtd: attendance[0].jtd,
            jpd: attendance[0].jpd,
            february: attendance[0].february,
            ftd: attendance[0].ftd,
            fpd: attendance[0].fpd,
            march: attendance[0].march,
            mtd: attendance[0].mtd,
            mpd: attendance[0].mpd,
            april: attendance[0].april,
            atd: attendance[0].atd,
            apd: attendance[0].apd,
            may: attendance[0].may,
            matd: attendance[0].matd,
            mapd: attendance[0].mapd,
            june: attendance[0].june,
            juntd: attendance[0].juntd,
            junpd: attendance[0].junpd,
            july: attendance[0].july,
            jultd: attendance[0].jultd,
            julpd: attendance[0].julpd,
            august: attendance[0].august,
            autd: attendance[0].autd,
            aupd: attendance[0].aupd,
            september: attendance[0].september,
            std: attendance[0].std,
            spd: attendance[0].spd,
            october: attendance[0].october,
            otd: attendance[0].otd,
            opd: attendance[0].opd,
            november: attendance[0].november,
            ntd: attendance[0].ntd,
            npd: attendance[0].npd,
            december: attendance[0].december,
            dtd: attendance[0].dtd,
            dpd: attendance[0].dpd
        };
        res.status(200).json({ status: 1, attendance: attendanceObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Student attendance is not recorded." });

    }
})
//get Student Result For Graph
router.get("/:studentid/:teacherid/:examtype/:subjectArray/getresultforgraph", isProviderOrCoWorkerOrAdminOrSuperAdmin, async function (req, res) {
    let result = await logbookDB.getStudentResult(req.params.studentid, req.params.teacherid, req.params.examtype, req.params.subjectArray, JSON.parse(req.user.configdata).session);
    if (result.length > 0) {
        res.status(200).json({ status: 1, result: result[0] });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Student result is not recorded." });
    }
})
//get student attendance for graph
router.get("/:studentid/:teacherid/studentattendanceforgraph", isProviderOrCoWorkerOrAdminOrSuperAdmin, async function (req, res) {
    let result = await logbookDB.getStudentsAttendances(req.params.teacherid, req.params.studentid,JSON.parse(req.user.configdata).session);
    var attendanceObj = [];
    if (result.length > 0) {
        attendanceObj.push(
            ["January", parseInt(result[0].jpd)],
            ["February", parseInt(result[0].fpd)],
            ["March", parseInt(result[0].mpd)],
            ["April", parseInt(result[0].apd)],
            ["May", parseInt(result[0].mapd)],
            ["June", parseInt(result[0].junpd)],
            ["July", parseInt(result[0].julpd)],
            ["August", parseInt(result[0].aupd)],
            ["September", parseInt(result[0].spd)],
            ["October", parseInt(result[0].opd)],
            ["November", parseInt(result[0].npd)],
            ["December", parseInt(result[0].dpd)],
        )
        res.status(200).json({ status: 1, attendance: attendanceObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Student attendance is not recorded."});
    }
})
module.exports = router;