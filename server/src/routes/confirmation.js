const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

let User = require('../models/user');
let Token = require('../models/registrationToken');

// Add route
router.post('/', asyncHandler(async(req, res) => {
  let tokenNumber = req.body.token;
  if (!tokenNumber)
    return res.status(400).send('No token was found');
  let token = await Token.findOne({token:tokenNumber});
  if (!token)
    return res.status(400).send('Token wasn\'t found');
  let userToVerify = await User.findOne({_id:token._userId});
  if (!userToVerify)
    return res.status(400).send('User couldn\'t be found');
  if (userToVerify.isVerified === true)
    return res.status(400).send('This user is already verified');
  userToVerify.isVerified = true;
  await userToVerify.save();
  res.status(200).send('The user was verified');
}));


module.exports = router;
