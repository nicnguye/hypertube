const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const fs = require('fs');
const randomID = require('random-id');
const path = require('path');

// Bring in user models
let User = require('../models/user');
let Token = require('../models/registrationToken');

router.post('/', asyncHandler(async(req, res) => {

  let userId = req.body.userId;
  let password = req.body.password;
  let userExists = await User.findOne({_id: userId});
  if(userExists)
    {
      if (bcrypt.compareSync(password, userExists.password))
      {
        let user = {};
        user.username = req.body.username;
        user.emailAddress = req.body.emailAddress;
        let query = {_id:userId};
        User.updateOne(query, user, function(err){
          if(err){
            return;
          } else {
            req.flash('success', 'User Updated');
          }
        });
      } else {
        res.status(203).send("Password is incorrect");
      }
    } else {
      res.status(203).send("This user doesn't exist");
    };
}));

router.post('/uploadPicture', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let image = undefined;
  if (req.files)
    image = req.files.myFile;
  if (!image)
    return res.status(203).send('No image was found');
  let user = await User.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let imageUploaded = user.picture;
  let name = 'uploads/' + randomID() + Date.now() + path.extname(image.name);
  if (fs.existsSync("public/" + image) && image !== "images/default.jpg")
    fs.unlinkSync("public/" + image);
  imageUploaded = name;
  user.picture = imageUploaded;
  await user.save();
  image.mv('public/' + name, async function(err) {
    if(err) {
      return res.status(500).send('the upload failed');
    } else {
      return res.status(200).send('It worked');
    }
  });
}));


router.post('/deletePicture', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let user = await User.findOne({_id: userId});
  if (!user)
    return res.status(203).send('User doesn\'t exist');
  let image = user.picture;
  if (image === "images/default.jpg")
    return res.status(203).send('can\'t delete the default picture');
  else if (fs.existsSync("public/" + image))
    fs.unlinkSync("public/" + image);
  image = "images/default.jpg";
  user.picture = image;
  await user.save();
  return res.status(200).send('It worked');
}));


module.exports = router;
