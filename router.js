const express               = require('express');
const passport              = require('passport');
const passportService       = require('./config/passport');

// Middleware to require login/auth
const requireAuth           = passport.authenticate('jwt', { session: false });
const requireLogin          = passport.authenticate('local', { session: false });

// --- System, Authentication ---
const AuthenticationCtrl    = require('./controllers/account/AuthenticationCtrl');
const UserCtrl              = require('./controllers/account/UserCtrl');
const LC                    = require('./controllers/account/LogCtrl');

// --- Main ---
const TeamCtrl              = require('./controllers/main/TeamCtrl');
const CourtCtrl             = require('./controllers/main/CourtCtrl');

// --- Other ---
const FileCtrl              = require('./controllers/other/FileCtrl');

module.exports = function (app) {
    
    // Initializing route groups
    const apiRoutes = express.Router();

    // ============================= //
    //     System, Authentication    //
    // ============================= //

    // Login && Register
    apiRoutes
        .get('/auth/is-authenticated',                  requireAuth, AuthenticationCtrl.login)
        .post('/auth/register',                         AuthenticationCtrl.register)
        .post('/auth/login',                            requireLogin, AuthenticationCtrl.login)
        .post('/auth/logout',                           requireAuth, AuthenticationCtrl.logout)

    // User
    apiRoutes
        .get('/user/fetchall',                          requireAuth, LC.regLog, UserCtrl.fetchAll)
        .get('/user/fetchone',                          requireAuth, LC.regLog, UserCtrl.fetchOne)
        .put('/user/updateone/:id',                     requireAuth, LC.regLog, UserCtrl.updateOne)
        .put('/user/resetpassword/:id',                 requireAuth, LC.regLog, UserCtrl.resetPassword)
        .delete('/user/:id',                             requireAuth, LC.regLog, UserCtrl.deleteOne)

    // Team
    apiRoutes
        .get('/team/fetchall',                          LC.regLog, TeamCtrl.fetchAll)
        .get('/team/fetchone',                          LC.regLog, TeamCtrl.fetchOne)
        .put('/team/updateone/:id',                     LC.regLog, TeamCtrl.updateOne)
        .post('/team/create',                           LC.regLog, TeamCtrl.create )
        .delete('/team/:id',                            LC.regLog, TeamCtrl.deleteOne)

    // Court
    apiRoutes
        .get('/court/fetchall',                         LC.regLog, CourtCtrl.fetchAll)
        .get('/court/fetchone',                         LC.regLog, CourtCtrl.fetchOne)
        .put('/court/update/:id',                       LC.regLog, CourtCtrl.updateOne)
        .post('/court/create',                          LC.regLog, CourtCtrl.create)
        .delete('/court/:id',                           LC.regLog, CourtCtrl.deleteOne)

    // File
    apiRoutes
        .post('/files/upload/public',                   FileCtrl.uploadPublicFiles)

    // ==================  Set url for API group routes ==================
    app.use('/api', apiRoutes);
};

