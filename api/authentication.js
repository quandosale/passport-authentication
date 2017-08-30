var express = require('express'),
    router = express.Router(),
    Util = require('../lib/util');


module.exports = function (passport) {
    router.post('/login', (req, res, next) => {
        passport.authenticate('login', (err, user, info) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Server Authentication Error...'
                });
                return next(err);
            }
            if (!user) {
                Util.responseHandler(res, false, info.message);
                return next(err);
            }
            req.login(user, loginErr => {
                if (loginErr) {
                    return next(loginErr);
                }
                return Util.responseHandler(res, true, "Login succeed", {email: user.email, token: user.token});
            });
        })(req, res, next);
    });

    router.post('/signup', (req, res, next) => {
        passport.authenticate('signup', (err, user, info) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Server Authentication Error...'
                });
                return next(err);
            }
            if(user) {
                Util.responseHandler(res, true, "Signup succeed", {email: user.email, token: user.token});
            } else {
                Util.responseHandler(res, false, info.message);
            }
        })(req, res, next);
    });

    return router;
}