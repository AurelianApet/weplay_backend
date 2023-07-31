// --- Model ---
const Log                   = require('../../models/account/LogModel');

// --- Utils ---
const helpers               = require('../../utils/helpers');

exports.regLog = function (req, res, next) {
    const log = new Log({
        ip: helpers.getClientIp(req) || '',
        uid: (req.user && req.user._id ? req.user._id.toString() : 'unknown') || 'unknown',
        url: req.originalUrl || '',
        action: req.method || '',
        did: JSON.stringify(req.params) || '',
    });    
    log.save((err, created) => {
        if(err) return next(err);
    });    
    next();
};