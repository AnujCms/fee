var db = require('./db.js');
var UserEnum = require('../lookup/UserEnum');

//grt all accounts
exports.getAllAccountsForSuperAdmin = async function () {
    let result = await db.query('SELECT accountid, accountname from account where parentaccountid !="0"');
    return result;
}
exports.getAllProviderByAccountSuperAdminWithDetails = async function () {
    return db.transaction(async function (conn) {
    let account = await db.setQuery(conn, 'select accountid from account where parentaccountid = "0"');
    let result = await db.setQuery(conn, 'select a.status, a.accountid,a.accountname, a.accountrefnumber, a.accountype, a.createddatetime, d.userid, d.firstname, d.lastname, d.cellnumber, d.emailid from account a inner join account a1 on a.parentaccountid = a1.accountid inner join doctor d on a.accountadmin = d.userid where a.parentaccountid =  ?', [account[0].accountid]);
    return result;
    })
};
//get teachers for selected account
exports.getAllTeachersByAccountSuperAdmin = async function (accountid, callback) {
    let results = await db.query('SELECT d.userid, firstname, lastname, cellnumber, emailid, status, userrole from userdetails d INNER JOIN teacher_principal da where d.userid = da.userid and accountid = ? and d.status = ? and d.userrole = ?', [accountid, UserEnum.UserStatus.Active, UserEnum.UserRoles.Teacher]);
    return results;
}
//get students of selected teacher by superAdmin
exports.getAllStudentsBySuperAdmin = async function (teacherid) {
    return db.transaction(async function (conn) {
    let classData = await db.setQuery(conn, 'select classid, section, session from userdetails where userid = ?', teacherid);
    if (classData[0].classid) {
        var results = await db.setQuery(conn, 'CALL SQSP_GetPatientlist(?,?,?,?)', [classData[0].classid, classData[0].section, classData[0].session, teacherid]);
    }
    return JSON.parse(JSON.stringify(results[0]));
})
}
//Create School account                
exports.createSchoolAdmin = function (adminObj, accountObj, configdata) {
    return db.transaction(async function (conn) {
        let Results = await db.setQuery(conn, 'INSERT INTO userdetails SET ?', adminObj);
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
//update school information
exports.updateSchoolAdmin = function (accountId, adminObj, accountObj, configdata) {
    return db.transaction(async function (conn) {
        let userid = await db.setQuery(conn, 'select accountAdmin, configid from account where accountid = ?', accountId);
        let Results = await db.setQuery(conn, 'update account set ? where accountid = ?', [accountObj, accountId]);
        let upconfig = await db.setQuery(conn, 'update config SET ? where configid = ?', [configdata, userid[0].configid])
        let accountResult = await db.setQuery(conn, 'UPDATE userdetails SET ? where userid = ? and userrole = ?', [adminObj, userid[0].accountAdmin, UserEnum.UserRoles.Principal]);
        return accountResult.affectedRows;
    })
}
//get the school account information for update
exports.getSchoolAccountDetailsForUpdate = async function (accountid) {
    return db.query('select a.status, a.accountid,a.accountname, a.accountrefnumber, a.accountype,a.accountaddress, a.createddatetime , d.userid, d.dob, d.firstname, d.lastname, d.cellnumber, d.emailid,d.userrole,d.adharnumber, d.gender,d.session,d.images,c.configdata from account a  inner join userdetails d on a.accountadmin = d.userid inner join config c on a.configid = c.configid where a.accountid =  ?', [accountid]);
};
//get all school admin details for manage account
exports.getAllSchoolAdminDetailsForManage = async function () {
    return db.transaction(async function (conn) {
    let account = await db.setQuery(conn, 'select accountid from account where parentaccountid = "0"');
    let result = await db.setQuery(conn, 'select a.status, a.accountid,a.accountname, a.accountrefnumber, a.accountype, a.createddatetime, d.userid, d.firstname, d.lastname, d.cellnumber, d.emailid, d.images, d.adharnumber from account a inner join account a1 on a.parentaccountid = a1.accountid inner join userdetails d on a.accountadmin = d.userid where a.parentaccountid =  ?', [account[0].accountid]);
    return result;
    })
};
// Lock the admin
exports.lockSchoolAdmin = function (accountId) {
    return db.transaction(async function (conn) {
        let accountResult = await db.setQuery(conn, 'update account set status = ? where accountid = ?', [2, accountId]);
        let accountResulte = await db.setQuery(conn, 'update userdetails set status = ? where userid = (select accountAdmin from account where accountid = ?)', [2, accountId]);
        return accountResult.affectedRows;
    })
}
// UnLock the admin
exports.unlockSchoolAdmin = function (accountId) {
    return db.transaction(async function (conn) {
        let accountResult = await db.setQuery(conn, 'update account set status = ? where accountid = ?', [1, accountId]);
        let accountResulte = await db.setQuery(conn, 'update userdetails set status = ? where userid = (select accountAdmin from account where accountid = ?)', [1, accountId]);
        return accountResult.affectedRows;
    })
}

exports.changeDoctorPassword = async (newPassword) => {
    let result = await db.query('UPDATE userdetails SET password = ?, passwordchangecount=? where userid = ?', [newPassword.password,1, newPassword.userid]);
    return result.affectedRows;
}
exports.removeAccessTokenFromDB = async function (userid) {
    await db.query('DELETE FROM refreshTokenPortal WHERE userid=?', [userid])
}
exports.getUserIdByRefershToken = async function (refreshToken) {
    let userID = await db.query('select userid from refreshTokenPortal where refreshToken = ?', [refreshToken]);
    return userID[0];
}
exports.updateRefreshTokenForPortl = async function (refreshTokenObj, oldRefreshToken) {
    let result = await db.query('update refreshTokenPortal set ? where refreshToken = ?', [refreshTokenObj, oldRefreshToken])
    return result;
}