// --- Library ---
const jwt                   = require('jsonwebtoken');
const crypto                = require('crypto');
const _                     = require('lodash');

// --- Model ---
const User                  = require('../../models/account/UserModel');
const LoginUser             = require('../../models/account/LoginUserModel');

// --- Controller ---

// --- Utils ---
const setUserInfo           = require('../../utils/helpers').setUserInfo;
const findUser              = require('../../utils/helpers').findUser;
const validation            = require('../../utils/validation');
const config                = require('../../config/main');
const lang                  = require('../../config/lang');

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: config.expiresIn // in seconds
    });
}

function findAdmin(users) {
    let found = null;
    _.map(users, (user) => {
        if (user.userID === config.admin.user) {
            found = user;
        }
    })
    return found;
}

exports.login = function (req, res, next) {

    if (req.user.error) {
        let statusCode = req.user.statusCode || 422;
        res.status(statusCode).send({ error: req.user.error });
    } 
    else{
        const userInfo = setUserInfo(req.user, req);
        console.log('enabled=', req.user.enabled);
        if ( req.user.enabled !== 'APPROVAL' ) {
            return res.status(403).json({ error: { userID: lang('unenabled_userID') } });
        }

        User
        .find()
        .exec(function(err, users) {
            if ( err ) { return next(err); }

            const admin = findAdmin(users);
            const user = findUser(users, req.user._id);
            
            if ( userInfo.userID === config.admin.user ) {
                if ( admin ) {
                    res.status(200).json({
                        token: `JWT ${generateToken(userInfo)}`,
                        user: userInfo,
                    });
                } else {
                    res.status(404).send({ error: { userID: lang('no_userID') } });
                }
            } else {
                if ( user ) {
                    let adminInfo = {
                        userID: admin.userID,
                        realName: admin.realName,
                        _id: admin._id
                    };
                    
                    res.status(200).json({
                        token: `JWT ${generateToken(userInfo)}`,
                        user: userInfo,
                        admin: adminInfo
                    });
                } else {
                    res.status(404).send({ error: { userID: lang('no_userID') } });
                }
            }
        });
    }
};

exports.register = function(req, res, next) {
    
    if ( !validation.validate(res, req.body, 
        ['realName', 'phoneNumber', 'email', 'height', 'weight', 'level', 'position'], 
        ['string', 'string', 'string', 'number', 'number', 'string', 'array']) ) { return; }

    const userID = req.body.userID;

    User.findOne({ userID }, (err, existingUser) => {
        if (err) { return next(err); }

        // If user is not unique, return error
        if (existingUser) {
            return res.status(422).send({ error: { userID: lang('in_use_userID') } });
        }

        const user = new User({
            userID: req.body.userID,
            password: req.body.password,
            realName: req.body.realName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            height: req.body.height,
            weight: req.body.weight,
            region: req.body.region,
            level: req.body.level,
            position: req.body.position,
            content: req.body.content,
            enabled: 'APPROVAL'
        });

        user.save((err, user) => {
            if (err) { return next(err); }

            const userInfo = setUserInfo(user, req);
            res.status(201).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: userInfo
            });
        });
    });
};

exports.logout = function(req, res, next) {
    const userID = req.user.userID;

    if ( !validation.validate_string(res, userID, lang('invalid_userID')) ) { return; }

    LoginUser
    .find({userID: userID})
    .remove((err, result)=>{
        if(err) return next(err);
        res.status(204).send({success: true});
    });
}