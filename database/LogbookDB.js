var db = require('./db.js');

//Assign subject to Teacher
exports.getAssignSubjectToClass = async function (studentid, accountid) {
    let result = await db.query('select subjects from subjects where class = (select classid from userdetails where userid = ?) and userid = (select accountAdmin from account where accountid = ?)',[studentid, accountid])
    return result
}
//get Student Result For Teacher
exports.getStudentResult = async function (studentid, teacherid, examtype, subjectArray,session) {
    let results = await db.query(`select ${subjectArray} from studentresult where  teacherid = ? and studentid = ? and session = ? and examinationtype = ?`, [teacherid, studentid, session, examtype]);
    if(results){
        return results;
    }else{
        return 0;
    }
}
//get Student Result For Teacher
exports.getStudentsAttendances = async function (teacherid, studentid, session) {
    let results = await db.query('CALL SQSP_Attendances(?,?,?)', [teacherid,studentid, session]);
    if(results[0]){
        return results[0];
    }else{
        return 0;
    }
}

