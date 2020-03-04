const db = require('./db.js');
var UserEnum = require('../lookup/UserEnum');

//check the student school validation
exports.checkStudentSchool = async function (accountid, adharnumber) {
    let result = await db.query('select accountid from teacher_principal where userid = (select teacherid from student_teacher where studentid = (select userid from userdetails where adharnumber = ? ))', [adharnumber]);
   if(result.length === 1){
    let status = result[0].accountid.localeCompare(accountid);
    if(status === 0){
        return 1
    }else{
        return 2
    }
   }else{
       return 3
   }
}
//check the class school validation
exports.checkClassSchool = async function (accountid, classid, sectionid, userrole, session) {
    let result = await db.query('select accountid from teacher_principal where userid = (select userid from userdetails where classid = ? and section = ? and userrole =  ?)', [classid, sectionid, userrole, session]);
    let status = result[0].accountid.localeCompare(accountid);
    if(status === 0){
        return true
    }else{
        return false
    }
}
//get fee details
exports.getFeeDetails = async function (session, accountid) {
    let result = await db.query('select * from feestructure where accountid = ? and session = ?', [accountid, session]);
    return result;
}
//get fee details by class
exports.getFeeDetailByClass = async function (session, accountid, classs) {
    let result = await db.query('select * from feestructure where accountid = ? and session = ? and class = ?', [accountid, session, classs]);
    return result;
}
//create fee for selected class
exports.manageFee = function (session, accountid, feeObject) {
    return db.transaction(async function (conn) {
        feeObject.accountid = accountid;
        feeObject.session = session;
        let checkdata = await db.setQuery(conn, 'select * from feestructure where accountid = ? and class = ? and session = ?', [accountid, feeObject.class, session]);
        if (checkdata.length > 0) {
            let result = await db.setQuery(conn, 'update feestructure set ? where accountid = ? and class = ? and session = ?', [feeObject, accountid, feeObject.class, session]);
            return result.affectedRows;
        }
        else {
            let result = await db.query('CALL SQSP_CreateFeeStructure(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [feeObject.accountid,
                feeObject.class,
                feeObject.session,
                feeObject.january,
                feeObject.february,
                feeObject.march,
                feeObject.april,
                feeObject.may,
                feeObject.june,
                feeObject.july,
                feeObject.august,
                feeObject.september,
                feeObject.october,
                feeObject.november,
                feeObject.december
                ]);
            return result.affectedRows;
        }
    });
}

//update Student fee details
exports.updateFeeDetails = async function (session, accountid, feeObject) {
    feeObject.accountid = accountid;
    feeObject.session = session;
    let result = await db.query('update feestructure set ? where accountid = ? and class = ? and session = ?', [feeObject, accountid, feeObject.class, session]);
    return result.affectedRows;
}
//get Student fee details
exports.getStudentFeeDetails = function (adharnumber, session, accountid) {
    return db.transaction(async function (conn) {
        let studentData = await db.setQuery(conn, 'select * from userdetails where adharnumber = ? and session = ? and status !=?', [adharnumber, session,9]);
        let feeStructure = await db.setQuery(conn, 'select * from feestructure where class = ? and accountid = ? and session = ?', [studentData[0].classid, accountid, session]);
        let results = await db.setQuery(conn, 'select * from studentfee where adharnumber = ? and session = ?', [adharnumber, session]);
        let feeData = {
            student: studentData,
            feeStructure: feeStructure,
            feeDetails: results
        }
        return feeData;
    });
}
//get monthly fee based on selected month
exports.getMonthlyFeeBasedOnSelectedMonth = function (adharnumber, session, accountid, selectedMonth) {
    return db.transaction(async function (conn) {
        var classs = await db.setQuery(conn, 'select classid from userdetails where adharnumber = ?', [adharnumber]);
        let classid = classs[0].classid;
        let monthlyFeeData = await db.setQuery(conn, `select ${selectedMonth} from feestructure where accountid = ? and class = ? and session = ?`, [accountid, classid, session]);
        return monthlyFeeData;
    });
}
//pay student fee
exports.payStudentFee = function (adharnumber, session, studentFeeObj, feeObj) {
    return db.transaction(async function (conn) {
        let checkstudentfee = await db.setQuery(conn, `select ${studentFeeObj.monthName} from studentfee where adharnumber = ? and session = ?`, [adharnumber, session]);
        if (checkstudentfee.length > 0) {
            let result = await db.setQuery(conn, 'update studentfee set ? where adharnumber = ? and session = ?', [feeObj, adharnumber, session]);
            return result.affectedRows;
        }
        else {
            let result = await db.setQuery(conn, `insert into studentfee(session, adharnumber, ${studentFeeObj.monthName}) values(${session}, ${adharnumber}, ${studentFeeObj.selectedmonthfee})`, [adharnumber, session]);
            return result.affectedRows;
        }
    });
}
//get fee details by class
exports.getclassfeedetails = async function (session, accountid, classid, section) {
    return db.transaction(async function (conn) {
        let feeStructure = await db.setQuery(conn, 'select * from feestructure where class = ? and accountid = ? and session = ?', [classid, accountid, session]);
        let results = await db.setQuery(conn, 'select u.firstname, u.lastname, u.adharnumber, f.january, f.february, f.march, f.april, f.may, f.june, f.july, f.august, f.september, f.october, f.november, f.december from userdetails u inner join studentfee f on u.adharnumber = f.adharnumber where u.classid = ? and u.section = ? and u.session = ?', [classid, section, session]);
        if(results.length>0){
            let feeData = {
                feeStructure: feeStructure,
                feeDetails: results
            }
            return feeData;
        }else{
            let feeData1 = {
                feeDetails: []
            }
            return feeData1
        }

    });
}
//get fee details for print
exports.getFeeDetailsForPrint = async function (adharnumber, session, accountid) {
    return db.transaction(async function (conn) {
    let school = await db.setQuery(conn, 'select accountname, accountrefnumber, accountaddress from account where accountid = ?',[accountid]);
    let studentData  = await db.setQuery(conn, 'select firstname, lastname, cellnumber,dob, mothername, fathername, adharnumber, classid, section from userdetails where adharnumber = ?',[adharnumber])
    // let result = await db.query('select * from studentfee where adharnumber = ? and session = ?', [adharnumber, session]);
    // console.log("print",result)
    let printData = {
        studentData:studentData,
        school: school
    }
    return printData;
    })
}

//get students list of class
exports.getStudentsListOfClass = async function (accountid, userid, classid, section, session) {
    return db.transaction(async function (conn) {
    let classTeacher = await db.setQuery(conn, 'select userid from userdetails where userid in(select userid from teacher_principal where accountid = ?) and userrole = 3 and classid = ? and section=?',[accountid, classid, section]);
        if(classTeacher){
            let studentList  = await db.setQuery(conn, 'select * from userdetails where userid in(select studentid from student_teacher where teacherid = ?)',[classTeacher[0].userid]);
            return studentList
        }
    })
}