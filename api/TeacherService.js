const router = require('express').Router();
const teacherDB = require("../database/TeacherDB.js");
const UserEnum = require('../lookup/UserEnum');
const passwordHash = require('password-hash');
const joiSchema = require('../apiJoi/teacherJoi.js');
const middleWare = require('../apiJoi/middleWare.js');

function isTeacherOrExamHead(req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Teacher || req.user.role === UserEnum.UserRoles.ExamHead ) {
        next();
    } else {
        return res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
    }
}
 function isTeacherOrExamHeadOrFeeAccount(req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Teacher || req.user.role === UserEnum.UserRoles.ExamHead || req.user.role === UserEnum.UserRoles.FeeAccount ) {
        next();
    } else {
        return res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
    }
}
async function isTeacherStudentRelated(req,res,next){
    let result = await teacherDB.checkTeacherStudentRelation(req.params.studentid, req.user.accountid);
    if(result){
        next();
    }else{ 
        return res.status(200).json({ status: 0, statusDescription: "Student and Teacher are not belongs to same account." });
    }    
}
//get Students for teacher
router.get("/getmystudents", isTeacherOrExamHead, async function (req, res) {
    let result = await teacherDB.getAllStudents(req.user.userid, UserEnum.UserStatus.Active, JSON.parse(req.user.configdata).session);
    if (result.length > 0) {
        var resultObj = [];
        result.forEach(function (row) {
            resultObj.push({
                userid: row.userid,
                firstname: encrypt.decrypt(row.firstname),
                lastname: encrypt.decrypt(row.lastname),
                mothername: row.mothername,
                fathername: row.fathername,
                cellnumber: encrypt.decrypt(row.cellnumber),
                roll: row.rollnumber,
                adharnumber: row.adharnumber,
                dob: encrypt.decrypt(row.dob),
                gender: row.gender,
                religion: row.religion,
                category: row.category,
                locality: row.locality,
                status: row.status,
                images:row.images,
                classid: row.classid,
                section: row.section
            });
        });
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the students.' });
    }
});

//get Inactivated Students for teacher
router.get("/getmyinactivatedstudents", isTeacherOrExamHead, async function (req, res) {
    let result = await teacherDB.getAllInactivatedStudents(req.user.userid, UserEnum.UserStatus.Inactive, JSON.parse(req.user.configdata).session);
    if (result.length > 0) {
        var resultObj = [];
        result.forEach(function (row) {
            resultObj.push({
                userid: row.userid,
                firstname: encrypt.decrypt(row.firstname),
                lastname: encrypt.decrypt(row.lastname),
                mothername: row.mothername,
                fathername: row.fathername,
                cellnumber: encrypt.decrypt(row.cellnumber),
                roll: row.rollnumber,
                adharnumber: row.adharnumber,
                dob: encrypt.decrypt(row.dob),
                gender: row.gender,
                religion: row.religion,
                category: row.category,
                locality: row.locality,
                status: row.status,
                images:row.images
            });
        });
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the students.' });
    }
});
//check adharnumber
router.get("/getAdharnumber/:adharnumber", async function(req, res){
let result = await teacherDB.checkAddhar(req.params.adharnumber);
if(result){
    res.status(200).json({ "isAdharNumberUsed": true });
}else{
    res.status(200).json({ "isAdharNumberUsed": false });
}
})
//check emailid 
router.get("/getEmailId/:emailid", async function(req, res){
    let result = await teacherDB.checkEmailId(encrypt.encrypt(req.params.emailid));
    if(result){
        res.status(200).json({ "isEmailIdUsed": true });
    }else{
        res.status(200).json({ "isEmailIdUsed": false });
    }
    })
//Student Registration
router.post("/studentRegistration", isTeacherOrExamHead, async function (req, res) {
    let img = req.body.images;
    var image;
    if (img == null) {
        image = img
    } else if (img.length == 0) {
        image = null
    } else {
        image = img
    }
    if(req.body.images !== ''){
        var encryptimg =  image.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    let student = {
        firstname: encrypt.encrypt(req.body.firstname),
        lastname: encrypt.encrypt(req.body.lastname),
        mothername: req.body.mothername,
        fathername: req.body.fathername,
        cellnumber: encrypt.encrypt(req.body.cellnumber),
        username: encrypt.computeHash(req.body.adharnumber),
        password: encrypt.getHashedPassword(req.body.adharnumber),
        dob: encrypt.encrypt(req.body.dob),
        adharnumber: req.body.adharnumber,
        gender: req.body.gender,
        religion: req.body.religion,
        category: req.body.category,
        locality: req.body.locality,
        localaddress: req.body.localaddress,
        parmanentaddress: req.body.parmanentaddress,
        userid: req.user.userid,
        userrole: UserEnum.UserRoles.Student,
        status: UserEnum.UserStatus.Active,
        images: encryptimg,
        session:JSON.parse(req.user.configdata).session
    }
    let result = await teacherDB.saveStusentDetails(student, req.user.userid, req.user.accountid);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Student has been created successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Your principal is not assigned you any class.' });
    }
});
// Updating Student Information by class teacher
router.post("/updateStudent", isTeacherOrExamHead, async function (req, res) {
    let img = req.body.images;
    var image;
    if (img == null) {
        image = img
    } else if (img.length == 0) {
        image = null
    } else {
        image = img
    }
    if(req.body.images !== null){
    var encryptimg =  image.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    var studentObj = {
        studentid: req.body.studentid,
        firstname: encrypt.encrypt(req.body.firstname),
        lastname: encrypt.encrypt(req.body.lastname),
        mothername: req.body.mothername,
        fathername: req.body.fathername,
        cellnumber: encrypt.encrypt(req.body.cellnumber),
        dob: encrypt.encrypt(req.body.dob),
        adharnumber: req.body.adharnumber,
        gender: req.body.gender,
        religion: req.body.religion,
        category: req.body.category,
        locality: req.body.locality,
        localaddress: req.body.localaddress,
        parmanentaddress: req.body.parmanentaddress,
        userid: req.user.userid,
        images: encryptimg
    }
    let result = await teacherDB.updateStusentRecord(studentObj);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Student has been updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to update the student details.' });
    }
});
// getting student information for update 
router.get("/updateStudentDetails/:studentid", isTeacherOrExamHead, isTeacherStudentRelated, async function (req, res) {
let result = await teacherDB.getStudentDetails(req.params.studentid, req.user.userid, JSON.parse(req.user.configdata).session);
    if (result.length > 0) {
        var resultObj = [];
        result.forEach(function (row) {
            resultObj.push({
                userid: row.userid,
                firstname: encrypt.decrypt(row.firstname),
                lastname: encrypt.decrypt(row.lastname),
                mothername: row.mothername,
                fathername: row.fathername,
                cellnumber: encrypt.decrypt(row.cellnumber),
                adharnumber: row.adharnumber,
                dob: encrypt.decrypt(row.dob),
                gender: row.gender,
                religion: row.religion,
                category: row.category,
                locality: row.locality,
                locaddress: row.localaddress,
                paraddress: row.parmanentaddress,
                images: row.images
            });
        });
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the data.' });
    }
});
//get config details(Delete)
router.get("/:teacherid/getconfigdetails", async function (req, res) {
       let result = await teacherDB.getconfigdetailsByAllUsers(req.params.teacherid);
    if (result.length > 0) {
        let configData = JSON.parse(result[0].configdata);
        res.status(200).json({ status: 1, statusDescription: configData });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'There is no config.' });
    }
})
//get assign subjects
router.get("/assignsubjects", isTeacherOrExamHead, async function (req, res) {
    let result = await teacherDB.getAssignSubjectToClass(req.user.userid, req.user.accountid);
    if (result.length > 0) {
        res.status(200).json({ status: 1, statusDescription: JSON.parse(result[0].subjects) });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Principal is not assigned subjects for this class.' });
    }
})
//Save Student Result
router.post("/studentResult/:studentid", isTeacherOrExamHead, isTeacherStudentRelated, middleWare(joiSchema.studentCreateResult, "body"), async function (req, res) {
    var result;
    switch (req.body.subjectid) {
        case 1: result = { hindi: JSON.stringify([{totalMarks:req.body.totalMarks, obtainMarks:req.body.obtainMarks }])}
            break;
        case 2: result = { english: JSON.stringify([{totalMarks:req.body.totalMarks, obtainMarks: req.body.obtainMarks }])};
            break;
        case 3: result = { mathematics: JSON.stringify([{totalMarks:req.body.totalMarks, obtainMarks: req.body.obtainMarks }])};
            break;
        case 4: result = { science:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks }])};
            break;
        case 5: result = { socialscience:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks}]) };
            break;
        case 6: result = { geography:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks}]) };
            break;
        case 7: result = { physics:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks}]) };
            break;
        case 8: result = { chemistry:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks}]) };
            break;
        case 9: result = { biology:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks}]) };
            break;
        case 10: result = { moralscience:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks}]) };
            break;
        case 11: result = { drawing:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks }])};
            break;
        case 12: result = { computer:JSON.stringify([{totalMarks: req.body.totalMarks, obtainMarks: req.body.obtainMarks }])};
            break;
        default:
            break;
    }
    result.teacherid = req.user.userid,
    result.studentid = req.params.studentid
    result.examinationtype = req.body.examinationtype
let results = await teacherDB.saveStusentResult(result, JSON.parse(req.user.configdata).session);
    if (results) {
        res.status(200).json({ status: 1, statusDescription: "Student result has been saved successfully." });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to save student result" });
    }
});
//Save Student Attendance by class teacher
router.post("/studentAttendance/:studentid", isTeacherOrExamHead, isTeacherStudentRelated, middleWare(joiSchema.studentCreateAttendance, "body"), async function (req, res) {
    var result;
    switch (req.body.monthName) {
        case 1: result = { january: req.body.monthName, jtd: req.body.totalClasses, jpd: req.body.presentClasses };
            break;
        case 2: result = { february: req.body.monthName, ftd: req.body.totalClasses, fpd: req.body.presentClasses };
            break;
        case 3: result = { march: req.body.monthName, mtd: req.body.totalClasses, mpd: req.body.presentClasses };
            break;
        case 4: result = { april: req.body.monthName, atd: req.body.totalClasses, apd: req.body.presentClasses };
            break;
        case 5: result = { may: req.body.monthName, matd: req.body.totalClasses, mapd: req.body.presentClasses };
            break;
        case 6: result = { june: req.body.monthName, juntd: req.body.totalClasses, junpd: req.body.presentClasses };
            break;
        case 7: result = { july: req.body.monthName, jultd: req.body.totalClasses, julpd: req.body.presentClasses };
            break;
        case 8: result = { august: req.body.monthName, autd: req.body.totalClasses, aupd: req.body.presentClasses };
            break;
        case 9: result = { september: req.body.monthName, std: req.body.totalClasses, spd: req.body.presentClasses };
            break;
        case 10: result = { october: req.body.monthName, otd: req.body.totalClasses, opd: req.body.presentClasses };
            break;
        case 11: result = { november: req.body.monthName, ntd: req.body.totalClasses, npd: req.body.presentClasses };
            break;
        case 12: result = { december: req.body.monthName, dtd: req.body.totalClasses, dpd: req.body.presentClasses };
            break;
        default:
            break;
    }
    result.teacherid = req.user.userid,
        result.studentid = req.params.studentid
    let attendance = await teacherDB.saveStusentAttendance(result, JSON.parse(req.user.configdata).session);
    if (attendance) {
        res.status(200).json({ status: 1, statusDescription: "Student attendance has been submitted successfully." });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to save student attendance" });
    }
});
//get Student fee details for Teacher
router.get("/getfeedetailsforteacher", async function (req, res) {
    let result = await teacherDB.getFeeDetailsForTeacher(req.user.userid, JSON.parse(req.user.configdata).session, req.user.accountid);
    if (result) {
        var resultObj = [];
        var a = result.feeStructure[0];
        var feeSum = parseInt(a.january) + a.february + a.march + a.april + a.may + a.june + a.july + a.august + a.september + a.october + a.november + a.december;

        result.submittedfee.forEach(function (row) {
            resultObj.push({
                studentid: row.studentid,
                adharnumber: row.adharnumber,
                january: row.january,
                february: row.february,
                march: row.march,
                april: row.april,
                may: row.may,
                june: row.june,
                july: row.july,
                august: row.august,
                september: row.september,
                october: row.october,
                november: row.november,
                december: row.december,
                submittedSum: row.january + row.february + row.march + row.april + row.may + row.june + row.july + row.august + row.september + row.october + row.november + row.december,
                totalFee: feeSum
            });
        });
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to get the fee details." });
    }
})
//get Student Result All
router.get("/getstudentsresult", isTeacherOrExamHead, async function (req, res) {
    let result = await teacherDB.getStudentsResult(req.user.userid);
    if (result.length > 0) {
        var resultObj = []
        result.forEach(function (row) {
            resultObj.push({
                studentid: row.studentid,
                hindi: row.hindi,
                hindiobtainmarks: row.hindiobtainmarks,
                english: row.english,
                englishobtainmarks: row.englishobtainmarks,
                math: row.math,
                mathobtainmarks: row.mathobtainmarks,
                science: row.science,
                scienceobtainmarks: row.scienceobtainmarks,
                history: row.history,
                historyobtainmarks: row.historyobtainmarks,
                physics: row.physics,
                physcisobtainmarks: row.physcisobtainmarks,
                chemistry: row.chemistry,
                chemistryobtainmarks: row.chemistryobtainmarks
            })
        })
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to get the result details." });
    }
})
//get Attendance of all students
router.get("/getstudentsattendance", isTeacherOrExamHead, async function (req, res) {
    let results = await teacherDB.getAllStudentsAttendance(req.user.userid);
    if (results.length > 0) {
        var resultObj = [];
        results.forEach(function (result) {
            resultObj.push({
                studentid: result.studentid,
                january: result.january,
                jtd: result.jtd,
                jpd: result.jpd,
                february: result.february,
                ftd: result.ftd,
                fpd: result.fpd,
                march: result.march,
                mtd: result.mtd,
                mpd: result.mpd,
                april: result.april,
                atd: result.atd,
                apd: result.apd,
                may: result.may,
                matd: result.matd,
                mapd: result.mapd,
                june: result.june,
                juntd: result.juntd,
                junpd: result.junpd,
                july: result.july,
                jultd: result.jultd,
                julpd: result.julpd,
                august: result.august,
                autd: result.autd,
                aupd: result.aupd,
                september: result.september,
                std: result.std,
                spd: result.spd,
                october: result.october,
                otd: result.otd,
                opd: result.opd,
                november: result.november,
                ntd: result.ntd,
                npd: result.npd,
                december: result.december,
                dtd: result.dtd,
                dpd: result.dpd
            });
        });
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the attendance' });
    }
})
//get teacher Details
router.get("/getTeacherDetails", isTeacherOrExamHeadOrFeeAccount, async (req, res) => {
    let result = await teacherDB.getTeacherDetails(req.user.userid);
    if (result.length > 0) {
        var resultObj = {
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            cellnumber: encrypt.decrypt(result[0].cellnumber),
            emailid: encrypt.decrypt(result[0].emailid),
            dob: result[0].dob,
            parmanentaddress: result[0].parmanentaddress,
            localaddress: result[0].localaddress,
            qualification: result[0].qualification,
            class: result[0].classid,
            section: result[0].section,
            image: result[0].images
        };
        res.status(200).json({ status: 1, statusDescription: resultObj })
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to get the Teacher details." });
    }
})
//Update teacher profile
router.post("/updateProfileDetails", isTeacherOrExamHeadOrFeeAccount, async (req, res) => {
    let changePassword = req.body.changePassword,
        oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword;
    let img = req.body.image;
    if (newPassword != undefined || newPassword != null) {
        var hashedpassword = passwordHash.generate(newPassword);
    }
    var image;

    if (img == null) {
        image = img
    } else if (img.length == 0) {
        image = null
    } else {
        image = img
    }
    if (image == null) {
        let result = await teacherDB.updateOnboardDetails(image, req.user.userid)
        if (result.affectedRows == 1) {
            if (changePassword) {
                let result = await teacherDB.checkpassword(req.user.userid);
                if (!passwordHash.verify(oldPassword, result.password)) {
                    res.status(200).json({ status: 2, statusDescription: 'current password did not match' })
                } else {
                    let changepassword = await teacherDB.changePassword(hashedpassword, req.user.userid)
                    if (changepassword.affectedRows == 1) {
                        res.status(200).json({ status: 1, statusDescription: "Password updated successfully." })
                    } else {
                        return res.status(200).json({ status: 0, statusDescription: "Unable to update the password." });
                    }
                }
            }
            else {
                res.status(200).json({ status: 1, statusDescription: "successfully saved the record." })
            }

            if (firstname == checkemail[0].firstname && lastname == checkemail[0].lastname) {
                return
            }
        } else {
            return res.status(200).json({ status: 0, statusDescription: "Not able to update record." });
        }
    } else {
        let encryptimg = img.replace(/^data:image\/[a-z]+;base64,/, "");
        let result = await teacherDB.updateOnboardDetails(encryptimg, req.user.userid)

        if (result.affectedRows == 1) {
            if (changePassword) {
                let result = await teacherDB.checkpassword(req.user.userid);
                if (!passwordHash.verify(oldPassword, result.password)) {
                    res.status(200).json({ status: 2, statusDescription: 'current password did not match' })
                } else {
                    let changepassword = await teacherDB.changePassword(hashedpassword, req.user.userid)
                    if (changepassword.affectedRows == 1) {
                        res.status(200).json({ status: 1, statusDescription: "Password has been successfully saved." })
                    } else {
                        return res.status(200).json({ status: 0, statusDescription: "Not able to save the password." });
                    }
                }
            }
            else {
                res.status(200).json({ status: 1, statusDescription: "Record has been saved." })
            }
        } else {
            return res.status(200).json({ status: 0, statusDescription: "Not able to save the record." });
        }
    }
})
//Inactivate student by class teacher
router.post('/inactivatestudent/:studentid', isTeacherOrExamHead, isTeacherStudentRelated, async function (req, res) {
    let result = await teacherDB.inactivateStudent(req.params.studentid, UserEnum.UserStatus.Inactive, UserEnum.UserRoles.Student);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: "Student has been inactivated successfully." });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Student is not inactivated." });
    }
});
//Inactivate student by class teacher
router.post('/reactivatestudent/:studentid', isTeacherOrExamHead, isTeacherStudentRelated, async function (req, res) {
    let result = await teacherDB.reactivateStudent(req.params.studentid, UserEnum.StudentStatusEnum.active, UserEnum.UserRoles.Student);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: "Student has been activated successfully." });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Student is not Reactivated." });
    }
});

//get student Registration print details
router.get("/:adharnumber/getstudentregistrationdetails", isTeacherOrExamHead, async function (req, res) {
let result = await teacherDB.getStudentRegistrationDetails(req.params.adharnumber, JSON.parse(req.user.configdata).session, req.user.accountid);
    if(result.studentData.length>0){
        let freePrintData = {
            schoolName:result.school[0].accountname,
            schoolNumber:result.school[0].accountrefnumber,
            schoolAddress: result.school[0].accountaddress,
            studentName: encrypt.decrypt(result.studentData[0].firstname) +" " +encrypt.decrypt(result.studentData[0].lastname),
            adharNumber: result.studentData[0].adharnumber,
            cellNumber:encrypt.decrypt(result.studentData[0].cellnumber),
            dob:encrypt.decrypt(result.studentData[0].dob),
            motherName: result.studentData[0].mothername,
            fatherName: result.studentData[0].fathername,
            class: result.studentData[0].classid,
            section: result.studentData[0].section,
            gender: result.studentData[0].gender,
            religion: result.studentData[0].religion,
            category: result.studentData[0].category,
            locality: result.studentData[0].locality,
            localAddress: result.studentData[0].localaddress,
            parmanentAddress: result.studentData[0].parmanentaddress
        }
    res.status(200).json({ status: 1, statusDescription: freePrintData});
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able tpoo get the data." });
    }
})

//save attendance student by class teacher
router.post('/savedailyattendance', async function (req, res) {
    let attendanceObj = [];
    for(let i=0;i<req.body.length;i++){
        attendanceObj.push({
            accountid: req.user.accountid,
            teacherid: req.user.userid,
            studentid: req.body[i].studentId,
            classid: req.body[i].classid,
            section: req.body[i].section,
            session: JSON.parse(req.user.configdata).session,
        })
    }

    let result = await teacherDB.saveDailyAttendance(attendanceObj);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: "Student has been activated successfully." });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Student is not Reactivated." });
    }
});

//get student attendance
router.get('/getdailyattendance', async function (req, res) {
    let result = await teacherDB.getDailyAttendance(req.user.accountid, req.user.userid, JSON.parse(req.user.configdata).session );
    if (result) {
        res.status(200).json({ status: 1, statusDescription: result });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Student is not Reactivated." });
    }
});
module.exports = router;