var db = require('./db.js');

exports.checkTeacherStudentRelation = async function (studentid, accountid) {
    console.log(studentid, accountid)
    let studentAccountId = await db.query('select accountid from teacher_principal where userid = (select teacherid from student_teacher where studentid = ?)', [studentid])
    console.log('studentAccountId', studentAccountId)
    let result = studentAccountId[0].accountid.localeCompare(accountid);
    console.log(result)
    if (result === 0) {
        return true
    } else if (result === -1 || result === undefined) {
        return false
    }
    else {
        return false
    }
}
exports.checkAddhar = async function (adharnumber) {
    let result = await db.query('select adharnumber from userdetails where adharnumber = ?', adharnumber);
    if (result.length > 0) {
        return result
    } else {
        return 0
    }
}
exports.checkEmailId = async function (emailid) {
    let result = await db.query('select emailid from userdetails where emailid = ?', emailid);
    if (result.length > 0) {
        return result
    } else {
        return 0
    }
}
exports.checkProviderByAccountID = async function (userid, accountid) {
    let result = await db.query('select EXISTS (select 1 from teacher_principal where userid = ? and accountid = ?) as data', [userid, accountid]);
    if (result.length > 0 && result[0].data == 0) {
        return (new Error("there is no provider linked to this account"));
    } else
        return (result);
}
//get config details by Admin
exports.getconfigdetailsByPrincipal = async function (userid) {
    let configData = await db.query('select configdata from config where configid = (select configid from account where accountAdmin = ?)', [userid]);
    return configData;
}

//get config details
exports.getconfigdetailsByAllUsers = async function (userid) {
    let configData = await db.query('select configdata from config where configid = (select configid from account where accountid = (select accountid from teacher_principal where userid = ?))', [userid]);
    return configData;
}
//get config details by Student
exports.getconfigdetailsByStudent = async function (userid) {
    let configData = await db.query('select configdata from config where configid = (select configid from account where accountid = (select accountid from teacher_principal where userid = (select teacherid from student where studentid=?)))', [userid]);
    return configData;
}
//get students for class teacher
exports.getAllStudents = async function (teacherid, status, session) {
    return db.transaction(async function (conn) {
        let classData = await db.setQuery(conn, 'select classid, section from userdetails where userid = ?', teacherid);
        if (classData[0].classid) {
            var results = await db.setQuery(conn, 'select * from userdetails where classid = ? and section = ? and session = ? and status = ?  and userid IN(select studentid from student_teacher where teacherid = ?)', [classData[0].classid, classData[0].section, session, status, teacherid]);
            return results;
        } else {
            return 0;
        }
    })
}
//get inactivated students for class teacher
exports.getAllInactivatedStudents = async function (teacherid, status, session) {
    return db.transaction(async function (conn) {
        let classData = await db.setQuery(conn, 'select classid, section from userdetails where userid = ?', teacherid);
        if (classData[0].classid) {
            var results = await db.setQuery(conn, 'select * from userdetails where classid = ? and section = ? and session = ? and status = ?  and userid IN(select studentid from student_teacher where teacherid = ?)', [classData[0].classid, classData[0].section, session, status, teacherid]);
            return results;
        } else {
            return 0;
        }
    })
}
//Save Studwent Details
exports.saveStusentDetails = async function (student, userid, accountid) {
    return db.transaction(async function (conn) {
        let classData = await db.setQuery(conn, 'select classid, section, session from userdetails where userid = ?', userid);
        if (classData[0].classid) {
            var result = await db.setQuery(conn, 'CALL SQSP_CreatePrescription(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [student.firstname,
                student.lastname,
                student.mothername,
                student.fathername,
                student.cellnumber,
                student.username,
                student.password,
                student.userrole,
                student.dob,
                student.adharnumber,
                student.gender,
                student.religion,
                student.category,
                student.locality,
                student.localaddress,
                student.parmanentaddress,
                classData[0].classid,
                classData[0].section,
                student.session,
                student.status,
                student.images
                ]);
            let attendanceObj = {
                accountid: accountid,
                teacherid: userid,
                studentid: result[0][0].userid,
                classid: classData[0].classid,
                section: classData[0].section,
                session: student.session
            }
            await db.setQuery(conn, 'insert into monthlyattendance set ?', [attendanceObj]);

            let studentFeeObj = {
                adharnumber: student.adharnumber,
                session: student.session
            }

            await db.setQuery(conn, 'insert into studentfee set ?', [studentFeeObj]);
            if (result[0][0].userid) {
                let student_teacherObj = {
                    teacherid: userid,
                    studentid: result[0][0].userid
                }
                let studentteacher = await db.setQuery(conn, 'insert into student_teacher set ?', [student_teacherObj]);
                return studentteacher.affectedRows;
            }
            return result[0][0].userid;
        } else {
            return 0
        }
    })

}
//Update Student Details
exports.updateStusentRecord = async function (student) {
    return db.transaction(async function (conn) {
        let classData = await db.setQuery(conn, 'select classid, section, session from userdetails where userid = ?', student.userid);
        if (classData[0].classid) {
            var result = await db.setQuery(conn, 'CALL CSP_UpdateStudentData(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [student.studentid,
                student.firstname,
                student.lastname,
                student.mothername,
                student.fathername,
                student.cellnumber,
                student.dob,
                student.gender,
                student.religion,
                student.category,
                student.locality,
                student.localaddress,
                student.parmanentaddress,
                student.userid,
                classData[0].classid,
                classData[0].section,
                classData[0].session,
                student.images
                ]);
            return result.affectedRows;
        } else {
            return 0;
        }
    })
}
//get student details for update
exports.getStudentDetails = async function (studentid, teacherid, session) {
    return db.transaction(async function (conn) {
        let classData = await db.setQuery(conn, 'select classid, section from userdetails where userid = ?', teacherid);
        if (classData[0].classid) {
            var results = await db.setQuery(conn, 'select * from userdetails where classid = ? and section = ? and session = ? and userid = ?', [classData[0].classid, classData[0].section, session, studentid]);
            return results;
        } else {
            return 0;
        }
    })
}
//Assign subject to Teacher
exports.getAssignSubjectToClass = async function (userid, accountid) {
    let result = await db.query('select * from subjects where class = (select classid from userdetails where userid = ?) and userid = (select accountAdmin from account where accountid = ?)', [userid, accountid]);
    return result
}
//fill Student Result
exports.saveStusentResult = async function (results, session) {
    return db.transaction(async function (conn) {
        let Result = await db.setQuery(conn, 'select studentid, teacherid, session, examinationtype from studentresult where studentid = ? and teacherid=? and examinationtype=? and session=? ORDER BY modifieddate LIMIT 3', [results.studentid, results.teacherid, results.examinationtype, session]);
        if (Result.length > 0) {
            let result1 = await db.setQuery(conn, 'update studentresult set ? where studentid = ? and teacherid = ? and session = ? and examinationtype = ?', [results, results.studentid, results.teacherid, session, results.examinationtype]);
            return result1.affectedRows;
        } else {
            results.session = session;
            let result = await db.setQuery(conn, 'insert into studentresult set ?', results);
            return result.affectedRows;
        }
    })
}
//fill Student Attendance
exports.saveStusentAttendance = async function (results, session) {
    return db.transaction(async function (conn) {
        let Result = await db.setQuery(conn, 'select studentid, teacherid, session from attendance where studentid = ? and teacherid=? and session = ?', [results.studentid, results.teacherid, session]);
        if (Result.length > 0) {
            let result1 = await db.setQuery(conn, 'update attendance set ? where studentid = ? and teacherid = ? and session = ?', [results, results.studentid, results.teacherid, session]);
            return result1.affectedRows;
        } else {
            results.session = session;
            let result = await db.setQuery(conn, 'insert into attendance set ?', results);
            return result.affectedRows;
        }
    })
}
//get Student fee details for Teacher
exports.getFeeDetailsForTeacher = function (userid, session, accountid) {
    return db.transaction(async function (conn) {
        var student = await db.setQuery(conn, 'select adharnumber, classid from userdetails where userid IN(select studentid from student_teacher where teacherid = ?) and session = ?', [userid, session]);
        if (student.length > 0) {
            var adharArray = [];
            var classid = student[0].classid
            student.forEach((row) => {
                adharArray.push(row.adharnumber)
            })
            let sumFeeDetails = await db.setQuery(conn, `select * from feestructure where accountid = ? and class = ? and session = ?`, [accountid, classid, session]);
            let results = await db.setQuery(conn, `select * from studentfee where adharnumber IN(${adharArray}) and session = ?`, [session]);
            let feeData = {
                feeStructure: sumFeeDetails,
                submittedfee: results
            }
            return feeData;
        } else {
            return 0
        }
    });
}
//get Student Result All
exports.getStudentsResult = async function (teacherid) {
    var result = await db.query('CALL SQSP_GetResult(?)', [teacherid]);
    return result[0];
}
//get Attendance all students
exports.getAllStudentsAttendance = async function (teacherid) {
    var result = await db.query('CALL SQSP_GetAttendance(?)', [teacherid]);
    return result[0];
}
//get teacher Details
exports.getTeacherDetails = async (userid) => {
    var result = await db.query('select * from userdetails where userid=?', [userid])
    return result
}
//Update teacher details
exports.updateOnboardDetails = async (image, userid) => {
    var result = await db.query('update userdetails set images = ? where userid = ?', [image, userid])
    return result;
}
//check password
exports.checkpassword = async (userid) => {
    var result = await db.query('select password from userdetails where userid = ?', [userid])
    return result[0]
}
//change password
exports.changePassword = async (password, userid) => {
    var result = await db.query('update userdetails set password = ? where userid = ?', [password, userid])
    return result
}

//inactivate the student
exports.inactivateStudent = async function (studentid, status, userrole) {
    var results = await db.query(`update userdetails set status = ${status} WHERE userid = ? and userrole = ?`, [studentid, userrole]);
    return results.affectedRows
}

//reactivate the student
exports.reactivateStudent = async function (studentid, status, userrole) {
    var results = await db.query(`update userdetails set status = ${status} WHERE userid = ? and userrole = ?`, [studentid, userrole]);
    return results.affectedRows
}

//get registration details for print
exports.getStudentRegistrationDetails = async function (adharnumber, session, accountid) {
    return db.transaction(async function (conn) {
        let school = await db.setQuery(conn, 'select accountname, accountrefnumber, accountaddress from account where accountid = ?', [accountid]);
        let studentData = await db.setQuery(conn, 'select * from userdetails where adharnumber = ? and session = ?', [adharnumber, session])
        let printData = {
            studentData: studentData,
            school: school
        }
        return printData;
    })
}

//save attendance of student
exports.saveDailyAttendance = async function (attendanceObj) {
    return db.transaction(async function (conn) {
        for (let i = 0; i < attendanceObj.length; i++) {
            let school = await db.setQuery(conn, 'select * from monthlyattendance where accountid = ? and teacherid = ? and studentid = ? and classid = ? and section = ? and session = ?', [attendanceObj[i].accountid, attendanceObj[i].teacherid, attendanceObj[i].studentid, attendanceObj[i].classid, attendanceObj[i].section, attendanceObj[i].session]);
            let currentMonthNumber = new Date().getMonth();
            let currentDayNumber = new Date().getDay().toString();
            let monthData = null
            if (currentMonthNumber === 0) {
                monthData = school[0].january
            } else if (currentMonthNumber === 1) {
                monthData = school[0].february
            } else if (currentMonthNumber === 2) {
                monthData = school[0].march
            } else if (currentMonthNumber === 3) {
                monthData = school[0].april
            } else if (currentMonthNumber === 4) {
                monthData = school[0].may
            } else if (currentMonthNumber === 5) {
                monthData = school[0].june
            } else if (currentMonthNumber === 6) {
                monthData = school[0].july
            } else if (currentMonthNumber === 7) {
                monthData = school[0].august
            } else if (currentMonthNumber === 8) {
                monthData = school[0].september
            } else if (currentMonthNumber === 9) {
                monthData = school[0].october
            } else if (currentMonthNumber === 10) {
                monthData = school[0].november
            } else if (currentMonthNumber === 11) {
                monthData = school[0].december
            }

            if (monthData === null) {
                let atten = ''
                if(currentMonthNumber === 0){
                    atten = { january: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 1){
                    atten = { february: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 2){
                    atten = { march: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 3){
                    atten = { april: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 4){
                    atten = { may: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 5){
                    atten = { june: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 6){
                    atten = { july: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 7){
                    atten = { august: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 8){
                    atten = { september: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 9){
                    atten = { october: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 10){
                    atten = { november: JSON.stringify([currentDayNumber] )}
                }else if(currentMonthNumber === 11){
                    atten = { december: JSON.stringify([currentDayNumber] )}
                }
                let result = await db.setQuery(conn, 'update monthlyattendance set ? where accountid = ? and teacherid = ? and studentid = ? and classid = ? and section = ? and session = ? ', [atten, attendanceObj[i].accountid, attendanceObj[i].teacherid, attendanceObj[i].studentid, attendanceObj[i].classid, attendanceObj[i].section, attendanceObj[i].session]);
                console.log('result null', result)
            } else {
                let oldData = '';
                let varvar = ''
                if(currentMonthNumber === 0){
                    oldData = JSON.parse(school[0].january)
                    oldData.push(currentDayNumber)
                    varvar = {january: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 1){
                    oldData = JSON.parse(school[0].february)
                    oldData.push(currentDayNumber)
                    varvar = {february: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 2){
                    oldData = JSON.parse(school[0].march)
                    oldData.push(currentDayNumber)
                    varvar = {march: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 3){
                    oldData = JSON.parse(school[0].april)
                    oldData.push(currentDayNumber)
                    varvar = {april: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 4){
                    oldData = JSON.parse(school[0].may)
                    oldData.push(currentDayNumber)
                    varvar = {may: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 5){
                    oldData = JSON.parse(school[0].june)
                    oldData.push(currentDayNumber)
                    varvar = {june: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 6){
                    oldData = JSON.parse(school[0].july)
                    oldData.push(currentDayNumber)
                    varvar = {july: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 7){
                    oldData = JSON.parse(school[0].august)
                    oldData.push(currentDayNumber)
                    varvar = {august: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 8){
                    oldData = JSON.parse(school[0].september)
                    oldData.push(currentDayNumber)
                    varvar = {september: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 9){
                    oldData = JSON.parse(school[0].october)
                    oldData.push(currentDayNumber)
                    varvar = {october: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 10){
                    oldData = JSON.parse(school[0].november)
                    oldData.push(currentDayNumber)
                    varvar = {november: JSON.stringify([...new Set(oldData)])}
                }else if(currentMonthNumber === 11){
                    oldData = JSON.parse(school[0].december)
                    oldData.push(currentDayNumber)
                    varvar = {december: JSON.stringify([...new Set(oldData)])}
                }
                let resultU = await db.setQuery(conn, 'update monthlyattendance set ? where accountid = ? and teacherid = ? and studentid = ? and classid = ? and section = ? and session = ? ', [varvar, attendanceObj[i].accountid, attendanceObj[i].teacherid, attendanceObj[i].studentid, attendanceObj[i].classid, attendanceObj[i].section, attendanceObj[i].session]);
                console.log('resulttttt', resultU)
            }

        }
        return 1;
    })
}

//getDailyAttendance
exports.getDailyAttendance = async function (accountid, teacherid, session) {
    return db.transaction(async function (conn) {
        let currentMonthNumber = new Date().getMonth();
        let monthName = ''
        if (currentMonthNumber === 0) {
            monthName = 'january'
        } else if (currentMonthNumber === 1) {
            monthName = 'february'
        } else if (currentMonthNumber === 2) {
            monthName = 'march'
        } else if (currentMonthNumber === 3) {
            monthName = 'april'
        } else if (currentMonthNumber === 4) {
            monthName = 'may'
        } else if (currentMonthNumber === 5) {
            monthName = 'june'
        } else if (currentMonthNumber === 6) {
            monthName = 'july'
        } else if (currentMonthNumber === 7) {
            monthName = 'august'
        } else if (currentMonthNumber === 8) {
            monthName = 'september'
        } else if (currentMonthNumber === 9) {
            monthName = 'october'
        } else if (currentMonthNumber === 10) {
            monthName = 'november'
        } else if (currentMonthNumber === 11) {
            monthName = 'december'
        }
        let getAttendance = await db.setQuery(conn, `select ${monthName} from monthlyattendance where accountid = ? and teacherid = ? and session = ?`, [accountid, teacherid, session]);

console.log('getAttendance',getAttendance)
        return getAttendance;
    })
}