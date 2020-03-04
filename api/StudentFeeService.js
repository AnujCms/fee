const router = require('express').Router();
const studentFeeDB = require("../database/StudentFeeDB.js");
const UserEnum = require('../lookup/UserEnum');

function isAccountantOrTeacher(req, res, next) {
    if (req.user.role == UserEnum.UserRoles.FeeAccount || req.user.role === UserEnum.UserRoles.Teacher) {
        next();
    } else {
        return res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
    }
}

async function isStudentBelongsToSameSchool(req, res, next) {
    let result = await studentFeeDB.checkStudentSchool(req.user.accountid,  req.params.adharnumber)
    if (result === 1) {
        next();
    } else if(result === 2) {
        return res.status(200).json({ status: 2, statusDescription: "AAdhar number is not belongs to your school. Try with correct aadhar number." });
    }else if(result === 3){
        return res.status(200).json({ status: 2, statusDescription: "AAdhar number is not registered in my system. Try with correct aadhar number." });
    }
}

async function isClassBelongsToSameSchool(req, res, next) {
    let result = await studentFeeDB.checkClassSchool(req.user.accountid, req.params.classid, req.params.sectionid, UserEnum.UserRoles.Teacher, JSON.parse(req.user.configdata).session)
    if (result) {
        next();
    } else {
        return res.status(200).json({ status: 2, statusDescription: "AAdhar number is not belongs to your school. Try with correct aadhar number." });
    }
}

//get fee details
router.get("/getfeedetails", isAccountantOrTeacher, async function (req, res) {
    let result = await studentFeeDB.getFeeDetails(JSON.parse(req.user.configdata).session, req.user.accountid);
    if (result.length > 0) {
        var resultObj = []
        result.forEach(function (row) {
            resultObj.push({
                class: row.class,
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
                december: row.december
            })
        })
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get fee details.' });
    }
})
//get fee details by class
router.get("/:classs/getfeedetailbyclass", isAccountantOrTeacher, async function (req, res) {
    let result = await studentFeeDB.getFeeDetailByClass(JSON.parse(req.user.configdata).session, req.user.accountid, req.params.classs);
    if (result.length > 0) {
        var resultObj = []
        result.forEach(function (row) {
            resultObj.push({
                class: row.class,
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
                december: row.december
            })
        })
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get fee details.' });
    }
})
//create fee for selected class
router.post("/createfeeforselectedclass", isAccountantOrTeacher, async function (req, res) {
    feeObject = {
        class: req.body.class,
        january: req.body.january,
        february: req.body.february,
        march: req.body.march,
        april: req.body.april,
        may: req.body.may,
        june: req.body.june,
        july: req.body.july,
        august: req.body.august,
        september: req.body.september,
        october: req.body.october,
        november: req.body.november,
        december: req.body.december
    }
    let result = await studentFeeDB.manageFee(JSON.parse(req.user.configdata).session, req.user.accountid, feeObject);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'Fee details has been saved successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to create fee details.' });
    }
})
//update Student fee details
router.put("/updatefeedetails", isAccountantOrTeacher, async function (req, res) {
    feeObject = {
        class: req.body.class,
        january: req.body.january,
        february: req.body.february,
        march: req.body.march,
        april: req.body.april,
        may: req.body.may,
        june: req.body.june,
        july: req.body.july,
        august: req.body.august,
        september: req.body.september,
        october: req.body.october,
        november: req.body.november,
        december: req.body.december
    }
    let result = await studentFeeDB.updateFeeDetails(JSON.parse(req.user.configdata).session, req.user.accountid, feeObject);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'Fee details has been updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to update fee details.' });
    }
})
//get Student fee details
router.get("/:adharnumber/feedetails", async function (req, res) {
    let result = await studentFeeDB.getStudentFeeDetails(req.params.adharnumber, JSON.parse(req.user.configdata).session, req.user.accountid);
    if (result.student.length > 0) {
        var s = result.student[0];
        var f = result.feeDetails[0];
        var str = result.feeStructure[0];

        var studentfeeData = {
            name: encrypt.decrypt(s.firstname) + " " + encrypt.decrypt(s.lastname),
            mothername: s.mothername,
            fathername: s.fathername,
            dob: encrypt.decrypt(s.dob),
            cellnumber: encrypt.decrypt(s.cellnumber),
            gender: s.gender,
            adharnumber: s.adharnumber
        }
        if (result.feeStructure.length > 0) {
            var studentFeeStructure = {
                jan: str.january,
                feb: str.february,
                mar: str.march,
                apr: str.april,
                may: str.may,
                jun: str.june,
                jul: str.july,
                aug: str.august,
                sep: str.september,
                oct: str.october,
                nov: str.november,
                dec: str.december
            }
        }
        if (result.feeDetails.length > 0) {
            var studentFeeDetails = {
                jan: f.january,
                feb: f.february,
                mar: f.march,
                apr: f.april,
                may: f.may,
                jun: f.june,
                jul: f.july,
                aug: f.august,
                sep: f.september,
                oct: f.october,
                nov: f.november,
                dec: f.december
            }
        } else {
            studentFeeDetails = {}
        }
        res.status(200).json({ status: 1, studentfeeData: studentfeeData, studentFeeDetails: studentFeeDetails, studentFeeStructure: studentFeeStructure });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to get fee details." });
    }
})
//get monthly fee based on selected month
router.get("/:adharnumber/:selectedmonth/getmonthlyfee", isAccountantOrTeacher, isStudentBelongsToSameSchool, async function (req, res) {
    let result = await studentFeeDB.getMonthlyFeeBasedOnSelectedMonth(req.params.adharnumber, JSON.parse(req.user.configdata).session, req.user.accountid, req.params.selectedmonth);
    if (result.length > 0) {
        res.status(200).json({ status: 1, statusDescription: result });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to get month." });
    }
})
//pay student fee
router.post("/:adharnumber/paystudentfee", isAccountantOrTeacher, isStudentBelongsToSameSchool, async function (req, res) {
    let studentFeeObj = {
        monthName: req.body.monthName,
        selectedmonthfee: req.body.selectedmonthfee
    }
    let result = await studentFeeDB.payStudentFee(req.params.adharnumber, JSON.parse(req.user.configdata).session, studentFeeObj, req.body.feeObject);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: "Student fee has been submitted successfully." });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to submit the fee." });
    }
})
//get fee details by class
router.get("/:classid/:sectionid/getclassfeedetails", isAccountantOrTeacher, isClassBelongsToSameSchool, async function (req, res) {
    let result = await studentFeeDB.getclassfeedetails(JSON.parse(req.user.configdata).session, req.user.accountid, req.params.classid, req.params.sectionid);
    if (result.feeDetails.length > 0) {
        let resultObj = [];
        let fee = result.feeStructure[0];
        let totalFee = fee.january + fee.february + fee.march + fee.april + fee.may + fee.june + fee.july + fee.august + fee.september + fee.october + fee.november + fee.december;
        result.feeDetails.forEach(function (row) {
            let totalPaidFee = row.january + row.february + row.march + row.april + row.may + row.june + row.july + row.august + row.september + row.october + row.november + row.december;
            resultObj.push({
                name: encrypt.decrypt(row.firstname) + " " + encrypt.decrypt(row.lastname),
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
                totalFee: totalFee,
                paidfee: totalPaidFee,
                remainingfee: totalFee - totalPaidFee
            })
        })
        res.status(200).json({ status: 1, studentFeeDetails: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get fee details.' });
    }
})

//get student fee print details
router.get("/:adharnumber/getfeeprintdetails", isAccountantOrTeacher, isStudentBelongsToSameSchool, async function (req, res) {
    let result = await studentFeeDB.getFeeDetailsForPrint(req.params.adharnumber, JSON.parse(req.user.configdata).session, req.user.accountid);
    if (result.studentData.length > 0) {
        let freePrintData = {
            schoolName: result.school[0].accountname,
            schoolNumber: result.school[0].accountrefnumber,
            schoolAddress: result.school[0].accountaddress,
            studentName: encrypt.decrypt(result.studentData[0].firstname) + " " + encrypt.decrypt(result.studentData[0].lastname),
            adharNumber: result.studentData[0].adharnumber,
            cellNumber: encrypt.decrypt(result.studentData[0].cellnumber),
            dob: encrypt.decrypt(result.studentData[0].dob),
            motherName: result.studentData[0].mothername,
            fatherName: result.studentData[0].fathername,
            class: result.studentData[0].classid,
            section: result.studentData[0].section
        }
        res.status(200).json({ status: 1, statusDescription: freePrintData });
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able tpoo get the data." });
    }
})

//get students list of class
router.get("/getstudentslist/:classid/:section", async function (req, res) {
    let result = await studentFeeDB.getStudentsListOfClass(req.user.accountid, req.user.userid, req.params.classid, req.params.section, JSON.parse(req.user.configdata).session);
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
})
module.exports = router;