var db = require('./db.js');
var UserEnum = require('../lookup/UserEnum');

//student login (Delete)
exports.studentLogin = async function (student) {
    let rows = await db.query('select * from student where username = ? and password = ? and status = ?', [student.username, student.password, student.status]);
    return rows;
};
//get student details
exports.getStudentDetails = async function (studentid) {
    var result = await db.query('CALL SQSP_GetStudentdetails(?)', [studentid]);
    return result[0];
}
//get teacherid by student
exports.getTeacheridByStudent = async function (studentid) {
    var result = await db.query('select teacherid from student_teacher where studentid = ?', [studentid]);
    return result;
}
//get Student fee details
exports.getFeeDetailOfStudent = async function (adharnumber, session, accountid) {
    return db.transaction(async function (conn) {
        let studentData = await db.setQuery(conn, 'select * from userdetails where adharnumber = ? and session = ?', [adharnumber, session]);
        let feeStructure = await db.setQuery(conn, 'select * from feestructure where class = ? and accountid = ? and session = ?', [studentData[0].classid, accountid, session])
        let results = await db.setQuery(conn, 'select * from studentfee where adharnumber = ? and session = ?', [adharnumber, session]);
        let feeData = {
            student: studentData,
            feeStructure: feeStructure,
            feeDetails: results
        }
        return feeData;
    });
}
//get Student Result For Student
exports.getAttendancesForStudent = async function (teacherid, studentid, session) {
    var results = await db.query('CALL SQSP_Attendances(?,?,?)', [teacherid, studentid, session]);
    return results[0];
}
//get Student Result for Student
exports.getStudentResultForStudent = async function (teacherid, studentid) {
    return db.transaction(async function (conn) {
    let result = await db.setQuery(conn, 'select * from config where configid = (select configid from account where accountid = (select accountid from teacher_principal where userid = ?))', [teacherid]);
    let session = JSON.parse(result[0].configdata).session.value;
    var results = await db.setQuery(conn, 'CALL SQSP_GetResults(?,?,?)', [teacherid, studentid, session]);
    return results[0];
    })
}
//Assign subject to Teacher for student
exports.getAssignSubjectForStudent = async function (classid) {
    let result = await db.query('select * from subjects where class = ?', [classid]);
    return result
}

//Update student details
exports.updateStudentImage = async (img, studentid) => {
    console.log("hit",studentid,img)
    var result = await db.query('update userdetails set images = ? where userid = ?', [img, studentid])
    return result
}

//check student password
exports.checkpassword = async (studentid) => {
    var result = await db.query('select password from userdetails where userid = ?', [studentid])
    return result[0]
}
//change  student password
exports.changePassword = async (password, studentid) => {
    var result = await db.query('update userdetails set password = ? where userid = ?', [password, studentid])
    return result
}