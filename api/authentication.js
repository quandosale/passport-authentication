var express = require('express'),
    router = express.Router();


module.exports = function (passport) {
    router.post('/login', (req, res, next) => {
        passport.authenticate('login', (err, user, info) => {
            console.log(err, user, info);
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'Server Authentication Error...'
                });
                return next(err);
            }
            if (!user) {
                res.send({
                    success: false,
                    message: 'Invalid username or password...'
                });
                return next(err);
            }
            req.login(user, loginErr => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.send({
                    success: true,
                    message: 'Successfully logged in...',
                    data: {
                        user: user
                    }
                });
            });
        })(req, res, next);
    });

    return router;
}