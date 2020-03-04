/*eslint-env node*/
var crypto = require('crypto');
var assert = require('assert');
var envVariable = require("../config/envValues.js");
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = envVariable.encryption.privatekey;
var xsrf = "svm";
var passwordHash = require('password-hash');


var base64url = require('base64url');


function encrypt(text) {
    if (text) {
        var cipher = crypto.createCipher(algorithm, key);
        return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    } else {
        return;
    }
}
exports.symEncrypt =(text,sym_key)=> {
    if (text) {
        var cipher = crypto.createCipher(algorithm, sym_key);
        return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    } else {
        return;
    }
}
exports.symDecrypt =(encryptedtext,sym_key)=> {
    if (encryptedtext) {
        var decipher = crypto.createDecipher('aes-256-cbc', sym_key);
        return decipher.update(encryptedtext, 'hex', 'utf8') + decipher.final('utf8');
    } else {
        return;
    }
}
exports.asymEncrypt = (payloadString, privateKey) => {
//   console.log(payloadString);
    var stringBuffer =  Buffer.from(payloadString, 'utf8');
    var encbuffer =  crypto.privateEncrypt(privateKey,stringBuffer);
    var hexString = encbuffer.toString('hex');
    return hexString;
   
   
  }
//console.log(encrypt('yadav.pushker@gmail.com'));
exports.asymDecrypt = (encryptedHexString, key) => { 
       var fromHexBuffer = Buffer.from(encryptedHexString,'hex');
    var decryptedStringBuffer = crypto.publicDecrypt(key,fromHexBuffer);
    var decryptedString = decryptedStringBuffer.toString('hex');
    return decryptedString;
  }
function decrypt(encryptedtext) {
    if (encryptedtext) {
        var decipher = crypto.createDecipher(algorithm, key);
        return decipher.update(encryptedtext, 'hex', 'utf8') + decipher.final('utf8');
    } else {
        return;
    }
}

function isequal(decrypted, text) {
    return assert.equal(decrypt(decrypted), text);
}

function computeHash(text) {
    // var intText = text.toString();
    var hash = crypto.createHash('md5').update(text).digest('hex');
    return hash;
}

function base64Encryption(plaintext) {
    if (plaintext) {
        var cipher = crypto.createCipher(algorithm, key);
        return base64url(cipher.update(plaintext, 'utf8') + cipher.final());
    } else {
        return;
    }
}

function base64Decryption(eneyptedtext) {
    if (eneyptedtext) {
        var decipher = crypto.createDecipher(algorithm, key);
        
        return  decipher.update(base64url.toBuffer(eneyptedtext),'base64' ,'utf8') + decipher.final();
    } else {
        return;
    }
}

function generateState (userid) {
    var now = Date.now();
    var state = [xsrf, now, userid].join(',');
    return encrypt(state);
}
function verifyState (state) {
    try {
        var plainState = decrypt(state),
            orgState = plainState.split(','),
            passedxsrf = orgState[0],
            passednow = orgState[1],
            now = Date.now(),
            timeDiff = ((now - passednow) / 1000) / 60;
        if (passedxsrf === xsrf && timeDiff <= 5) {
            return orgState[2];
        } else {
            return null;
        }

    } catch (ex) {
        console.log(ex)
        return null;
    }
}

function getHashedPassword(password) {
    var hashedpassword = passwordHash.generate(password);
    return hashedpassword;
}

//console.dir(computeHash('8622223531'));
exports.encrypt = encrypt;
exports.isequal = isequal;
exports.decrypt = decrypt;
exports.computeHash = computeHash;

exports.base64Encryption = base64Encryption;
exports.base64Decryption = base64Decryption;

exports.generateState = generateState;
exports.verifyState = verifyState;

exports.getHashedPassword = getHashedPassword;