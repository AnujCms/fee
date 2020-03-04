var db = require('./db.js');

//get subjets of selected class
exports.getSubjectsOfSelectedClass = async function (classid, userid) {
    let result = await db.query('select subjects from subjects where class = ? and userid = ?', [classid, userid]);
    return result;
}

//get teachers of selected subjects
exports.getTeachersOfSelectedSubject = async function (subjectid, userrole, accountid) {
    let result = await db.query('select userid, firstname, lastname from userdetails where userrole = ? and subject = ? and userid in(select userid from teacher_principal where accountid = ?)', [userrole , subjectid, accountid]);
    return result;
}

//create periods
exports.createPeriods = async function (periodObject) {
    return db.transaction(async function (conn) {
        let Result = await db.setQuery(conn, 'select accountid, userid, session from periods where accountid = ? and userid=? and session=? ORDER BY modifieddate LIMIT 3', [periodObject.accountid, periodObject.userid, periodObject.session]);
        if (Result.length > 0) {
            let result1 = await db.setQuery(conn, 'update periods set ? where accountid = ? and userid = ? and session = ?', [periodObject, periodObject.accountid, periodObject.userid, periodObject.session]);
            return result1.affectedRows;
        } else {
            let result = await db.setQuery(conn, 'insert into periods set ?', periodObject);
            return result.affectedRows;
        }
    })
}

//get periods details
exports.getPeriodsDetails = async function (accountid, session) {
    let result = await db.query('select * from periods where accountid = ? and session = ?', [accountid, session]);
    return result;
}

//createTimeTable
exports.createTimeTable = async function (timeTableObject) {
    return db.transaction(async function (conn) {
        let Result = await db.setQuery(conn, 'select accountid, userid, class, section, session from timetable where accountid = ? and userid = ? and class = ? and section = ? and session = ? and dayname = ? ORDER BY modifieddate LIMIT 3', [timeTableObject.accountid, timeTableObject.userid, timeTableObject.class, timeTableObject.section, timeTableObject.session, timeTableObject.dayname]);
        if (Result.length > 0) {
            let result1 = await db.setQuery(conn, 'update timetable set ? where accountid = ? and userid = ? and class = ? and section = ? and session = ? and dayname = ?', [timeTableObject, timeTableObject.accountid, timeTableObject.userid, timeTableObject.class, timeTableObject.section, timeTableObject.session, timeTableObject.dayname]);
            return result1.affectedRows;
        } else {
            let result = await db.setQuery(conn, 'insert into timetable set ?', timeTableObject);
            return result.affectedRows;
        }
    })
}

//get full timetable by Principal
exports.getFullTimeTable = async function (accountid, session, classid, section) {
    let result = await db.query('select * from timetable where accountid = ? and session = ? and class = ? and section = ?', [accountid, session, classid, section]);
    return result;
}