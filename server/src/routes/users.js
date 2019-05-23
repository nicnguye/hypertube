const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const flash = require('connect-flash');
const crypto = require('crypto');
const faker = require('faker');
const checkLog = require('../middlewares/checkLog');
const nodemailer = require('nodemailer');
const passport = require('passport');


// Bring in user models
let UserModel = require('../models/user');
let AuthenticationToken = require('../models/AuthenticationToken');

//
// // Delete user
// router.delete('/:id', function(req, res){
//   let query = {_id:req.params.id}
//
//   UserModel.deleteOne(query, function(err){
//     if(err){
//       console.log(err);
//     }
//     res.send('Success');
//   });
// });
//

router.get('/google/googleRegister', passport.authenticate('google'), asyncHandler(async(req, res) => {
  let lastName = req.user.profile.name.familyName;
  let firstName = req.user.profile.name.givenName;
  let username = req.user.profile.displayName;
  let googleId = req.user.profile.id;
  let profilePic = req.user.profile.photos[0].value;
  //let profilePic = req.user.profile.photos.value;

  if(!lastName || !firstName || !username || !googleId)
    res.status(203).send('Couldn\'t retrieve all the necessary informations from your google profile')
  else {
    let googleIdExists = await UserModel.findOne({googleId: googleId});
    if (googleIdExists) {
      let token = new AuthenticationToken();
      token.token = await crypto.randomBytes(32);
      token.userId = googleIdExists._id;
      await token.save()
      res.redirect('http://localhost:8080/connect?token=' + token.token);
    }
    else {
      let user = new UserModel();
      user.username = username;
      user.lastName = lastName;
      user.firstName = firstName;
      user.googleId = googleId;
      if (profilePic)
        user.picture = profilePic;
      var token = new AuthenticationToken({userId: user._id, token: crypto.randomBytes(16).toString('hex')});
      await user.save();
      await token.save();
      res.redirect('http://localhost:8080/connect?token=' + token.token);
    }

  }
}));

router.get('/auth42', passport.authenticate('42'), asyncHandler(async(req, res) => {
  let lastName = req.user.profile.name.familyName;
  let firstName = req.user.profile.name.givenName;
  let username = req.user.profile.username;
  let fortytwoId = req.user.profile.id;
  let profilePic = req.user.profile.photos[0].value;
  let emailAddress = req.user.profile.emails[0].value;

  if(!lastName || !firstName || !username || !fortytwoId)
    res.status(203).send('Couldn\'t retrieve all the necessary informations from your google profile')
  else {
    let fortyTwoIdExists = await UserModel.findOne({fortytwoId: fortytwoId});
    if (fortyTwoIdExists) {
      let token = new AuthenticationToken();
      token.token = await crypto.randomBytes(32);
      token.userId = fortyTwoIdExists._id;
      await token.save()
      res.redirect('http://localhost:8080/connect?token=' + token.token);
    }
    else {
      let user = new UserModel();
      user.username = username;
      user.lastName = lastName;
      user.firstName = firstName;
      user.fortytwoId = fortytwoId;
      user.emailAddress = emailAddress;
      if (profilePic)
        user.picture = profilePic;
      var token = new AuthenticationToken({userId: user._id, token: crypto.randomBytes(16).toString('hex')});
      await user.save();
      await token.save();
      res.redirect('http://localhost:8080/connect?token=' + token.token);
    }
  }
}));

router.post('/checkEmailExists', asyncHandler(async(req, res) => {
  let user = req.body;
  if(!user.emailAddress) {
    res.status(200).send('redirecting');
  }
  else
    res.status(200).send('all good');
}));

router.post('/login', asyncHandler(async(req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (!username)
      return res.status(203).send('username field is empty');
    if (!password)
      return res.status(203).send('password field is empty');
    let usernameExists = await UserModel.findOne({username: username});
    if (!usernameExists)
        return res.status(203).send('login fail');
     if (usernameExists.fortytwoId)
      return res.status(203).send('this user must connect with 42');
    if (usernameExists.googleId)
      return res.status(203).send('this user must connect with Google');
    const isPasswordRight = await bcrypt.compare(password, usernameExists.password);
    if (!isPasswordRight)
         return res.status(203).send('login fail');
    else {
      let token = new AuthenticationToken();
      token.token = await crypto.randomBytes(32);
      token.userId = usernameExists._id;
      await token.save();
      res.status(200).json({token: token.token, msg:'Login successful, wait for redirection'});
    }
}));

router.post('/resetPassword', asyncHandler(async(req, res) => {
  let emailAddress = req.body.email;
  let username = req.body.username;
  let userToReset = await UserModel.findOne({emailAddress: emailAddress});
  if (!userToReset)
    return res.status(203).send('This user doesn\'t exist, or the email address provided is wrong');
  if (userToReset.username != username)
    return res.status(203).send('This isn\'t the email of this user');
  let newPassword = faker.internet.password();
  userToReset.password = bcrypt.hashSync(newPassword, 10);
  await userToReset.save();
  var transporter = nodemailer.createTransport({ service: 'Hotmail', auth: { user: "olivierdem_218@hotmail.com", pass: "Nietzsche1"} });
  var mailOptions = { from: 'olivierdem_218@hotmail.com', to: emailAddress, subject: 'Password Reset', text: 'Hello,\n\n' + 'Please find below your new Password. We advise you to change it as soon as possible\n New password: ' + newPassword };
  transporter.sendMail(mailOptions, function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }
      res.status(200).send('Password resetted.');
    });
}));

router.post('/changePassword', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  let newPasswordConfirmation = req.body.newPasswordConfirmation;

  if (!oldPassword || !newPassword || !newPasswordConfirmation)
    res.status(203).send("One of the field is missing");
  else if (newPassword.length <= 6)
    res.status(203).send("The password is too short");
  else if (newPassword !== newPasswordConfirmation)
    return res.status(203).send('New passwords aren\'t identicals')
  else {
    let user = await UserModel.findOne({_id: userId});
    if (!user)
      return res.status(203).send('User doesn\'t exist');
    let isPasswordRight = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordRight)
      return res.status(203).send('Old Password isn\'t the correct password');
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    return res.status(200).send('Your password was changed');
  }
}));

router.post('/changeLastName', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let newLastName = req.body.newLastName;
  if (!newLastName)
    return res.status(203).send("New LastName is empty");
  if (newLastName.trim().length == 0)
    return res.status(203).send("Stop using spaces!!");
  let newLastName2 = newLastName.trim();
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  user.lastName = newLastName2;
  await user.save();
  return res.status(200).send('Your lastName was changed');
}));

router.post('/changeFirstName', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let newFirstName = req.body.newFirstName;
  if (!newFirstName)
    return res.status(203).send("New FirstName is empty");
  if (newFirstName.trim().length == 0)
    return res.status(203).send("Stop using spaces!!");
  let newFirstName2 = newFirstName.trim();
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  user.firstName = newFirstName2;
  await user.save();
  return res.status(200).send('Your FirstName was changed');
}));


router.post('/changeEmail', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let newEmail = req.body.newEmail;
  if (!newEmail)
    return res.status(203).send("New Email is empty");
  let user = await UserModel.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  else if (!checkEmailValidity(newEmail))
    res.status(203).send("Email address is invalid")
  user.emailAddress = newEmail;
  await user.save();
  return res.status(200).send('Your Email was changed');
}));


// check email validity throught router.post('/')
function checkEmailValidity(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


module.exports = router;
