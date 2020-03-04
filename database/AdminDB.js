/*eslint-env node*/

var db = require('./db.js');
encrypt = require("../utils/encrypt.js");
var UserEnum = require('../lookup/UserEnum')

exports.getAllAccounts = async function (userid) {
    let result = await db.query('SELECT accountid, accountname from account where accountadmin = ?', [userid]);
    return result;
}

exports.getAllAccountsForSuperAdmin = async function () {
    let result = await db.query('SELECT accountid, accountname from account');
    return result;
}

exports.getUserByUserId = async function (userid) {
    let result = await db.query('select userid, firstname, lastname, cellnumber, emailid, status, userrole, gender, class, subject, qualification, dob, parmanentaddress, localaddress from doctor where userid = ?', [userid]);
    return result;
}

exports.checkProviderByAccountID = async function (userid, accountid) {
    let result = await db.query('select EXISTS (select 1 from doctor_account where userid = ? and accountid = ?) as data', [userid, accountid]);
    if (result.length > 0 && result[0].data == 0) {
        return (new Error("there is no provider linked to this account"));
    } else
        return (result);
}
exports.checkPatientByProviderID = async function (teacherid, studentid) {
    let result = await db.query('select EXISTS (select 1 from student where studentid=? and (teacherid = (select teacherid from student where studentid = ?)))', [studentid, studentid]);
    if (result.length > 0 && result[0].data == 0) {
        return (new Error("there is no patient linked to this provider"));
    } else {
        return result;
    }
}
exports.checkPatientByCoworkerIDWithRead = async function (coworkerid, patientid) {
    let result = await db.query('select EXISTS (select 1 from patient where patientid = ? and (doctorid IN (select providerid from provider_coworker where coworkerid = ? ))) as data', [patientid, coworkerid]);
    if (result.length > 0 && result[0].data == 0) {
        reject(new Error("there is no patient linked to this coworker"));
    } else {
        return result;
    }
}

exports.updateProviderByUserId = async function (userid, userObj) {
    let results = await db.query('update doctor set ? where userid = ?', [userObj, userid]);
    return results.affectedRows;
}
//get assigned class
exports.getAssignedClass = async function (userid) {
    let results = await db.query('select class, section, session from doctor where userid = ?', [userid]);
    return results;
}
exports.createProvider = async function (providerObj, userid, accountid) {
    return new Promise((resolve, reject) => {
        return db.transaction(async function (conn) {
            return checkAdminWithAccount(userid, accountid).then(async function () {
                let Results = await db.setQuery(conn, 'INSERT INTO doctor SET ?', providerObj);
                var loopUpEntry = {
                    "accountid": accountid,
                    "userid": Results.insertId
                };
                return db.setQuery(conn, 'INSERT INTO doctor_account SET ?', loopUpEntry).then(function (result) {
                });
            });

        }).then(function (Results) {
            resolve(Results);

        }).catch(function (ex) {
            reject(ex);
        });
    })
}


function checkAdminWithAccount(userid, accountid) {
    return db.query('SELECT EXISTS (SELECT 1 from account where accountAdmin = ? and accountid = ? ) as isAccountExist', [userid, accountid]).then(function (results) {
        if (results[0].isAccountExist != 1) {
            throw "Account id does not belong to this admin";
        } else {
            return results[0].isAccountExist;
        }
    });
}

exports.checkAdminHasAccessToAccount = async function (userid, accountid) {
    let results = await db.query('SELECT EXISTS (SELECT 1 from account where accountAdmin = ? and accountid = ? ) as isAccountExist', [userid, accountid]);
    if (results[0].isAccountExist != 1) {
        return ("Account id does not belong to this admin");
    } else {
        return (results[0].isAccountExist);
    }
}


/** Loign methods */

exports.getProviderDetailsForUserName = async function (userName) {
    return db.transaction(async function (conn) {
    var results = await db.setQuery(conn, 'select * from userdetails where username = ?', [userName]);
    if(results.length > 0){
        if(results[0].userrole == 3 || results[0].userrole == 4 || results[0].userrole == 5){ 
            var checkAdminStatus = await db.setQuery(conn, 'select status, accountAdmin from account where accountid = (select accountid from teacher_principal where userid = ?)', [results[0].userid]);
            if(checkAdminStatus[0].status == 1){
            var configdata = await db.setQuery(conn, 'select configdata, accountid, accountname from config c inner join account a on c.configid = a.configid where accountid = (select accountid from teacher_principal where userid = ?)',[results[0].userid]);
            results[0].configdata = configdata[0];
            return results;
            }else if(checkAdminStatus[0].status == 2) {
                let adminDetails = await db.setQuery(conn, 'select cellnumber, emailid  from userdetails where userid = ?', [checkAdminStatus[0].accountAdmin]);
                var configdata = await db.setQuery(conn, 'select configdata, accountid, accountname from config c inner join account a on c.configid = a.configid where accountid = (select accountid from teacher_principal where userid = ?)',[results[0].userid]);
                results[0].configdata = configdata[0];
                results[0].status = 3;
                results[0].cellnumber = adminDetails[0].cellnumber;
                results[0].emailid= adminDetails[0].emailid;
                return results;
            }
        }
        else if(results[0].userrole == 2 ){
            var details = await db.setQuery(conn, 'select configdata, accountid, accountname from config c inner join account a on c.configid = a.configid where accountAdmin = ?',[results[0].userid])
            if(details.length == 1){
                results[0].configdata = details[0];
                return results;
            }
            else{
                return results;
            }
        }
        else if(results[0].userrole == 6 || results[0].userrole == 7||results[0].userrole == 9 ){
            var details = await db.setQuery(conn, "select configdata, accountid, accountname from config c inner join account a on c.configid = a.configid where accountid = (select accountid from teacher_principal where userid = (select teacherid from student_teacher where studentid = ?))",[results[0].userid])
            results[0].configdata = details[0];
            return results;
        }
        else if(results[0].userrole ==1){
            return results;
        }
    }
})
}

//get config
exports.getConfigByAccountId = function (accountid, userid) {
    return new Promise(function (resolve, reject) {
        return checkAdminWithAccount(userid, accountid).then(function () {
            return db.query('select configdata from config where configid = (select configid from account where accountid = ?)', [accountid]).then(function (results) {
                resolve(results);
            });
        }).catch(function (ex) {
            console.log(ex)
            reject(ex);
        })
    });
}

//get teachers
exports.getAllProviderByAccountSuperAdmin = function (accountid, callback) {
    return db.query('SELECT d.userid, firstname, lastname, cellnumber, emailid, status, userrole from doctor d INNER JOIN doctor_account da where d.userid = da.userid and accountid = ? and d.status = ? and d.userrole = ?', [accountid, UserEnum.UserStatus.Active, UserEnum.UserRoles.Provider]).then(function (results) {
        callback(null, results);
    }).catch(function (ex) {
        console.log(ex)
        callback(ex, null)
    })
}

exports.getAllProviderByAccountSuperAdminWithDetails = async function () {
    return db.transaction(async function (conn) {
    let account = await db.setQuery(conn, 'select accountid from account where parentaccountid = "0"');
    let result = await db.setQuery(conn, 'select a.status, a.accountid,a.accountname, a.accountrefnumber, a.accountype, a.createddatetime, d.userid, d.firstname, d.lastname, d.cellnumber, d.emailid from account a inner join account a1 on a.parentaccountid = a1.accountid inner join doctor d on a.accountadmin = d.userid where a.parentaccountid =  ?', [account[0].accountid]);
    return result;
    })
};

exports.getAccounDetailsByAccountId = async function (accountid) {
    return db.query('select a.status, a.accountid,a.accountname, a.accountrefnumber, a.accountype,a.accountaddress, a.createddatetime , d.userid, d.firstname, d.lastname, d.cellnumber, d.emailid,d.userrole,c.configdata from account a  inner join doctor d on a.accountadmin = d.userid inner join config c on a.configid = c.configid where a.accountid =  ?', [accountid]);
};
//Create School account                
exports.createSchoolAdmin = function (adminObj, accountObj, configdata) {
    return db.transaction(async function (conn) {
        let Results = await db.setQuery(conn, 'INSERT INTO doctor SET ?', adminObj);
        let adminid = Results.insertId;
        let accountID = await db.setQuery(conn, 'SELECT accountid from account where parentaccountid = "0" LIMIT 1');
        accountObj.parentaccountid = accountID[0].accountid;
        if (configdata != null) {
            let configResult = await db.setQuery(conn, 'INSERT INTO config set ?', configdata);
            let configid = configResult.insertId;
            accountObj.configid = configid;
        } else {
            accountObj.configid = 1;
        }
        accountObj.accountAdmin = adminid;
        let accountResult = await db.setQuery(conn, 'INSERT INTO account SET ?', accountObj);
        return accountResult.affectedRows;
    })
}

//update teacher account
exports.editSchoolAdmin = function (accountId, adminObj, accountObj, configdata) {
    return db.transaction(async function (conn) {
        let userid = await db.setQuery(conn, 'select accountAdmin, configid from account where accountid = ?', accountId);
        let Results = await db.setQuery(conn, 'update account set ? where accountid = ?', [accountObj, accountId]);
        let upconfig = await db.setQuery(conn, 'update config SET ? where configid = ?', [configdata, userid[0].configid])
        let accountResult = await db.setQuery(conn, 'UPDATE doctor SET ? where userid = ? and userrole = ?', [adminObj, userid[0].accountAdmin, UserEnum.UserRoles.AccountAdmin]);
        return accountResult.affectedRows;
    })
}
// Lock the admin
exports.lockSchoolAdmin = function (accountId) {
    return db.transaction(async function (conn) {
        let accountResult = await db.setQuery(conn, 'update account set status = ? where accountid = ?', [2, accountId]);
        let accountResulte = await db.setQuery(conn, 'update doctor set status = ? where userid = (select accountAdmin from account where accountid = ?)', [2, accountId]);
        return accountResult.affectedRows;
    })
}
// UnLock the admin
exports.unlockSchoolAdmin = function (accountId) {
    return db.transaction(async function (conn) {
        let accountResult = await db.setQuery(conn, 'update account set status = ? where accountid = ?', [1, accountId]);
        let accountResulte = await db.setQuery(conn, 'update doctor set status = ? where userid = (select accountAdmin from account where accountid = ?)', [1, accountId]);
        return accountResult.affectedRows;
    })
}
//Assign class to teacher
exports.assignClassToTeacher = async function (teacherid, classObject) {
    let result = await db.setQuery(conn, 'update doctor set ? where userid = ?', [classObject, teacherid]);
    return result.affectedRows
}
//Assign subject to Teacher
exports.assignSubjectToClass = async function (accountid, userid, classes, subjects) {
    return db.transaction(async function (conn) {
        let r = await db.setQuery(conn, 'select * from subjects where userid = ? and class = ?', [userid, classes]);
        var rArray = [];
        for (j = 0; j < r.length; j++) {
            rArray.push(r[j].subjects)
        }
        var deleteList = rArray.filter(function (item, pos) {
            return subjects.indexOf(item) !== pos
        })
        var insertList = subjects.filter(function (item, pos) {
            return rArray.indexOf(item) !== pos;
        })
        if (deleteList && deleteList.length > 0) {
            await db.setQuery(conn, 'delete from subjects where userid= ? and class = ?', [userid, classes]);
        }
        var bulkInsert = [];
        insertList.forEach(function (subjects) {
            bulkInsert.push([userid, subjects, classes])
        })
        let result = await db.setQuery(conn, 'insert into subjects(userid, subjects, class) values ?', [bulkInsert]);
        return result.affectedRows
    })
}
//Get subject For Teacher
exports.getSubjectForClass = async function (userid, classes) {
    return db.transaction(async function (conn) {
        let results = await db.setQuery(conn, 'select * from subjects where userid = ? and class = ?', [userid, classes]);
        return results
    })
}


function getAllProvidersByAccountId(accountid, userid, callback) {
    return checkAdminWithAccount(userid, accountid).then(function () {
        return db.query('SELECT d.userid, firstname, lastname, cellnumber, emailid, status, userrole, gender, class, section, subject, qualification from doctor d INNER JOIN doctor_account da where d.userid = da.userid and accountid = ? and d.status = ?', [accountid, UserEnum.UserStatus.Active]).then(function (results) {
            callback(null, results);
        })
    }).catch(function (ex) {
        console.log(ex)
        callback(ex, null)
    })
}

exports.updateYourPassword = async function(forgotObj) {
    let result = await db.query('update userdetails set password = ? where adharnumber = ? and cellnumber = ? and dob = ? and userrole = ?',[forgotObj.password, forgotObj.adharnumber, forgotObj.cellnumber, forgotObj.dob, forgotObj.userrole]);
    return result
}
exports.getAllProvidersByAccountId = getAllProvidersByAccountId;

