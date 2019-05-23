const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const faker = require('faker');
const fs = require('fs');
const checkLog = require('../middlewares/checkLog');
const mongoose = require('mongoose');

// Bring in user models
let User = require('../models/user.js');
let Token = require('../models/registrationToken.js');

// check email validity throught router.post('/')
function checkEmailValidity(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

// Add Submit POST Route
router.post('/', asyncHandler(async(req, res) => {
  let username = req.body.username;
  let lastName = req.body.lastName;
  let firstName = req.body.firstName;
  let emailAddress = req.body.emailAddress;
  let password = req.body.password;
  let passwordConfirmation = req.body.passwordConfirmation;

  if (!username || !emailAddress || !password)
    res.status(203).send("One of the field is missing");
  else if (password !== passwordConfirmation)
    res.status(203).send("The passwords aren't identicals");
  else if (password.length <= 6)
    res.status(203).send("The password is too short");
  else if (!checkEmailValidity(emailAddress))
    res.status(203).send("Email address is invalid")
  else {
    let usernameExists = await User.findOne({username: username});
    let emailAddressExist = await User.findOne({emailAddress:emailAddress})
    if (usernameExists)
      res.status(203).send("This username is already in use");
    else if (emailAddressExist)
      res.status(203).send("This emailAddress is already in use");
    else {
      let user = new User();
      user.username = username;
      user.emailAddress = emailAddress;
      user.lastName = lastName;
      user.firstName = firstName;
      user.password = bcrypt.hashSync(password, 10);
      user.isVerified = false;
      user.description = null;
      var token = new Token({_userId: user._id, token: crypto.randomBytes(16).toString('hex')});
      await user.save();
      await token.save();
      var transporter = nodemailer.createTransport({ service: 'Hotmail', auth: { user: "olivierdem_218@hotmail.com", pass: "Nietzsche1"} });
      var mailOptions = { from: 'olivierdem_218@hotmail.com', to: user.emailAddress, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/localhost:8080' + '\/confirmation\/' + token.token + '.\n' };
      transporter.sendMail(mailOptions, function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }
          res.status(200).send('A verification email has been sent to ' + user.emailAddress + '.');
        });
      }
    }
}));

router.post('/registerEmail', checkLog(), asyncHandler(async(req, res) => {
  let emailAddress = req.body.email;
  let userId = req.user;

  let emailAddressExist = await User.findOne({emailAddress:emailAddress})
  if (emailAddressExist)
    res.status(203).send("This emailAddress is already in use");
  else if (!checkEmailValidity(emailAddress))
    res.status(203).send("Email address is invalid")

  let user = await User.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  user.emailAddress = emailAddress;
  await user.save();
  res.status(200).send('The email address was register');
}));

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = router;
