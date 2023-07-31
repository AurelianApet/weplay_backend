// Importing Passport, strategies, and config
const passport = require('passport'),
  User = require('../models/account/UserModel'),
  config = require('./main'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local');

const lang = require('./lang');
// Setting username field to userID rather than username
const localOptions = {
  usernameField: 'userID'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, (userID, password, done) => {
  User.findOne({ userID }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, { 
      error: { userID: lang('no_userID')},
      statusCode: 460,
    }); }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, {
        error: { password: lang('incorrect_password')},
        statusCode: 461,
      }); }
      return done(null, user);
    });
  });
});

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secret

  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload._id, (err, user) => {
    if (err) { 
      return done(err, false); 
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
