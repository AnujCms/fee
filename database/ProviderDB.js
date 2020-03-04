var db = require('./db.js');
var Promise = require('bluebird');

//save refresh token
exports.saveRefreshTokenForPortl = async function (userObj) {
    await db.query('insert into refreshTokenPortal SET ?', [userObj])
}
//get user details by refresh token
exports.getUserIdByRefershToken = async function (refreshToken) {
    let userID = await db.query('select userid from refreshTokenPortal where refreshToken = ?', [refreshToken]);
    return userID[0];
}
//get userDetails
exports.getUserDetails = async function (userid) {
    return db.transaction(async function (conn) {
    var results = await db.setQuery(conn, 'select * from userdetails where userid = ?', [userid]);
    if (results.length > 0) {
        if (results[0].userrole == 3 || results[0].userrole == 4 || results[0].userrole == 5) {
            var checkAdminStatus = await db.setQuery(conn, 'select status, accountAdmin from account where accountid = (select accountid from teacher_principal where userid = ?)', [results[0].userid]);
            if(checkAdminStatus[0].status == 1){
            var configdata = await db.setQuery(conn, 'select configdata, accountid from config c inner join account a on c.configid = a.configid where accountid = (select accountid from teacher_principal where userid = ?)',[results[0].userid]);
            results[0].configdata = configdata[0];
            return results;
            }else if(checkAdminStatus[0].status == 2) {
                let adminDetails = await db.setQuery(conn, 'select cellnumber, emailid  from userdetails where userid = ?', [checkAdminStatus[0].accountAdmin]);
                results[0].status = 3;
                results[0].cellnumber = adminDetails[0].cellnumber;
                results[0].emailid= adminDetails[0].emailid;
                return results;
            }
        }
        else if(results[0].userrole == 2 ){
            var details = await db.setQuery(conn, 'select configdata, accountid from config c inner join account a on c.configid = a.configid where accountAdmin = ?',[results[0].userid])
            if(details.length == 1){
                results[0].configdata = details[0];
                return results;
            }
            else{
                return results;
            }
        }
        else if(results[0].userrole == 6 || results[0].userrole == 7 ){
            var details = await db.setQuery(conn, "select configdata, accountid from config c inner join account a on c.configid = a.configid where accountid = (select accountid from teacher_principal where userid = (select teacherid from student_teacher where studentid = ?))",[results[0].userid])
            results[0].configdata = details[0];
            return results;
        }
        else if(results[0].userrole ==1){
            return results;
        }
    }
})
}

//updateRefreshTokenForPortl
exports.updateRefreshTokenForPortl = async function (refreshTokenObj, oldRefreshToken) {
    let result = await db.query('update refreshTokenPortal set ? where refreshToken = ?', [refreshTokenObj, oldRefreshToken])
    return result;
}
//get teacher Details
exports.getProviderDetails = async (userid) =>{
    var result = await db.query('select * from doctor where userid=?',[userid])
    return result
}
//Update teacher details
exports.updateOnboardDetails = async (nickname, img, userid) => {
    var result = await db.query('update doctor set nickname= ?, image = ? where userid = ?',[nickname, img, userid])
    return result
}
//delete profile photo
exports.deleteProfilePic = async (userid) => {
    var result = await db.query('update doctor set image = ? where userid = ?',[null, userid])
    return result
}

//lock the account
exports.wrongUserNameOrPassword = async function(emailid){
    var wrongpassword ;
    let getPreviousCount = await db.query('select wrongpasswordcount, userrole, userid from doctor where hashedemail = ?', [emailid]);
    console.log(getPreviousCount)
    if(getPreviousCount.length == 0){
        var re = {wrongpasswordcount:4}
        return re;
    }
    if(getPreviousCount[0].userrole == 3 || getPreviousCount[0].userrole == 4 || getPreviousCount[0].userrole == 2){
        var r = { wrongpasswordcount: getPreviousCount[0].wrongpasswordcount  }
        
        if(getPreviousCount[0].wrongpasswordcount == null || getPreviousCount[0].wrongpasswordcount == 0){
            wrongpassword = 1
        }else if(getPreviousCount[0].wrongpasswordcount == 1){ 
            wrongpassword = getPreviousCount[0].wrongpasswordcount + 1;  
        }
        else {
            if(getPreviousCount[0].wrongpasswordcount == 2){
            wrongpassword = getPreviousCount[0].wrongpasswordcount +1;
            await db.query('update doctor set status = ?, wrongpasswordcount = ? where hashedemail = ?',[4, wrongpassword, emailid]);
            var res = await db.query('select emailid, cellnumber, hashedemail from doctor where userid = (select accountAdmin from account where accountid = (select accountid from doctor_account where userid = ?))',[getPreviousCount[0].userid] );
            }
            else{res = await db.query('select emailid, cellnumber, hashedemail from doctor where userid = (select accountAdmin from account where accountid = (select accountid from doctor_account where userid = ?))',[getPreviousCount[0].userid] );}
           r.doctor = res[0];
            return r
        }
        if(wrongpassword == 1 || wrongpassword == 2){
            let result = await db.query('update doctor set wrongpasswordcount = ? where hashedemail = ?',[wrongpassword, emailid]);
        }
        return r
    }
    else{
        var re = {wrongpasswordcount:4}
        return re;
    }
}

exports.successLogin = async function(emailid){
    await db.query('update doctor set wrongpasswordcount = ? where hashedemail = ?',[0, emailid]);
}
exports.getProviderDetailsByEmailId = function(emailid){
    return new Promise( (resolve, reject) => {
        return db.query('select userid, firstname, lastname, cellnumber, emailid, userrole , permissionlevel from doctor where hashedemail = ?',[emailid])
        .then( (r) => {
            resolve(r);
        }).catch((ex) => {
            console.log(ex)
            reject(ex);
        });
    })
}

exports.createPasswordChangeRequest = function(passwordchangeReqObj){
    return new Promise( (resolve, reject) => {
        return db.query('insert into password_changerequest set ? ',[passwordchangeReqObj]).
        then((r) => {
            resolve();
        }).catch((ex) => {
            reject(ex);
        })

    })
}


exports.getPasswordChangeRequestByToken = function(token, currentDatetime){
    return new Promise( (resolve, reject) => {
        return db.query('select userid, initiatedby from password_changerequest where token = ? and expiredatetime >= ?',[token,currentDatetime])
        .then( (r) => {
            resolve(r);
        }).catch((ex) => {
            console.log(ex)
            reject(ex);
        });
    })
}


exports.setUserPasswordByUserId = function(userid, newpassword){
    return new Promise( (resolve, reject) => {
        return db.query('update doctor set password = ? where userid = ? ',[newpassword, userid]).
        then((r) => {
            resolve(r);
        }).catch((ex) => {
            console.log(ex)
            reject(ex);
        })

    })
}

exports.deletePasswordChangeRequest = function(token){
    return new Promise( (resolve, reject) => {
        return db.query('delete from  password_changerequest  where token = ? ',[token]).
        then((r) => {
            resolve(r);
        }).catch((ex) => {
            console.log(ex)
            console.log(ex)
            reject(ex);
        })

    })
}


exports.updateOnboardDetails = async ( image, userid) => {
    var result = await db.query('update doctor set image = ? where userid = ?',[ image,  userid])
    return result;
}
exports.checkpassword = async (userid) => {
    var result = await db.query('select password from doctor where userid = ?', [userid])
    return result[0]
}

exports.changePassword = async (password, userid) => {
    var result = await db.query('update doctor set password = ? where userid = ?', [password, userid])
    return result
}