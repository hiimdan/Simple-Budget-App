const mongoose = require('mongoose');

let theme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'default'
    },
    main: {
        type: String,
        required: true,
        default: '#43bdff'
    },
    budgetBackground: {
        type: String,
        required: true,
        default: 'white'
    },
    transactionsHeader: {
        type: String,
        required: true,
        default: '#5194ff'
    },
    background: {
        type: String,
        required: true,
        default: 'white'
    },
    headerFont: {
        type: String,
        required: true,
        default: 'black'
    },
    mainFont: {
        type: String,
        required: true,
        default: 'black'
    },
    listTransactions: {
        type: String,
        required: true,
        default: 'white'
    },
    dashToggle: {
        primary: {
            type: String,
            required: true,
            default: 'rgb(183, 223, 247)'
        },
        secondary: {
            type: String,
            required: true,
            default: '#eff0f1a3'
        }
    }
})

let category = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        maxlength: 20
    },
    budgetAmt: {
        type: Number,
        required: true,
        min: 1
    }
});

let transaction = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

let user = new mongoose.Schema({
    categories: [category],
    transactions: [transaction],
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    theme: {
        type: theme,
        default: theme
    }
});


const User = mongoose.model('User', user);

module.exports = User;

