// --- Library ---
const md5               = require('md5');
const async             = require('async');

// --- Model ---
const User              = require('../../models/account/UserModel');

// --- Controller ---

// --- Utils ---
const getHash           = require('../../utils/helpers').getHash;
const findUser          = require('../../utils/helpers').findUser;
const validation        = require('../../utils/validation');
const response          = require('../../utils/response');
const config            = require('../../config/main');
const lang              = require('../../config/lang');

exports.createAdmin = function () {
    console.log('register admin!');
    User
    .findOne(
        { userID: config.admin.user }, 
        (err, user) => {
            if (err) { 
                console.log('register admin failed!');
                return false; }
            if (!user) {
                console.log('not found user!!!');
                // if admin is not existing
                const user = new User({
                    userID: config.admin.user,
                    password: md5(config.admin.pass),
                    realName: config.admin.realName,
                    enabled: 'APPROVAL',
                });
            
                user.save((err, user) => {
                    if (err) { 
                        console.log('not saved admin!', err);
                        return false; }
                    console.log('Admin is successfully created');
                }); 
            }else{
                console.log('Admin is already existing');
            }
        }
    );
}

exports.fetchAll = function (req, res, next) {

    User
    .find({ userID: {$ne: config.admin.user} })
    .exec(function(err, users) {
        if (err) {
            res.status(400).json({ error: lang('fail_fetchall') });
            return next(err);
        }
        return res.status(200).json({
            users: users,
        });
    })
}

exports.fetchOne = function (req, res, next) {
    if ( !validation.validate(res, req.query, ['id'],['id']) ) { return; }

    User
    .find()
    .exec(function(err, users) {
        if ( err ) { 
            res.status(400).json({ error: lang('fail_fetchall') });
            return next(err);
        }
        const user = findUser(users, req.query.id);
        if ( user ) {
            return res.status(200).json({ user: user });
        } else {
            return res.status(404).json({ error: lang('res_404') });
        }
    });
}

exports.updateOne = function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    if ( !validation.validate_id(res, id, lang('invalid_ID')) ) { return; }
    if ( !validation.validate(res, data, 
        ['realName', 'phoneNumber', 'email', 'height', 'weight', 'region', 'position', 'recommended', 'invited'],
        ['string', 'string', 'string', 'number', 'number', 'array', 'array', 'boolean', 'boolean']) ) { return; }

    User
    .update(
        { _id: id }, 
        { 
            realName: data.realName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            height: data.height,
            weight: data.weight,
            region: data.region,
            image: data.image,
            content: data.content,
            recommended: data.recommended,
            invited: data.invited
        },
        { upsert: true },
        (err, doc) => {
            if (err) { return next(err); }
            response.update_response(res, doc);
        }
    );
}

exports.resetPassword = function (req, res, next) {
    const id = req.params.id;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    if ( !validation.validate_id(res, id, lang('invalid_id')) ) { return; }
    if ( !validation.validate_password(res, newPassword, lang('invalid_password')) ) { return; }
    if ( !validation.validate_password(res, oldPassword, lang('invalid_password')) ) { return; }

    User
    .find()
    .exec(function(err, users) {
        if ( err ) { 
            res.status(400).json({ error: lang('fail_fetchall') });
            return next(err);
        }
        const user = findUser(users, id);
        user.comparePassword(oldPassword, (err, isMatch) => {
            if (err) { return next(err); }
            if (!isMatch) { 
                return res.status(404).json({ error: lang('invalid_old_password') });
            } else {
                getHash(newPassword, (err, hash) => {
                    if (err) {
                        return res.status(400).json({ error: lang('fail_hash') });
                    } else {
                        User.update(
                            { _id: id },
                            {
                                password: hash
                            },
                            (err, doc) => {
                                if (err) { return next(err); }
                                response.update_response(res, doc);
                            }
                        );
                    }
                });
            }
        });
    });

    
}

exports.deleteOne = function (req, res, next) {
    const id = req.params.id;

    if ( !validation.validate_id(res, id, lang('invalid_id')) ) { return; }

    User.deleteOne(
        { _id: id }, 
        (err, doc) => {
            if ( err ) { return next(err); }
            response.delete_response(res, doc);
        }
    );
}