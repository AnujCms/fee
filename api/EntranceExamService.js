const router = require('express').Router();
const entranceExamDB = require("../database/EntranceExamDB.js");
const UserEnum = require('../lookup/UserEnum');
const joiSchema = require('../apiJoi/examJoi.js');
const middleWare = require('../apiJoi/middleWare.js');

function isExaminationHead(req, res, next) {
    if (req.user.role === UserEnum.UserRoles.ExamHead) {
        next();
    } else {
        return res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
    }
}
function isExaminationStudent(req, res, next) {
    if (req.user.role === UserEnum.UserRoles.EntranceStudent) {
        next();
    } else {
        return res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
    }
}
function isExaminationCompleted(req, res, next) {
    if (req.user.role === UserEnum.UserRoles.EntranceCompleted) {
        next();
    } else {
        return res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
    }
}
let checkTeacherBelongsToAccount = function (req, res, next) {
    entranceExamDB.checkExamHeadBelongsToAccount(req.params.teacherid, req.user.accountid).
        then(() => {
            return next();
        }).catch((ex) => {
            console.log(ex)
            res.status(400).json({ status: 0, statusDescription: "Not Authenticated user." });
        })
}

//get students for Exam head
router.get("/:classid/entrancestudents", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let students = await entranceExamDB.getStudentsForExamhead(req.user.userid, req.params.classid);
    if (students.length > 0) {
        let studentsObj = [];
        students.forEach(function (row) {
            studentsObj.push({
                studentid: row.userid,
                firstname: encrypt.decrypt(row.firstname),
                lastname: encrypt.decrypt(row.lastname),
                cellnumber: encrypt.decrypt(row.cellnumber),
                adharnumber: row.adharnumber,
                dob: encrypt.decrypt(row.dob),
                totalmarks: row.totalmarks,
                obtainedmarks: row.obtainedmarks,
                status: row.status,
                class: row.classid,
                userrole: row.userrole,
                section:row.section
            });
        });
        res.status(200).json({ status: 1, students: studentsObj });
    } else {
        res.status(200).json({ status: 0, statusDescription:"Students are not Registered." });
    }
});
//delete student by Exam Head
router.delete("/:studentid/deletestudent", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await entranceExamDB.deleteStudent(req.params.studentid, req.user.userid);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'Student has been deleted successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Student has not been deleted.' })
    }
});
//pramote students by Exam Head
router.put("/:studentid/:classid/:section/pramotestudent", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await entranceExamDB.pramoteStudent(req.user.userid, req.params.studentid, req.params.classid,JSON.parse(req.user.configdata).session, req.user.accountid, req.params.section);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'Student has been Promoted successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Student has not been Promoted.' });
    }
});
//get entrance question based on selected class by Exam Head
router.get("/:classid/getclassforquestion", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await entranceExamDB.getClassForEntrance(req.user.accountid, req.params.classid);
    if (result.length > 0) {
        var resultObj = []
        result.forEach(function (row) {
            resultObj.push({
                qid: row.qid,
                class: row.class,
                question: encrypt.decrypt(row.question),
                optiona: encrypt.decrypt(row.optiona),
                optionb: encrypt.decrypt(row.optionb),
                optionc: encrypt.decrypt(row.optionc),
                optiond: encrypt.decrypt(row.optiond),
                answer: row.answer,
            })
        })
        res.status(200).json({ status: 1, statusDescription: resultObj });

    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the question.' });
    }
})
//Delete question by Exam Head
router.delete("/:questionid/deletequestion", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await entranceExamDB.deleteEntranceQuestion(req.params.questionid, req.user.accountid);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'Question has been deleted successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to delete the question.' });
    }
});
//entrance Registration
router.post("/entranceRegistration", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let student = {
        fname: encrypt.encrypt(req.body.fname),
        lname: encrypt.encrypt(req.body.lname),
        cellnumber: encrypt.encrypt(req.body.cellnumber),
        username: encrypt.computeHash(req.body.adharnumber),
        password: encrypt.getHashedPassword(req.body.adharnumber),
        adharnumber: req.body.adharnumber,
        dob: encrypt.encrypt(req.body.dob),
        class: req.body.class,
        section: req.body.section,
        status: UserEnum.UserStatus.Active,
        userrole: UserEnum.UserRoles.EntranceStudent
    }
    let result = await entranceExamDB.saveStusentEntrance(student, req.user.userid);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Student has been registered successfully.' })
    } else {
        res.status(400).json({ status: 0, statusDescription: 'Student registration not completed.' })
    }
});
//get student for update for edit
router.get("/:studentId/getstudentforedit", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await entranceExamDB.getStudentForEdit(req.user.userid, req.params.studentId);
    if (result.length > 0) {
        var resultObj = []
        result.forEach(function (row) {
            resultObj.push({
                class: row.classid,
                firstname: encrypt.decrypt(row.firstname),
                lastname: encrypt.decrypt(row.lastname),
                dob: encrypt.decrypt(row.dob),
                cellnumber: encrypt.decrypt(row.cellnumber),
                adharnumber: row.adharnumber,
                section: row.section
            })
        })
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to fetch the data.' });
    }
})
// Updating student
router.put("/updateEntranceRegistration", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let studentObject = {
        firstname: encrypt.encrypt(req.body.fname),
        lastname: encrypt.encrypt(req.body.lname),
        cellnumber: encrypt.encrypt(req.body.cellnumber),
        username: encrypt.computeHash(req.body.adharnumber),
        adharnumber: req.body.adharnumber,
        dob: encrypt.encrypt(req.body.dob),
        classid: req.body.class,
        section: req.body.section
    }
    let result = await entranceExamDB.updateEntranceStudent(studentObject, req.body.studentId, req.user.userid);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Student record has been updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Student record has not been updated.' });
    }
});

//update re exam entrance
router.put("/reexamentrance", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await entranceExamDB.updateEntranceUserrole(req.body.studentid, UserEnum.UserRoles.EntranceStudent, req.user.userid);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Student status updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Student status not updated.' });
    }
});
//get question for edit
router.get("/:questionid/getquestionforedit", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await entranceExamDB.getQuestionForEdit(req.user.accountid, req.params.questionid);
    if (result.length > 0) {
        var resultObj = []
        result.forEach(function (row) {
            resultObj.push({
                qid: row.qid,
                class: row.class,
                question: encrypt.decrypt(row.question),
                optiona: encrypt.decrypt(row.optiona),
                optionb: encrypt.decrypt(row.optionb),
                optionc: encrypt.decrypt(row.optionc),
                optiond: encrypt.decrypt(row.optiond),
                optione: encrypt.decrypt(row.optione),
                answer: row.answer,
                class: row.class,
                subject: row.subject
            })
        })
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to fetch the data.' });
    }
})
// Updating question
router.put("/:questionid/updatequestion", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let question = {
        question: encrypt.encrypt(req.body.question),
        optiona: encrypt.encrypt(req.body.optiona),
        optionb: encrypt.encrypt(req.body.optionb),
        optionc: encrypt.encrypt(req.body.optionc),
        optiond: encrypt.encrypt(req.body.optiond),
        optione: encrypt.encrypt('None of These'),
        answer: req.body.answer,
        class: req.body.class,
        subject: req.body.subject,
        accountid: req.user.accountid,
        questionid: req.params.questionid
    }
    let result = await entranceExamDB.updateEntranceQuestion(question);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Question has been updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Question has not been updated.' });
    }
});
//Create Entrance Questions
router.post("/entranceQuestion", isExaminationHead, checkTeacherBelongsToAccount, async function (req, res) {
    let questionObject = {
        question: encrypt.encrypt(req.body.question),
        optiona: encrypt.encrypt(req.body.optiona),
        optionb: encrypt.encrypt(req.body.optionb),
        optionc: encrypt.encrypt(req.body.optionc),
        optiond: encrypt.encrypt(req.body.optiond),
        optione: encrypt.encrypt(req.body.optione),
        answer: req.body.answer,
        class: req.body.class,
        subject: req.body.subject,
        accountid: req.user.accountid
    }
    let result = await entranceExamDB.saveEntranceQuestion(questionObject);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Quastion has been created successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Quastion not created.' });
    }
});

//get entrance question for student
router.get("/getclassforquestion", isExaminationStudent, async function (req, res) {
    var result = await entranceExamDB.getQuestionForEntrance(req.user.userid,req.user.accountid);
    if (result.length > 0) {
        var resultObj = []
        result.forEach(function (row) {
            resultObj.push({
                qid: row.qid,
                class: row.class,
                question: encrypt.decrypt(row.question),
                optiona: encrypt.decrypt(row.optiona),
                optionb: encrypt.decrypt(row.optionb),
                optionc: encrypt.decrypt(row.optionc),
                optiond: encrypt.decrypt(row.optiond),
                answer: row.answer,
                subject: row.subject
            })
        })
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to get the class" });
    }
})

//Insert entrance result
router.post("/createentranceresult", isExaminationStudent, async function (req, res) {
    var result = {
        studentid: req.user.userid,
        totalmarks: req.body.totalmarks,
        obtainedmarks: req.body.obtainedmarks
    }
    const r = Math.round((result.obtainedmarks * 100) / result.totalmarks);
    if (r > 60) {
        result.status = 'Passed'
    } else { result.status = 'Failed' }
    let results = await entranceExamDB.insertentranceresult(result, UserEnum.UserRoles.EntranceCompleted);
    if (results == 1) {
        res.status(200).json({ status: 1, statusDescription: "Exam completed." });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to save the reqult." });
    }
})
router.get("/getentranceresult", isExaminationCompleted, async function (req, res) {
    let result = await entranceExamDB.getEntranceCompletedResult(req.user.userid);
    if (result.length > 0) {
        res.status(200).json({ status: 1, statusDescription: result[0] });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to fetch the data.' });
    }   
})

module.exports = router;