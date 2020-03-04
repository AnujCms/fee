var db = require('./db.js');
var UserEnum = require('../lookup/UserEnum');

function checkAdminWithAccount(userid, accountid) {
    return db.query('SELECT EXISTS (SELECT 1 from account where accountAdmin = ? and accountid = ? ) as isAccountExist', [userid, accountid]).then(function (results) {
        if (results[0].isAccountExist != 1) {
            throw "Account id does not belong to this admin";
        } else {
            return results[0].isAccountExist;
        }
    });
}
exports.checkProviderByAccountID = async function (teacherid, accountid) {
    let facultyAccountId = await db.query('select accountid from teacher_principal where userid = ?',[teacherid])
   if(facultyAccountId.length>0){
    let result = facultyAccountId[0].accountid.localeCompare(accountid);
    if(result === 0){
        return true
    }else if(result === -1 || result === undefined){
        return false
    }
    else{
        return false
    }
}else{
    return false
}
}
exports.deleteUsers = async function (userid) {
    let users = await db.query('delete from userdetails where userrole = ? or userrole = ? and userid = ?',[UserEnum.UserRoles.ExamHead , UserEnum.UserRoles.FeeAccount, userid]);
    return users;
}
exports.unAssignedClass = async function (userid) {
    let users = await db.query('update userdetails set classid = ? , section = ? where userrole = ? and userid = ?',[0,0,UserEnum.UserRoles.Teacher , userid]);
    return users;
}
exports.deleteTeacher = async function (userid) {
    let teachers = await db.query('delete from userdetails where userrole = ? and userid = ? and classid not in(1,2,3,4,5,6,7)',[UserEnum.UserRoles.Teacher, userid]);
    return teachers;
}
exports.getAllProvidersByAccountId = async function (accountid, userid, callback) {
    let result = await checkAdminWithAccount(userid, accountid);
    if (result == 1) {
        let teachers = await db.query('SELECT d.userid, firstname, lastname, cellnumber, adharnumber, emailid, status, images, userrole, gender, classid, section, subject, qualification from userdetails d INNER JOIN teacher_principal da where d.userid = da.userid and accountid = ? and d.status = ?', [accountid, UserEnum.UserStatus.Active]);
        return teachers;
    } else {
        return [];
    }
}
//get all account
exports.getAllAccounts = async function (userid) {
    let result = await db.query('SELECT accountid, accountname from account where accountadmin = ?', [userid]);
    return result;
}

//get students for class teacher
exports.getAllStudentsByPrincipal = async function (teacherid) {
    return db.transaction(async function (conn) {
    let classData = await db.setQuery(conn, 'select classid, section, session from userdetails where userid = ?', teacherid);
    if (classData[0].classid) {
        let results = await db.setQuery(conn, 'CALL SQSP_GetPatientlist(?,?,?,?)', [classData[0].classid, classData[0].section, classData[0].session, parseInt(teacherid)]);
        return JSON.parse(JSON.stringify(results[0]));
    }else{
        return 0;
    }
})
}
//get config
exports.getConfigByAccountId = async function (accountid, userid) {
    let result = await checkAdminWithAccount(userid, accountid);
    if (result == 1) {
        let configData = await db.query('select configdata from config where configid = (select configid from account where accountid = ?)', [accountid]);
        return configData;
    } else {
        return [];
    }
}
//create teacher by principal
exports.createTeacher = async function (teacherObj, userid, accountid) {
    return db.transaction(async function (conn) {
        let result = await checkAdminWithAccount(userid, accountid);
        if (result == 1) {
            var r = await db.setQuery(conn, 'CALL SQSP_CreateTeacher(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [teacherObj.firstname,
        teacherObj.lastname,
        teacherObj.emailid,
        teacherObj.username,
        teacherObj.password,
        teacherObj.cellnumber,
        teacherObj.dob,
        teacherObj.gender,
        teacherObj.userrole,
        teacherObj.adharnumber,
        teacherObj.qualification,
        teacherObj.subject,
        teacherObj.localaddress,
        teacherObj.parmanentaddress,
        teacherObj.session,
        teacherObj.status,
        teacherObj.images,
        teacherObj.classid,
        teacherObj.section
        ]);
            let loopUpEntry = { "accountid": accountid, "userid": r[0][0].userid };
            let results = await db.setQuery(conn, 'INSERT INTO teacher_principal SET ?', loopUpEntry);
            return results.affectedRows;
        } else {
            return 0;
        }
    })
}
//update teacher details
exports.updateTeacherDetails = async function (userid, teacherObj) {
    let results = await db.query('update userdetails set ? where userid = ?', [teacherObj, userid]);
    return results.affectedRows;
}
//get teacher details for update by principal
exports.getTeacherDetailForUpdate = async function (teacherid) {
    let result = await db.query('select userid, firstname, lastname, cellnumber, adharnumber, images,emailid, status, userrole, gender, classid, subject, qualification, dob, parmanentaddress, localaddress from userdetails where userid = ?', [teacherid]);
    return result;
}
//get assigned class
exports.getAssignedClass = async function (userid) {
    let results = await db.query('select classid, section from userdetails where userid = ?', [userid]);
    return results;
}
//Assign class to teacher
exports.assignClassToTeacher = async function (teacherid, classObject) {
    let result = await db.query('update userdetails set ? where userid = ?', [classObject, teacherid]);
    return result.affectedRows
}
//get subjects by selected class
exports.getSubjectForClass = async function (userid, classes) {
    let results = await db.query('select * from subjects where userid = ? and class = ?', [userid, classes]);
    if(results){
        return results
    }else{
        return 0
    }
}
//assign subjects to selected class
exports.assignSubjectToClass = async function (subjectObject) {
    return db.transaction(async function (conn) {
        let r = await db.query('select * from subjects where userid = ? and class = ?', [subjectObject.userid, subjectObject.class]);
        let result
        if(r.length>0){
        result = await db.setQuery(conn, 'update subjects set subjects = ? where userid = ? and class = ?', [subjectObject.subjects, subjectObject.userid, subjectObject.class]);
        }else{
            result = await db.setQuery(conn, 'insert into subjects set ? ', [subjectObject]);
        }
        return result.affectedRows
    })
}
//get Principal Details
exports.getPrincipalDetails = async (userid) => {
    var result = await db.query('select * from userdetails where userid=?', [userid])
    return result
}