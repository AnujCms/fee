const router = require('express').Router();
const notificationDB = require("../database/NotificationDB.js");
const UserEnum = require('../lookup/UserEnum');

const isPrincipal = function (req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Principal || req.user.role === UserEnum.UserRoles.Teacher) {
        return next();
    } else {
        return res.status(200).json({ status: 0, statusDescription: "Unauthenticted user." });
    }
}
const isStudentOrTeacheroraccounttantOrExamHead = function (req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Student || req.user.role === UserEnum.UserRoles.Teacher || req.user.role === UserEnum.UserRoles.ExamHead || req.user.role === UserEnum.UserRoles.FeeAccount) {
        return next();
    } else {
        return res.status(200).json({ status: 0, statusDescription: "Unauthenticted user." });
    }
}
//save school Notification
router.post("/notificationRegistration", isPrincipal, async function (req, res) {
    let notificationsObject = {
        accountid: req.user.accountid,
        userid: req.user.userid,
        createdby:req.user.role,
        session:JSON.parse(req.user.configdata).session,
        notificationuser: req.body.notificationuser,
        notificationsubject: req.body.notificationsubject,
        notificationcreateddate: req.body.notificationcreateddate,
        notificationdescription: req.body.notificationdescription
    }
    let result = await notificationDB.saveSchoolNotification(notificationsObject);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Notification has been created successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Notification not created.' });
    }
});

//get Notification by event id
router.get("/getnotificationtbyid/:notificationid", isPrincipal, async function (req, res) {
let notificationData = await notificationDB.getSchoolNotificationsById(req.params.notificationid, req.user.userid, req.user.accountid, JSON.parse(req.user.configdata).session);
if(notificationData.length>0){
    res.status(200).json({ status: 1, statusDescription: notificationData });
}else{
    res.status(200).json({ status: 0, statusDescription: 'Not able to get the notifications details' });
}
})
//update school Notification
router.put("/updatenotifications/:notificationid", isPrincipal, async function (req, res) {
    let notificationsObject = {
        accountid: req.user.accountid,
        userid: req.user.userid,
        notificationuser: req.body.notificationuser,
        notificationsubject: req.body.notificationsubject,
        notificationcreateddate: req.body.notificationcreateddate,
        notificationdescription: req.body.notificationdescription
    }
    let result = await notificationDB.updateSchoolNotification(notificationsObject,req.params.notificationid, JSON.parse(req.user.configdata).session);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Notification has been updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Notification not created.' });
    }
});
//get school Notifications
router.get("/getschoolnotifications", isPrincipal, async function (req, res) {
    let notificationData = await notificationDB.getSchoolNotifications(req.user.userid, req.user.accountid, JSON.parse(req.user.configdata).session);
    if(notificationData.length>0){
        res.status(200).json({ status: 1, statusDescription: notificationData });
    }else{
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the notifications details' });
    }
    })

//get school Notifications for student
router.get("/getschoolnotificationsbyuserrole", isStudentOrTeacheroraccounttantOrExamHead, async function (req, res) {
    let notificationData = '';
    if(req.user.role === 2){
        notificationData = await notificationDB.getSchoolNotificationsForStudents(req.user.accountid, req.user.role, JSON.parse(req.user.configdata).session, req.user.userid);
    }else if(req.user.role === 3){
        notificationData = await notificationDB.getSchoolNotificationsForTeacher(req.user.accountid, req.user.role, JSON.parse(req.user.configdata).session, req.user.userid);
    }else{
        notificationData = await notificationDB.getSchoolNotificationsForUser(req.user.accountid, req.user.role, JSON.parse(req.user.configdata).session);
    }
    if(notificationData.length>0){
        res.status(200).json({ status: 1, statusDescription: notificationData });
    }else{
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the notifications details' });
    }
    })
//delete school Notification 
router.delete("/deletenotifications/:notificationid", isPrincipal, async function (req, res) {
    let notificationData = await notificationDB.deleteSchoolEvents(req.user.userid, req.user.accountid, req.params.notificationid);
    if(notificationData.affectedRows){
        res.status(200).json({ status: 1, statusDescription: "Selected notification has been deleted successfully" });
    }else{
        res.status(200).json({ status: 0, statusDescription: 'Not able to delete notification.' });
    }
    })

module.exports = router;