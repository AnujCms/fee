const router = require('express').Router();
const principalDB = require("../database/PrincipalDB.js");
const UserEnum = require('../lookup/UserEnum');
const EmailService = require('../EmailService/EmailService');

var isPrincipal = function (req, res, next) {
    if (req.user.role === UserEnum.UserRoles.Principal) {
        return next();
    } else {
        return res.status(200).json({ status: 0, statusDescription: "Unauthenticted user." });
    }
}
let checkTeacherBelongsToAccount = async function (req, res, next) {
    let result = await principalDB.checkProviderByAccountID(req.params.teacherid, req.user.accountid);
    if(result){
        next();
    }else{ 
        return res.status(200).json({ status: 0, statusDescription: "Principal and Teacher are not belongs to same account." });
    }  
}

//delete Users
router.get("/deleteusers/:teacherid", isPrincipal, checkTeacherBelongsToAccount, async function (req, res) {
    let results = await principalDB.deleteUsers(req.params.teacherid);
    if(results.affectedRows){
        res.status(200).json({status:1, statusDescription:"User has been deleted successfully."});
    }else{
        res.status(200).json({status:0, statusDescription:"Not able to delete user."});
    }
})
//unassignedclass
router.get("/unassignedclass/:teacherid", isPrincipal, checkTeacherBelongsToAccount, async function (req, res) {
    let results = await principalDB.unAssignedClass(req.params.teacherid);
    if(results.affectedRows){
        res.status(200).json({status:1, statusDescription:"Class has been unassigned successfully."});
    }else{
        res.status(200).json({status:0, statusDescription:"Not able to unassigned class."});
    }
})
//delete teacher
router.get("/deleteteacher/:teacherid", isPrincipal, checkTeacherBelongsToAccount, async function (req, res) {
    let results = await principalDB.deleteTeacher(req.params.teacherid);
    if(results.affectedRows){
        res.status(200).json({status:1, statusDescription:"Faculty has been deleted successfully."});
    }else{
        res.status(200).json({status:0, statusDescription:"You can not delete class teacher. You want to delete then first unassigned class."});
    }
})
//get account
router.get("/getAccountByPrincipal", isPrincipal, async function (req, res) {
    let results = await principalDB.getAllAccounts(req.user.userid);
    if(results.length > 0){
        results.forEach(function (result) {
            result.accountname = result.accountname;
            result.accountid = result.accountid
        });
        res.status(200).json({status:1, statusDescription:results});
    }else{
        res.status(200).json({status:0, statusDescription:'Not able to get the acoount.'});
    }
});
//get teachers of selected school
router.get("/:accountid/teachers", isPrincipal, async function (req, res) {
    let results = await principalDB.getAllProvidersByAccountId(req.params.accountid, req.user.userid);
    if (results.length > 0) {
        let teacherObj = [];
        results.forEach(function (result) {
            teacherObj.push({
                userid: result.userid,
                firstname: result.firstname,
                lastname: result.lastname,
                adharnumber:result.adharnumber,
                emailid: encrypt.decrypt(result.emailid),
                cellnumber: encrypt.decrypt(result.cellnumber),
                gender: result.gender,
                class: result.classid,
                qualification: result.qualification,
                userrole: result.userrole,
                subject: result.subject,
                section: result.section,
                images:result.images
            })
        });
        res.status(200).json({ status: 1, statusDescription: teacherObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the teachers details.' });
    }
});
//get students by superAdmin
router.get("/:accountid/:teacherid/students", isPrincipal, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await principalDB.getAllStudentsByPrincipal(req.params.teacherid);
    if (result.length > 0) {
        var resultObj = [];
        result.forEach(function (row) {
            resultObj.push({
                studentid: row.userid,
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
                images:row.images
            });
        });
        res.status(200).json({ status: 1, statusDescription: resultObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'There are no student found for this teacher.' });
    }
});
//get config Details
router.get("/:accountid/configDetails", isPrincipal, async function (req, res) {
    let results = await principalDB.getConfigByAccountId(req.params.accountid, req.user.userid);
    if (results) {
        res.status(200).json({ status: 1, statusDescription: results });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get config details' });
    }
});
//create teacher by principal
router.post("/:accountid/createteacher", isPrincipal, async function (req, res) {
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
    let teacherObj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        emailid: encrypt.encrypt(req.body.emailid),
        username: encrypt.computeHash(req.body.emailid),
        cellnumber: encrypt.encrypt(req.body.cellnumber),
        dob: encrypt.encrypt(req.body.dob),
        gender: req.body.gender,
        qualification: req.body.qualification,
        subject: req.body.subject,
        adharnumber: req.body.adharnumber,
        password: encrypt.getHashedPassword(req.body.adharnumber),
        parmanentaddress: req.body.parmanentaddress,
        localaddress: req.body.localaddress,
        userrole: req.body.userrole,
        status: 1,
        images: encryptimg,
        session:JSON.parse(req.user.configdata).session,
        classid: 0,
        section: 0
    };
    let userRole = '';
    if(req.body.userrole === 3){
        userRole = 'Faculty'
    }else if(req.body.userrole === 4){
        userRole = 'Examination Head'
    }else if(req.body.userrole === 5){
        userRole = 'Accountant'
    }
    let mailOptions = {
        from: req.body.emailid,
        to: req.body.emailid,
        subject: "Welcome Message",
        text: 
        `
        Name: ${req.body.firstname +" "+ req.body.lastname} 
        Cell Number: ${req.body.cellnumber} 
        Username: ${req.body.emailid}
        Password: ${req.body.adharnumber}
        You are registered as a ${userRole}. Login with these credentials. If you have any issue then contact your principal.

        Regard:
        Edusamadhan`
      };
    let result = await principalDB.createTeacher(teacherObj, req.user.userid, req.params.accountid);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: `${userRole} has been created successfully.` });
        EmailService.transporter.sendMail(mailOptions, function(error, info){});
    } else {
        res.status(200).json({ status: 0, statusDescription: `${userRole} is not created.` });
    }
});
//update teacher by principal
router.put("/:accountid/updateteacher/:teacherid", isPrincipal, checkTeacherBelongsToAccount, async function (req, res) {
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
    let teacherObj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        emailid: encrypt.encrypt(req.body.emailid),
        cellnumber: encrypt.encrypt(req.body.cellnumber),
        dob: encrypt.encrypt(req.body.dob),
        gender: req.body.gender,
        qualification: req.body.qualification,
        subject: req.body.subject,
        userrole: req.body.userrole,
        adharnumber: req.body.adharnumber,
        parmanentaddress: req.body.parmanentaddress,
        localaddress: req.body.localaddress,
        images:encryptimg
    };

    let result = await principalDB.updateTeacherDetails(req.params.teacherid, teacherObj);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'Teacher has been updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Teacher is not updated.' });
    }

});
//get teacher details for update by principal
router.get("/:accountid/getteacherdetailforupdate/:teacherid", isPrincipal, checkTeacherBelongsToAccount, async function (req, res) {
    let result = await principalDB.getTeacherDetailForUpdate(req.params.teacherid);
    if (result.length > 0) {
        let row = result[0];
        let teacherObj = {
            userid: row.userid,
            firstname: row.firstname,
            lastname: row.lastname,
            dob: encrypt.decrypt(row.dob),
            gender: row.gender,
            cellnumber: encrypt.decrypt(row.cellnumber),
            emailid: encrypt.decrypt(row.emailid),
            adharnumber: row.adharnumber,
            gender: row.gender,
            subject: row.subject,
            qualification: row.qualification,
            userrole: row.userrole,
            localaddress: row.localaddress,
            parmanentaddress: row.parmanentaddress,
            images:row.images
        };
        res.status(200).json({ status: 1, statusDescription: teacherObj })
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get teacher details.' })
    }
});
//get assigned class
router.get("/:accountid/:teacherid/getAssignedClass", isPrincipal, checkTeacherBelongsToAccount, async function (req, res) {
    let assignClass = await principalDB.getAssignedClass(req.params.teacherid);
    if (assignClass.length > 0) {
        res.status(200).json({ status: 1, statusDescription: assignClass });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the assign subjects.' });
    }

});
//assign class by principal
router.post("/:accountid/:teacherid/assignclass", isPrincipal, checkTeacherBelongsToAccount, async function (req, res) {
    let classObject = {
        classid: req.body.selectedClass,
        section: req.body.selectedSection
    }
    let result = await principalDB.assignClassToTeacher(req.params.teacherid, classObject);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'Class has been assign successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'This class and section is already assigned some other teacher.' });
    }
});
//get subjects by selected class
router.get("/:accountid/getsubjectsofselectedclass/:value", isPrincipal, async function (req, res) {
    let result = await principalDB.getSubjectForClass(req.user.userid, req.params.value);
    if (result.length > 0) {
        res.status(200).json({ status: 1, statusDescription: JSON.parse(result[0].subjects) });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Subjects are not assigned to this class. First assign the subject.' })
    }
})
//assign subjects to selected class
router.post("/:accountid/assignsubjectstoselectedclass", isPrincipal, async function (req, res) {
    let subjectObject ={
        userid: req.user.userid,
        class: req.body.selectedClass,
        subjects: JSON.stringify(req.body.subjectOptions)
    } 
    let result = await principalDB.assignSubjectToClass(subjectObject);
    if (result) {
        res.status(200).json({ status: 1, statusDescription: 'Subjects assigned to selected class successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'First add the subjects.' });
    }
});
//get teacher Details
router.get("/getPrincipalDetails", isPrincipal, async (req, res) => {
    let result = await principalDB.getPrincipalDetails(req.user.userid);
    if (result.length > 0) {
        var resultObj = {
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            cellnumber: encrypt.decrypt(result[0].cellnumber),
            emailid: encrypt.decrypt(result[0].emailid),
            parmanentaddress: result[0].parmanentaddress,
            localaddress: result[0].localaddress,
            image: result[0].images
        };
        res.status(200).json({ status: 1, statusDescription: resultObj })
    } else {
        res.status(200).json({ status: 0, statusDescription: "Not able to get the Teacher details." });
    }
})

module.exports = router;