const passwordHash = require('password-hash');
const encrypt = require("./utils/encrypt.js");
const AdminDB = require("./database/AdminDB");
const UserEnum = require('./lookup/UserEnum');
const envVariable = require("./config/envValues.js");
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy,
secretOrKey = envVariable.sessionSecretForMobile;

function configLocalAuth(passport) {
    let LocalStrategy = require('passport-local').Strategy;
    passport.serializeUser(function (user, done) {
        done(null, {
            userid: user.userid,
            firstname: user.firstname,
            role: user.role,
            lastname: user.lastname,
            issuerid: user.issuerid,
            accountid:user.accountid,
            configdata: user.configdata
        });
    });

    passport.deserializeUser(function (userObjFromSession, done) {
        done(null, userObjFromSession);
    });

    passport.use('login',
        new LocalStrategy({
            passReqToCallback: true
        },
            async function (req, username, password, done) {
                try {
                    var hashedEmail = encrypt.computeHash(username);
                    let result = await AdminDB.getProviderDetailsForUserName(hashedEmail);
                    if (result === undefined) {
                        return done(null, false);
                    } else {
                        var obj = result[0];
                        var user = {
                            'email': encrypt.decrypt(obj.emailid),
                            'hashedPassword': obj.password,
                            'userid': obj.userid,
                            'firstname': obj.firstname,
                            'lastname': obj.lastname,
                            'cellnumber': encrypt.decrypt(obj.cellnumber),
                            'passwordchangecount': obj.passwordchangecount,
                            'userrole': obj.userrole,
                            'status': obj.status,
                            'adharnumber': obj.adharnumber,
                            'image': obj.images,
                        };
                        if(obj.userrole !== 1){
                                user.configdata = obj.configdata.configdata,
                                user.accountid = obj.configdata.accountid,
                                user.accountname = obj.configdata.accountname
                        }
                        if (obj.userrole == 6 || obj.userrole == 7 || obj.userrole == 9) {
                            user.studentname = encrypt.decrypt(obj.firstname) + " " + encrypt.decrypt(obj.lastname);
                            user.firstname = encrypt.decrypt(obj.firstname)
                        }
                        if (!passwordHash.verify(password, user.hashedPassword)) {
                            return done(null, false);
                        }
                        if (user.passwordchangecount === null || user.passwordchangecount === 0) {
                            user.role = UserEnum.UserRoles.FirstTime; // user without password changed
                        }
                        else {
                            user.role = user.userrole;
                        }
                        if (user.status === 1) {
                            return done(null, user);
                        }
                        else if (user.status === 2) {
                            return done(null, 2);
                        } else if (user.status == 3) {
                            return done(null, user);
                        }
                        else { return done(null, false); }
                    }
                } catch (ex) {
                    console.log(ex)
                    return done(ex, false);
                }
            }));
            var opts = {}
            opts.jwtFromRequest = ExtractJwt.fromHeader('x-access-token');
            opts.secretOrKey = secretOrKey;

        passport.use('nonPatientJWT',new JwtStrategy(opts, function(jwt_payload, done) {
            done(null,jwt_payload.user);
        }));

}
module.exports = configLocalAuth;