// --- Library ---

// --- Model ---
const Court                  = require('../../models/main/CourtModel');

// --- Controller ---

// --- Utils ---
const validation            = require('../../utils/validation');
const response              = require('../../utils/response');
const lang                  = require('../../config/lang');

exports.fetchAll = function(req, res, next) {
    Court
    .find()
    .exec(function(err, docs) {
        if (err) {
            res.status(400).json({ error: lang('fail_fetchall') });
            return next(err);
        }
        return res.status(200).json({
            court: docs
        });
    })
}

exports.fetchOne = function(req, res, next) {
    const id = req.query.id;

    if ( !validation.validate_id(res, id, lang('invalid_id')) ) { return; }

    Court
    .find({
        _id: id
    })
    .exec(function(err, doc) {
        if ( err ) { 
            res.status(400).json({ error: lang('fail_fetchall') });
            return next(err); 
        }
        return res.status(200).json({
            court: doc
        });
    });
}

exports.create = function (req, res, next) {
    const data = req.body;

    if ( !validation.validate(res, data, 
        ['uid', 'businessNumber', 'callNumber', 'address', 'businessTime'],
        ['id', 'string', 'string', 'string', 'array']) ) { return; }
    
    const court = new Court({
        uid: data.uid,
        businessNumber: data.businessNumber,
        callNumber: data.callNumber,
        address: data.address,
        businessTime: data.businessTime,
        info: data.info,
        price: data.price,
        equipments: data.equipments,
        image: data.image,
        courtImage: data.courtImage,
        lightImage: data.lightImage,
        showerImage: data.showerImage,
        enabled: 'WAIT'
    });

    court.save((err, created) => {
        if (err) { return next(err); }
        res.status(200).json({
            court: created
        });
    }); 
}

exports.updateOne = function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    if ( !validation.validate_id(res, id, lang('invalid_ID')) ) { return; }
    if ( !validation.validate(res, data, 
        ['uid', 'businessNumber', 'callNumber', 'address', 'businessTime'],
        ['id', 'string', 'string', 'string', 'array']) ) { return; }

    Court
    .update(
        { _id: id }, 
        { 
            businessNumber: data.businessNumber,
            callNumber: data.callNumber,
            address: data.address,
            businessTime: data.businessTime,
            info: data.info,
            price: data.price,
            equipments: data.equipments,
            image: data.image,
            courtImage: data.courtImage,
            lightImage: data.lightImage,
            showerImage: data.showerImage,
        },
        { upsert: true },
        (err, doc) => {
            if (err) { return next(err); }
            response.update_response(res, doc);
        }
    );
}

exports.deleteOne = function (req, res, next) {
    const id = req.params.id;

    if ( !validation.validate_id(res, id, lang('invalid_id')) ) { return; }

    Court.deleteOne(
        { _id: id }, 
        (err, doc) => {
            if ( err ) { return next(err); }
            response.delete_response(res, doc);
        }
    );
}