const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');
const logfile = require('./logfile');
const config = require('../config/main');
// Set user info from request
exports.setUserInfo = function setUserInfo(user, req) {
  const getUserInfo = {
    _id: user._id,
    userID: user.userID,
    realName: user.realName,
    enabled: user.enabled,
    image: user.image,
  };
  return getUserInfo;
};

exports.getHash = function getHash(password, callback) {
  const SALT_FACTOR = 5;

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return callback(true, err);

    bcrypt.hash(password, salt, null, (err, hash) => {
      if (err) return callback(true, err);
      callback(false, hash);
    });
  });
}

exports.getClientIp = function(req) {
    return getClientIp(req); 
};

getClientIp = function(req) {
  try{
      let ipAddress = req.connection.remoteAddress;
      ipAddress = ipAddress.replace('::ffff:','');
      ipAddress = ipAddress.replace('::1','localhost');
      return ipAddress;
  } catch (err){
      logfile.saveLogFile('err', err);
  }  
};

exports.findUser = function(users, uid) {
  let found = null;
  _.map(users, (user) => {
      if (user._id.toString() == uid.toString()) {
          found = user;
      }
  })
  return found;
} 