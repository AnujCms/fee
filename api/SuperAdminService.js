const router = require('express').Router();
const superAdminDB = require("../database/SuperAdminDB.js");
const UserEnum = require('../lookup/UserEnum');
const encrypt = require("../utils/encrypt.js");
const uuid = require('uuid');
const EmailService = require('../EmailService/EmailService');

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

const isSuperAdminRole = function (req, res, next) {
    if (req.user.role === UserEnum.UserRoles.SuperAdmin) {
        return next();
    }
    res.status(403).json({ status: 0, statusDescription: "Not Authenticated user." });
};
//get all the schools
router.get("/all", isSuperAdminRole, async function (req, res) {
    let results = await superAdminDB.getAllAccountsForSuperAdmin();
    if (results.length > 0) {
        results.forEach(function (result) {
            result.accountname = result.accountname;
            result.accountid = result.accountid;
        });
        res.status(200).json({ status: 1, statusDescription: results });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the account list.' });
    }
});
//get teachers of selected account
router.get("/:accountid/teachersforselectedaccount/all", isSuperAdminRole, async function (req, res) {
    let results = await superAdminDB.getAllTeachersByAccountSuperAdmin(req.params.accountid);
    if (results.length > 0) {
        let teacherObj = [];
        results.forEach(function (result) {
            teacherObj.push({
                userid: result.userid,
                firstname: result.firstname,
                lastname: result.lastname,
                fullname: result.lastname + " " + result.firstname,
                cellnumber: encrypt.decrypt(result.cellnumber),
                emailid: encrypt.decrypt(result.emailid),
                userrole: getKeyByValue(UserEnum.UserRoles, result.userrole),
                status: getKeyByValue(UserEnum.UserStatus, result.status),
            })

        });
        res.status(200).json({ status: 1, statusDescription: teacherObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get teachers list.' });
    }
});
//get students of selected teacher by superAdmin
router.get("/:accountid/:teacherid/students", isSuperAdminRole, async function (req, res) {
    let result = await superAdminDB.getAllStudentsBySuperAdmin(req.params.teacherid);
    if (result.length > 0) {
        let studentObj = [];
        result.forEach(function (row) {
            studentObj.push({
                studentid: row.userid,
                firstname: encrypt.decrypt(row.firstname),
                lastname: encrypt.decrypt(row.lastname),
                mothername: row.mothername,
                fathername: row.fathername,
                cellnumber: encrypt.decrypt(row.cellnumber),
                roll: row.adharnumber,
                dob: encrypt.decrypt(row.dob),
                gender: row.gender,
                religion: row.religion,
                category: row.category,
                locality: row.locality,
                images: row.images
            });
        });
        res.status(200).json({ status: 1, statusDescription: studentObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get teachers list.' });
    }
});
//create school Admin
router.post("/createschooladmin", isSuperAdminRole, async function (req, res) {
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
    let data = req.body;
    var adminObj = {
        firstname: data.firstname,
        lastname: data.lastname,
        dob: encrypt.encrypt(data.dob),
        emailid: encrypt.encrypt(data.emailid),
        userrole: UserEnum.UserRoles.Principal,
        username: encrypt.computeHash(data.emailid),
        status: UserEnum.UserStatus.Active,
        cellnumber: encrypt.encrypt(data.cellnumber),
        adharnumber: data.adharnumber,

        gender: data.gender,
        session:data.session,
        password: encrypt.getHashedPassword(data.adharnumber),
        passwordchangecount: 0,
        images: encryptimg
    };

    var accountObj = {
        accountid: uuid.v1(),
        accountname: req.body.schoolname,
        accountrefnumber: req.body.registration,
        accountaddress: req.body.schooladdress,
        accountype: 1,
        status: 1
    }
    if (data.configType) {
        var configData = {
            accountid: accountObj.accountid,
            session: data.session,
            account: data.account,
            examination: data.examination,
            configType: data.configType,
            examoption: data.examoption
        };    
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
        You are registered as a Principal of ${req.body.schoolname}. Login with these credentials. If you have any issue to use the application then contact Super Admin.

        Regard:
        Edusamadhan`
      };
    var configdata = { "configdata": JSON.stringify(configData) }
    let result = await superAdminDB.createSchoolAdmin(adminObj, accountObj, configdata );
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'School account has been created successfully.' });
        EmailService.transporter.sendMail(mailOptions, function(error, info){});
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to create school account details.' });
    }
});
//update school information
router.put("/:accountid", isSuperAdminRole, async function (req, res) {
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
    let data = req.body;
    if (data.configType) {
        var configData = {
            session: data.session,
            account: data.account,
            examination: data.examination,
            configType: data.configType,
            examoption: data.examoption
        };
        var configdata = { "configdata": JSON.stringify(configData) }
    }
    var adminObj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        dob: encrypt.encrypt(data.dob),
        emailid: encrypt.encrypt(req.body.emailid),
        cellnumber: encrypt.encrypt(req.body.cellnumber),
        adharnumber: data.adharnumber,
        gender: data.gender,
        session:data.session,
        images: encryptimg
    };
    var accountObj = {
        accountname: req.body.schoolname,
        accountrefnumber: req.body.registration,
        accountaddress: req.body.schooladdress
    }
    let result = await superAdminDB.updateSchoolAdmin(req.params.accountid, adminObj, accountObj, configdata);
    if (result == 1) {
        res.status(200).json({ status: 1, statusDescription: 'School information has been updated successfully.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to update school details.' });
    }
});
//get the school account information for update
router.get("/:accountid/getschooldetails", isSuperAdminRole, async function (req, res) {
    let results = await superAdminDB.getSchoolAccountDetailsForUpdate(req.params.accountid);
    if (results.length > 0) {
        let schoolObj = [];
        results.forEach(function (result) {
            schoolObj.push({
                accountname:result.accountname,
                accountrefnumber:result.accountrefnumber,
                accountaddress:result.accountaddress,
                firstname: result.firstname,
                lastname: result.lastname,
                dob:encrypt.decrypt(result.dob),
                cellnumber: encrypt.decrypt(result.cellnumber),
                countrycode: result.countrycode,
                emailid: encrypt.decrypt(result.emailid),
                configdata: JSON.parse(result.configdata),
                adharnumber: result.adharnumber,
                gender:result.gender,
                session: result.session,
                images:result.images
            })
        });
        res.status(200).json({ status: 1, statusDescription: schoolObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the School details.' });
    }
});
//get all school admin details for manage account
router.get("/getallschooladmin", isSuperAdminRole, async function (req, res) {
    let results = await superAdminDB.getAllSchoolAdminDetailsForManage();
    if (results.length > 0) {
        let adminObj = [];
        results.forEach(function (result) {
            adminObj.push({
                accountid: result.accountid,
                status: result.status,
                accountname: result.accountname,
                accountrefnumber: result.accountrefnumber,
                firstname: result.firstname,
                lastname: result.lastname,
                cellnumber: encrypt.decrypt(result.cellnumber),
                emailid: encrypt.decrypt(result.emailid),
                images: result.images,
                adharnumber:result.adharnumber
            })
        });
        res.status(200).json({ status: 1, statusDescription: adminObj });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the School details.' });
    }
});

//Lock the account
router.put("/:accountid/lockaccount", isSuperAdminRole, async function (req, res) {
    let results = await superAdminDB.lockSchoolAdmin(req.params.accountid);
    if (results == 1) {
        res.status(200).json({ status: 1, statusDescription: 'School account has been successfully locked.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the School details.' });
    }
});
//UnLock the account
router.put("/:accountid/unlockaccount", isSuperAdminRole, async function (req, res) {
    let results = await superAdminDB.unlockSchoolAdmin(req.params.accountid);
    if (results == 1) {

        res.status(200).json({ status: 1, statusDescription: 'School account has been successfully unlocked.' });
    } else {
        res.status(200).json({ status: 0, statusDescription: 'Not able to get the School details.' });
    }
});

module.exports = router;