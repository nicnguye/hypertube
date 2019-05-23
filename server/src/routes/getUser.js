const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');

let UserModel = require('../models/user');


router.post('/', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let user = await UserModel.findOne({_id: userId}).lean();
  if (!user)
    return res.status(400).send('User doesn\'t exist');
  return res.status(200).send(user);
}));

module.exports = router;
