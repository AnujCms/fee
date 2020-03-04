const router = require('express').Router();
const studentDB = require("../database/StudentDB.js");
const UserEnum = require('../lookup/UserEnum');
const encrypt = require("../utils/encrypt.js");

function isStudent(req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Student || req.user.role === UserEnum.UserRoles.EntranceStudent) {
        next();
    } else {
        return res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
    }
}
//get student details
router.get("/getstudentdetails", isStudent, async function (req, res) {
        let result = await studentDB.getStudentDetails(req.user.userid);
            if (result.length > 0) {
                var row = result[0]
                let resultObj = {
                    firstname: encrypt.decrypt(row.firstname),
                    lastname: encrypt.decrypt(row.lastname),
                    mothername: row.mothername,
                    fathername: row.fathername,
                    cellnumber: encrypt.decrypt(row.cellnumber),
                    dob: encrypt.decrypt(row.dob),
                    adharnumber: row.adharnumber,
                    userrole: row.userrole,
                    gender: row.gender,
                    religion: row.religion,
                    category: row.category,
                    locality: row.locality,
                    localaddress: row.localaddress,
                    parmanentaddress: row.parmanentaddress,
                    class: row.classid,
                    section: row.section,
                    session: row.session,
                    image: row.images
                }
                res.status(200).json({status:1, statusDescription:resultObj});
            } else {
                res.status(200).json({status:0, statusDescription:'Not able to get the student details.'});
            }
})
//get teacherid
router.get("/getteacherid", isStudent, async function (req, res) {
    let result = await studentDB.getTeacheridByStudent(req.user.userid);
        if (result.length > 0) {
            res.status(200).json({status:1, statusDescription:result[0].teacherid});
        } else {
            res.status(200).json({status:0, statusDescription:'Not able to get the student details.'});
        }
})
//Update student profile
router.post("/updateProfileDetails", isStudent, async (req, res) => {
    try {
        if( req.body.changePassword){
            var changePassword = req.body.changePassword;
            var oldPassword = req.body.oldPassword;
            var newPassword = req.body.newPassword
            var hashedpassword = passwordHash.generate(newPassword);
        }
        var img = req.body.image;

        var image;
        if (img == null) {
            image = img
        } else if (img.length == 0) {
            image = null
        } else {
            image = img
        }
        if (image == null) {
            let result = await studentDB.updateStudentImage(image, req.user.userid)
            if (result.affectedRows == 1) {
                if (changePassword) {
                    let result = await studentDB.checkpassword(req.user.userid);
                    if (!passwordHash.verify(oldPassword, result.password)) {
                        res.status(200).json({ status: 2, statusDescription: 'current password did not match' })
                    } else {
                        let changepassword = await studentDB.changePassword(hashedpassword, req.user.userid)
                        if (changepassword.affectedRows == 1) {
                            res.status(200).json({ status: 1, statusDescription: "Record has been updated successfully." })
                        } else {
                            return res.status(200).json({ status: 0, statusDescription: "Something went wrong." });
                        }
                    }
                }
                else {
                    res.status(200).json({ status: 1, statusDescription: "Record has been updated successfully." })
                }
                if (firstname == checkemail[0].firstname && lastname == checkemail[0].lastname) {
                    return
                } else {
                    // publisher.publishProviderUpdateToDefaultAdmin(publishEvent);
                }
            } else {
                return res.status(200).json({ status: 0, statusDescription: "Not able to update the data." });
            }
        } else {
            let encryptimg = img.replace(/^data:image\/[a-z]+;base64,/, "");
            let result = await studentDB.updateStudentImage(encryptimg, req.user.userid);
            if (result.affectedRows == 1) {
                if (changePassword) {
                    let result = await studentDB.checkpassword(req.user.userid);
                    if (!passwordHash.verify(oldPassword, result.password)) {
                        res.status(200).json({ status: 2, statusDescription: 'current password did not match' })
                    } else {
                        let changepassword = await studentDB.changePassword(hashedpassword, req.user.userid)
                        if (changepassword.affectedRows == 1) {
                            res.status(200).json({ status: 1, statusDescription: "Record has been updated successfully." })
                        } else {
                            return res.status(200).json({ status: 0, statusDescription: "Something went wrong." });
                        }
                    }
                }
                else {
                    res.status(200).json({ status: 1, statusDescription: "Record has been updated successfully." })
                }
            } else {
                return res.status(200).json({ status: 0, statusDescription: "FAIL TO UPDATE" });
            }
        }
    } catch (err) {
        res.status(200).json({
            status: 0,
            statusDescription: "Something Went Wrong."
        });
    }
})
//get Student fee details
router.get("/:adharnumber/studentfeedetails", isStudent, async function (req, res) {
    let result = await studentDB.getFeeDetailOfStudent(req.params.adharnumber, JSON.parse(req.user.configdata).session, req.user.accountid);
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
                    adharnumber: s.adharnumber,
                    religion: s.religion,
                    category: s.category,
                    locality: s.locality,
                    classid: s.classid,
                    section: s.section,
                    localaddress: s.localaddress,
                    parmanentaddress: s.parmanentaddress
                }
                if(result.feeStructure.length>0){
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
                }else {
                    studentFeeStructure = {}
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
                res.status(200).json({ status: 0, statusDescription: "Not able to get dtudent fee details." });
            }
})
//get Student Attendance for student
router.post("/:studentid/studentattendance", isStudent, async function (req, res) {
    let result = await studentDB.getAttendancesForStudent(req.user.teacherid, req.user.studentid,  JSON.parse(req.user.configdata).session);
            if (result.length > 0) {
                var resultObj = {
                    studentid: result[0].studentid,
                    january: result[0].january,
                    jtd: result[0].jtd,
                    jpd: result[0].jpd,
                    february: result[0].february,
                    ftd: result[0].ftd,
                    fpd: result[0].fpd,
                    march: result[0].march,
                    mtd: result[0].mtd,
                    mpd: result[0].mpd,
                    april: result[0].april,
                    atd: result[0].atd,
                    apd: result[0].apd,
                    may: result[0].may,
                    matd: result[0].matd,
                    mapd: result[0].mapd,
                    june: result[0].june,
                    juntd: result[0].juntd,
                    junpd: result[0].junpd,
                    july: result[0].july,
                    jultd: result[0].jultd,
                    julpd: result[0].julpd,
                    august: result[0].august,
                    autd: result[0].autd,
                    aupd: result[0].aupd,
                    september: result[0].september,
                    std: result[0].std,
                    spd: result[0].spd,
                    october: result[0].october,
                    otd: result[0].otd,
                    opd: result[0].opd,
                    november: result[0].november,
                    ntd: result[0].ntd,
                    npd: result[0].npd,
                    december: result[0].december,
                    dtd: result[0].dtd,
                    dpd: result[0].dpd
                };
                res.status(200).json({status:1, statusDescription:resultObj});
            } else {
                res.status(200).json({ status: 0, statusDescription: "Not able to get student attendance details." });
            }
})
//get assign subjects for student
router.post("/:studentid/assignsubjects", isStudent, async function (req, res) {
        let result = await studentDB.getAssignSubjectForStudent(req.user.studentclass);
            if (result.length > 0) {
                res.status(200).json({status:1, statusDescription:result});
            }else{
                res.status(200).json({ status: 0, statusDescription: "Not able to get student subjects details." });
            }

})
//get Student Result for Student
router.post("/:studentid/getresult", isStudent, async function (req, res) {
    let result = await studentDB.getStudentResultForStudent(req.user.teacherid, req.user.studentid);
            if (result.length > 0) {
                var resultObj = {
                    studentid: result[0].studentid,
                    hindi: result[0].hindi,
                    hindiobtainmarks: result[0].hindiobtainmarks,
                    english: result[0].english,
                    englishobtainmarks: result[0].englishobtainmarks,
                    math: result[0].math,
                    mathobtainmarks: result[0].mathobtainmarks,
                    science: result[0].science,
                    scienceobtainmarks: result[0].scienceobtainmarks,
                    history: result[0].history,
                    historyobtainmarks: result[0].historyobtainmarks,
                    physics: result[0].physics,
                    physcisobtainmarks: result[0].physcisobtainmarks,
                    chemistry: result[0].chemistry,
                    chemistryobtainmarks: result[0].chemistryobtainmarks
                };
                res.status(200).json({status:1, statusDescription:resultObj});
            } else {
                res.status(200).json({ status: 0, statusDescription: "Not able to get student result details." });
            }
})

module.exports = router;