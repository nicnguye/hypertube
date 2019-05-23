const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const fileUpload = require('express-fileupload')
const passport = require('passport');
const auth = require('./src/routes/auth');
auth(passport);
const auth42 = require('./src/routes/auth42');
auth42(passport);
const initCron = require('./cron');


const mongoDB = 'mongodb://localhost:27017/HyperTube';

mongoose.connect(mongoDB, {useNewUrlParser: true})
let db = mongoose.connection

// Check  connection
db.once('open', function () {
  console.log('Connected to MongoDB')
})

// Check for db errors
db.on('error', function () {
  console.log('error')
})

initCron();

const app = express();

let User = require('./src/models/user')

// let user = new User();
// user.lastName = 'demeaux';
// user.save();

app.use(passport.initialize());

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(fileUpload());

app.get('/users/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/users/42', passport.authenticate('42'));

app.use('/users', require('./src/routes/users'));
app.use('/register', require('./src/routes/registerCheck'));
app.use('/confirmation', require('./src/routes/confirmation'));
app.use('/getUser', require('./src/routes/getUser'));
app.use('/addDescription', require('./src/routes/addDescription'));
app.use('/updateUser', require('./src/routes/updateUser'));
app.use('/getOtherUsers', require('./src/routes/getOtherUsers'));
app.use('/getMovieSuggestions', require('./src/routes/getMovieSuggestions'));
app.use('/movie', require('./src/routes/movie'));
app.use('/torrentStream', require('./src/routes/torrentStream'));


const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
