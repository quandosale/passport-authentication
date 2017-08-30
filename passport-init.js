var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy;
Util = require('./lib/util');
User = require('./model').User;

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            User.findOne({
                email: username,
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'User with the email does not exists.'
                    });
                }
                if (!Util.isValidPassword(user, password)) {
                    return done(null, false, {
                        message: 'Password does not match.'
                    });
                }
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
                email: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, {
                        message: 'User already exists.'
                    });
                }

                req.body.password = Util.createHash(password);
                req.body.token = Util.createHash(username);

                User.insertMany([req.body], (err, users) => {
                    if (err) return done(err);
                    else return done(null, users[0]);
                });
            });
        }
    ));

    passport.use(new BearerStrategy(
        function (token, done) {
            User.findOne({
                token: token
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user, {
                    scope: 'all'
                });
            });
        }
    ));
}