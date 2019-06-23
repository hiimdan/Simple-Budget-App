const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../database/users');

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false, {message: 'incorrect username'}); }
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) { return done(err); }
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'incorrect password'});
                }
            })
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findOne({_id: id}, (err, user) => {
        done(err, user);
    })
});

module.exports = passport;