var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('./model').User;

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.token);
    });

    passport.deserializeUser(function (id, done) {
        User.findByToken(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                // if (!user.validPassword(password)) {
                //     return done(null, false, {
                //         message: 'Incorrect password.'
                //     });
                // }
                return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                return done(null, user);
            });
        }
    ));
}