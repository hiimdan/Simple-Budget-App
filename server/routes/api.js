const express = require('express');
const router = express.Router();
const User = require('../database/users');

router.get('/getuser', (req, res) => {
    if (req.user) {
        res.json({
            username: req.user.username,
            categories: req.user.categories,
            transactions: req.user.transactions,
            theme: req.user.theme
        });
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
});

router.post('/addbudget', (req, res, next) => {
    if (req.user) {
        console.log(req.body);
        if (!req.body.category) {
            return res.status(400).json({message: 'category is required'});
        }
        if (!req.body.budgetAmt) {
            return res.status(400).json({message: 'budget is required'});
        }
        if (!req.body._id) {
            return res.status(400).json({message: 'budget id is required'});
        }

        User.findById({_id: req.user._id}, (err, doc) => {
            if (err) { return next(err); }
            doc.categories.forEach(c => {
                if (c.category === req.body.category) {
                    return res.status(400).json({message: 'category already exists'});
                }
            })
            doc.categories.push({
                _id: req.body._id,
                category: req.body.category,
                budgetAmt: req.body.budgetAmt
            });
            doc.save(err => {
                if (err) { return next(err) }
                res.json({message: 'success'});
            })
        })

    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

router.post('/addtransaction', (req, res, next) => {
    if (req.user) {
        console.log(req.body)
        if (!req.body.date) {
            return res.status(400).json({message: 'date is required'});
        }
        if (!req.body.amount) {
            return res.status(400).json({message: 'transaction amount required'});
        }
        if (!req.body.category) {
            return res.status(400).json({message: 'category is required'});
        }
        if (!req.body._id) {
            return res.status(400).json({message: 'transaction id is required'});
        }
        if (isNaN(Date.parse(req.body.date))) {
            return res.status(400).json({message: 'unrecognized date format'});
        }

        User.findById({_id: req.user._id}, (err, doc) => {
            if (err) { return next(err); }
            doc.transactions.unshift({
                _id: req.body._id,
                date: new Date(req.body.date),
                category: req.body.category,
                amount: req.body.amount
            });
            doc.save(err => {
                if (err) { return next(err); }
                res.json({message: 'success'});
            })
        })
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

router.put('/edittransaction', (req, res, next) => {
    if (req.user) {
        if (!req.body.date) {
            return res.status(400).json({message: 'date is required'});
        }
        if (!req.body.amount) {
            return res.status(400).json({message: 'amount is required'});
        }
        if (!req.body.category) {
            return res.status(400).json({message: 'category is required'});
        }
        if (!req.body._id) {
            return res.status(400).json({message: 'id is required'});
        }
        if (isNaN(Date.parse(req.body.date))) {
            return res.status(400).json({message: 'unrecognized date format'});
        }

        User.findById({_id: req.user._id}, (err, doc) => {
            if (err) { return next(err); }
            let tx = doc.transactions.id(req.body._id);
            if (!tx) {
                return res.status(400).json({message: 'no transaction with id ' + req.body._id});
            }

            tx.date = new Date(req.body.date);
            tx.amount = req.body.amount;
            tx.category = req.body.category;

            doc.save(err => {
                if (err) { return next(err); }
                res.json({message: 'success'});
            })
        })

    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

router.put('/editbudget', (req, res, next) => {
    if (req.user) {
        if (!req.body._id) {
            return res.status(400).json({message: 'id is required'});
        }
        if (!req.body.amount) {
            return res.status(400).json({message: 'amount is required'});
        }

        User.findById({_id: req.user._id}, (err, doc) => {
            if (err) { return next(err); }
            let budget = doc.categories.id(req.body._id);
            if (!budget) {
                return res.status(400).json({message: 'no budget with id ' + req.body._id});
            }

            budget.budgetAmt = req.body.amount;
            doc.save(err => {
                if (err) { return next(err); }
                res.json({message: 'success'});
            })
        })
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

router.delete('/deletetransaction', (req, res, next) => {
    if (req.user) {
        if (!req.body._id) {
            return res.status(400).json({message: 'id is required'});
        }

        User.findById({_id: req.user._id}, (err, doc) => {
            if (err) { return next(err); }
            let tx = doc.transactions.id(req.body._id);
            if (!tx) {
                return res.status(400).json({message: 'no transaction with id ' + req.body._id});
            }
            tx.remove();
            doc.save(err => {
                if (err) { return next(err); }
                res.json({message: 'success'});
            })
        })
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

router.delete('/removebudget', (req, res, next) => {
    if (req.user) {
        if (!req.body._id) {
            return res.status(400).json({message: 'id is required'});
        }

        User.findById({_id: req.user._id}, (err, doc) => {
            if (err) { return next(err); }

            let budget = doc.categories.id(req.body._id);
            if (!budget) {
                return res.status(400).json({message: 'no budget with id ' + req.body._id});
            }

            budget.remove();
            doc.save(err => {
                if (err) { return next(err); }
                res.json({message: 'success'});
            })
        })
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

router.put('/settheme', (req, res, next) => {
    if (req.user) {
        User.findByIdAndUpdate({_id: req.user._id}, {$set: {theme: req.body}}, {runValidators: true}, err => {
            if (err) { return next(err); }
            res.json({message: 'success'});
        })
    } else {
        res.status(400).json({message: 'no user logged in'});
    }
})

module.exports = router;