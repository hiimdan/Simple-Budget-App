const express = require('express');
const router = express.Router();
const User = require('../database/users');
const bcrypt = require('bcrypt');
const passport = require('../passport/index');

router.post('/signup', (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({message: 'email is required'});
    }
    if (!req.body.username) {
        return res.status(400).json({message: 'username is required'});
    }
    if (!req.body.password || !req.body.passwordConfirm) {
        return res.status(400).json({message: 'password is required'});
    }
    if (req.body.password !== req.body.passwordConfirm) {
        return res.status(400).json({message: 'passwords do not match'});
    }

    User.findOne({username: req.body.username}, (err, user) => {
        if (err) { return next(err); }
        if (user) {
            res.json({message: 'user already exists'});
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) { return next(err); }
                let newUser = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: hash
                });
                newUser.save((err, doc) => {
                    if (err) { return next(err); }
                    res.json({message: 'success'});
                })
            })
        }
    })
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({
        username: req.user.username,
        categories: req.user.categories,
        transactions: req.user.transactions,
        theme: req.user.theme
    });
});

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.json({message: 'success'})
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

router.put('/changepassword', (req, res, next) => {
    if (req.user) {
        if (!req.body.password || !req.body.confirmPassword) {
            return res.status(400).json({message: 'password and confirmation password required'});
        }
        if (!req.body.newPassword) {
            return res.status(400).json({message: 'new password is required'});
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({message: 'password and confirmation password do not match'});
        }

        bcrypt.compare(req.body.password, req.user.password, (err, match) => {
            if (err) { return next(err); }
            if (match) {
                bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                    if (err) { return next(err); }
                    User.findByIdAndUpdate({_id: req.user._id}, {$set: {password: hash}}, err => {
                        if (err) { return next(err); }
                        res.json({message: 'success'});
                    })
                })
            } else {
                res.status(400).json({message: 'incorrect password'});
            }
        })
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

router.delete('/deleteaccount', (req, res, next) => {
    if (req.user) {
        if (!req.body.password) {
            return res.status(400).json({message: 'password required'});
        }

        bcrypt.compare(req.body.password, req.user.password, (err, match) => {
            if (err) { return next(err) }
            if (match) {
                User.findByIdAndDelete({_id: user._id}, err => {
                    if (err) { return next(err); }
                    res.json({message: 'success'});
                })
            } else {
                return res.status(400).json({message: 'incorrect password'});
            }
        })
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

module.exports = router;