// --- Library ---

// --- Model ---
const Team                  = require('../../models/main/TeamModel');

// --- Controller ---

// --- Utils ---
const validation            = require('../../utils/validation');
const response              = require('../../utils/response');
const lang                  = require('../../config/lang');

exports.fetchAll = function(req, res, next) {
    Team
    .find()
    .exec(function(err, docs) {
        if (err) {
            res.status(400).json({ error: lang('fail_fetchall') });
            return next(err);
        }
        return res.status(200).json({
            team: docs
        });
    })
}

exports.fetchOne = function(req, res, next) {
    const id = req.query.id;

    if ( !validation.validate_id(res, id, lang('invalid_id')) ) { return; }

    Team
    .find({
        _id: id
    })
    .exec(function(err, doc) {
        if ( err ) { 
            res.status(400).json({ error: lang('fail_fetchall') });
            return next(err); 
        }
        return res.status(200).json({
            team: doc
        });
    });
}

exports.create = function (req, res, next) {
    const data = req.body;

    if ( !validation.validate(res, data, 
        ['captain', 'name', 'schedule', 'courtName', 'recommended', 'challenged'],
        ['id', 'string', 'array', 'string', 'boolean', 'boolean']) ) { return; }
    
    const team = new Team({
        captain: data.captain,
        name: data.name,
        subName: data.subName,
        schedule: data.schedule,
        requestItems: data.requestItems,
        uniformColor: data.uniformColor,
        content: data.content,
        courtName: data.courtName,
        courtAddress: data.courtAddress,
        courtAddressDetail: data.courtAddressDetail,
        logo: data.logo,
        image: data.image,
        recommended: data.recommended,
        challenged: data.challenged,
    });

    team.save((err, created) => {
        if (err) { return next(err); }
        res.status(200).json({
            team: created
        });
    }); 
}

exports.updateOne = function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    if ( !validation.validate_id(res, id, lang('invalid_ID')) ) { return; }
    if ( !validation.validate(res, data, 
        ['name', 'schedule', 'courtName', 'recommended', 'challenged'],
        ['string', 'array', 'string', 'boolean', 'boolean']) ) { return; }

    Team
    .update(
        { _id: id }, 
        { 
            name: data.name,
            subName: data.subName,
            schedule: data.schedule,
            requestItems: data.requestItems,
            uniformColor: data.uniformColor,
            content: data.content,
            courtName: data.courtName,
            courtAddress: data.courtAddress,
            courtAddressDetail: data.courtAddressDetail,
            logo: data.logo,
            image: data.image,
            recommended: data.recommended,
            challenged: data.challenged
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

    Team.deleteOne(
        { _id: id }, 
        (err, doc) => {
            if ( err ) { return next(err); }
            response.delete_response(res, doc);
        }
    );
}