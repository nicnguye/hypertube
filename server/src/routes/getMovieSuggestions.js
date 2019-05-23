const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');

let UserModel = require('../models/user');
let MovieModel = require('../models/movie');
let WatchedSchema = require('../models/alreadyViewed')


router.post('/', checkLog(), asyncHandler(async(req, res) => {
  let userId = req.user;
  let user = await UserModel.findOne({_id: userId}).lean();
  if (!user)
    return res.status(203).send('User doesn\'t exist');


  let suggestionsUsers;
    suggestionsUsers = await MovieModel.find().lean();

  return res.status(200).send(suggestionsUsers);
}));

router.post('/searchMovieName', asyncHandler(async(req, res) => {
  let research = req.body.movieTitle;
  var query = {title: {$regex : ".*" + research + ".*", $options: 'i'}}
  let suggestionsUsers = await MovieModel.find(query);
  return res.status(200).send(suggestionsUsers);
}));

router.post('/searchMovieGenre', asyncHandler(async(req, res) => {
  let research = req.body.movieGenre;
  var query = {genres: {$regex : ".*" + research + ".*", $options: 'i'}}
  let suggestionsUsers = await MovieModel.find(query);
  return res.status(200).send(suggestionsUsers);
}));

module.exports = router;
