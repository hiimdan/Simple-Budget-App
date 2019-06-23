const express = require('express');
const path = require('path');
const passport = require('./passport/index');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: process.env.SECRET,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUnitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    })
}

mongoose.connect(process.env.DB);
mongoose.connection.once('open', () => {
    console.log('connected to database...');
});
mongoose.connection.on('error', () => {
    console.error('database connection error...');
});

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
})