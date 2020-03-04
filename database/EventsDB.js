const db = require('./db.js');
var UserEnum = require('../lookup/UserEnum');

//save school events
exports.saveSchoolEvent = async function (eventsObjects) {
    let Result = await db.query('insert into schoolevents set ?', [eventsObjects]);
    return Result;
}
//get school events for update
exports.getSchoolEventsById = async function(eventid, accountid, userid, session){
    let Result = await db.query('select * from schoolevents where eventid = ? and accountid = ? and userid = ? and session = ?',[eventid, accountid, userid, session]);
    return Result;
}
//update school events
exports.updateSchoolEvent = async function (eventsObjects, eventid, session) {
    let Result = await db.query('update schoolevents set ? where accountid = ? and userid = ? and eventid = ? and session = ?', [eventsObjects, eventsObjects.accountid, eventsObjects.userid, eventid, session]);
    return Result;
}
//get school events
exports.getSchoolEvents = async function(userid, accountid, session){
    let Result = await db.query('select * from schoolevents where userid = ? and accountid = ? and session = ?',[userid, accountid, session]);
    return Result;
}
//get school events for student
exports.getSchoolEventsForStudent = async function(accountid){
    let Result = await db.query('select * from schoolevents where accountid =?',[accountid]);
    return Result;
}
//delete school events
exports.deleteSchoolEvents = async function(userid, accountid, eventid, session){
    let Result = await db.query('delete from schoolevents where userid = ? and accountid = ? and eventid = ? and session = ?',[userid, accountid, eventid, session]);
    return Result;
}