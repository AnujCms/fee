const db = require('./db.js');
const UserEnum = require('../lookup/UserEnum');

exports.checkExamHeadBelongsToAccount = async function (userid, accountid) {
    let result = await db.query('select EXISTS (select 1 from teacher_principal where userid = ? and accountid = ?) as data', [userid, accountid]);
    if (result.length > 0 && result[0].data == 0) {
        return (new Error("This user is not belongs to Account."));
    } else
        return (result);
}
//get students for ExamhHead
exports.getStudentsForExamhead = async function (teacherid, classid) {
    let studentObj = await db.query('select * from userdetails u inner join entranceresult e on u.userid = e.studentid where userid IN(select studentid from student_teacher where teacherid = ?) and classid = ?', [teacherid, classid]);
    return studentObj;
}
//delete student By Exam Head
exports.deleteStudent = async function (studentid, userid) {
    await db.query('delete from userdetails where userid = ?', [studentid]);
    await db.query('delete from student_teacher where teacherid = ? and studentid = ?', [userid, studentid]);
    let result = await db.query('delete from entranceresult where studentid = ? and teacherid = ?', [studentid, userid]);

    return result.affectedRows;
}
//pramote students by Exam Head
exports.pramoteStudent = async function (userid, studentid, classid, session,accountid, section) {
    return db.transaction(async function (conn) {
    let classTeachList = await db.setQuery(conn, 'select userid from teacher_principal where accountid = ?', [accountid]);
    let teacherArray = []
    for(let i=0;i<classTeachList.length;i++){
        if(classTeachList[i].userid !== null){
            teacherArray.push(classTeachList[i].userid)
        }
    }
    let classTeacher = await db.setQuery(conn, `select userid from userdetails where classid = ? and section = ? and session = ? and userrole = ? and userid in(${teacherArray})`, [parseInt(classid), section, session, UserEnum.UserRoles.Teacher]);
    if(classTeacher.length>0){
        await db.setQuery(conn, 'update student_teacher set teacherid =  ? where teacherid = ? and studentid = ?', [classTeacher[0].userid, userid, studentid]);
        let result = await db.setQuery(conn, 'update userdetails set section = ?, session = ?, userrole = ? where userid = ?', [section, session, UserEnum.UserRoles.Student, studentid]);
        return result.affectedRows;
    }else{
        return 0
    }
});
}
//get entrance question based on selected class by Exam Head
exports.getClassForEntrance = async function (accountid, classid) {
    let result = await db.query('select * from entrancequestion where accountid = ? and class = ?', [accountid, classid]);
    return result;
}
//delete question by Exam Head
exports.deleteEntranceQuestion = async function (questionid, accountid) {
    let result = await db.query('CALL SQSP_DeleteEntranceQuestion(?,?)', [questionid, accountid]);
    return result.affectedRows;
}
//Save Student Details
exports.saveStusentEntrance = async function (student, userid) {
    return db.transaction(async function (conn) {
    let result = await db.setQuery(conn, 'CALL SQSP_CreateEntrance(?,?,?,?,?,?,?,?,?,?,?)',
        [student.fname,
        student.lname,
        student.cellnumber,
        student.username,
        student.password,
        student.adharnumber,
        student.dob,
        student.class,
        student.status,
        student.userrole,
        student.section
        ]);
    if (result[0][0].userid) {
        let student_teacherObj = {
            teacherid: userid,
            studentid: result[0][0].userid
        }
        let studentteacher = await db.setQuery(conn, 'insert into student_teacher set ?', [student_teacherObj]);
        await db.setQuery(conn, 'insert into entranceresult set ?', [student_teacherObj]);

        return studentteacher;
    }
    return result[0][0].userid;
})
}

//get question for edit
exports.getStudentForEdit = async function (teacherid, studentid) {
    let result = await db.query('select * from userdetails where userid = (select studentid from student_teacher where teacherid = ? and studentid = ?)', [teacherid, studentid]);
    return result;
}
//update the entrance student registrtation
exports.updateEntranceStudent = async function(studentObject, studentId, userId){
    let update = await db.query('update userdetails set  ?  where userid =(select studentid from student_teacher where teacherid = ? and studentid = ?)', [studentObject, userId, studentId]);
    return update
}
//update student userrrole
exports.updateEntranceUserrole = async function(studentId, userrole, userId){
    let update = await db.query('update userdetails set userrole = ?  where userid =(select studentid from student_teacher where teacherid = ? and studentid = ?)', [userrole, userId, studentId]);
    return update
}
//get question for edit
exports.getQuestionForEdit = async function (accountid, questionid) {
    let result = await db.query('CALL SQSP_GetQuestionForEdit(?,?)', [accountid, questionid]);
    return result[0];
}
//Update Question
exports.updateEntranceQuestion = async function (question) {
    let result = await db.query('CALL SQSP_UpdateEntranceQuestion(?,?,?,?,?,?,?,?,?,?,?)',
        [question.question,
        question.optiona,
        question.optionb,
        question.optionc,
        question.optiond,
        question.optione,
        question.answer,
        question.class,
        question.subject,
        question.accountid,
        question.questionid
        ]);
    return result.affectedRows;
}
//Save Entrance Question
exports.saveEntranceQuestion = async function (question) {
    let result = await db.query('CALL SQSP_CreateEntranceQuestion(?,?,?,?,?,?,?,?,?,?)',
        [question.question,
        question.optiona,
        question.optionb,
        question.optionc,
        question.optiond,
        question.optione,
        question.answer,
        question.class,
        question.subject,
        question.accountid
        ]);
    return result.affectedRows;
}
exports.getQuestionForEntrance = async function (userid, accountid) {
    var result = await db.query('select * from entrancequestion where class = (select classid from userdetails where userid = ?) and accountid = ? ', [userid, accountid]);
    return result;
}

//Save Entrance Result
exports.insertentranceresult = async function (entranceresult, userrole) {
    return db.transaction(async function (conn) {
    var teacherid = await db.setQuery(conn, 'select teacherid from student_teacher where studentid = ?',[entranceresult.studentid]);
    entranceresult.teacherid = teacherid[0].teacherid;
    var check = await db.setQuery(conn, 'select * from entranceresult where studentid = ? and teacherid = ?', [entranceresult.studentid, teacherid[0].teacherid]);
    if(check.length>0){
        var update = await db.setQuery(conn, 'update entranceresult set ? where studentid = ? and teacherid = ?', [entranceresult, entranceresult.studentid, teacherid[0].teacherid]);
        if(update.affectedRows){
            await db.setQuery(conn, 'update userdetails set userrole = ? where userid = ?', [userrole, entranceresult.studentid]);
        }
        return update.affectedRows;
    }else{
        var result = await db.setQuery(conn, 'CALL SQSP_CreateEntranceResult(?,?,?,?,?)',
        [entranceresult.studentid,
        entranceresult.teacherid,
        entranceresult.totalmarks,
        entranceresult.obtainedmarks,
        entranceresult.status
        ]);
        if(result.affectedRows){
            await db.setQuery(conn, 'update userdetails set userrole = ? where userid = ?', [userrole, entranceresult.studentid]);
        }
    return result.affectedRows;
    }
})
}
//get Entrance Completed Result
exports.getEntranceCompletedResult = async function (studentId) {
    let result = await db.query('select * from entranceresult where teacherid = (select teacherid from student_teacher where studentid = ?) and studentid = ?', [studentId, studentId]);
   if(result){
    return result;
   }else{
    return 0;
   }
}