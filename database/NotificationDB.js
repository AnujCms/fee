const db = require('./db.js');
var UserEnum = require('../lookup/UserEnum');

//save school Notification
exports.saveSchoolNotification = async function (notificationsObject) {
    let Result = await db.query('insert into schoolnotifications set ?', [notificationsObject]);
    return Result;
}
//get school Notification for update
exports.getSchoolNotificationsById = async function(notificationid, userid, accountid, session){
    let Result = await db.query('select * from schoolnotifications where notificationid = ? and userid = ? and accountid = ? and session = ?',[notificationid, userid, accountid, session]);
    return Result;
}
//update school Notification
exports.updateSchoolNotification = async function (notificationsObject, notificationid, session) {
    let Result = await db.query('update schoolnotifications set ? where accountid = ? and userid = ? and notificationid = ? and session = ?', [notificationsObject, notificationsObject.accountid, notificationsObject.userid, notificationid, session]);
    return Result;
}
//get school Notification
exports.getSchoolNotifications = async function(userid, accountid, session){
    let Result = await db.query('select * from schoolnotifications where userid = ? and accountid =? and session = ?',[userid, accountid, session]);
    return Result;
}
//get school Notification for student 
exports.getSchoolNotificationsForStudents = async function(accountid, userrole, session, studentid){
    let Result = await db.query('select * from schoolnotifications where accountid = ? and notificationuser = ? || notificationuser = ? and session = ? || userid = (select teacherid from student_teacher where studentid = ?)',[accountid, userrole, 10, session, studentid]);
    return Result;
}
//get school Notification for Teacher 
exports.getSchoolNotificationsForTeacher = async function(accountid, userrole, session, teacherid){
    let Result = await db.query('select * from schoolnotifications where accountid = ? and notificationuser = ? || notificationuser = ? and session = ? || userid = ?',[accountid, userrole, 10, session, teacherid]);
    return Result;
}
//get school Notification for users 
exports.getSchoolNotificationsForUser = async function(accountid, userrole, session){
    let Result = await db.query('select * from schoolnotifications where accountid = ? and notificationuser = ? || notificationuser = ? and session = ?',[accountid, userrole, 10, session]);
    return Result;
}
//delete school Notification
exports.deleteSchoolEvents = async function(userid, accountid, notificationid){
    let Result = await db.query('delete from schoolnotifications where userid = ? and accountid = ? and notificationid = ?',[userid, accountid, notificationid]);
    return Result;
}