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
const ObjectId = require('mongoose').Types.ObjectId;
const schedule = require('node-schedule');


// Bring in user models
let UserModel = require('../models/user');
let AuthenticationToken = require('../models/AuthenticationToken');
let MovieModel = require('../models/movie');
let DownloadedMovieModel = require('../models/downloadedMovie');
let WatchedModel = require('../models/alreadyViewed');
let CommentModel = require('../models/comment');
let DeleteMovieModel = require('../models/deleteMovieModel');

router.post('/checkIfWatched', checkLog(), asyncHandler(async(req, res) => {
  let userID = req.user;
  let movieID = req.body.movie;
  if (!movieID || !ObjectId.isValid(movieID))
    return res.status(400).send('Error');
  movie = await MovieModel.findOne({_id: movieID});
  if (!movie)
    return res.status(400).send('Movie doesn\'t exist');
  let watched = await WatchedModel.findOne({userID: userID, movieID: movieID});
  if (!watched)
    return res.status(200).send(false);
  else
    return res.status(200).send(true);
}));

router.post('/setMovieWatched', checkLog(), asyncHandler(async(req, res) => {
  let userID = req.user;
  let movieID = req.body.movie;
  if (!movieID || !ObjectId.isValid(movieID))
    return res.status(400).send('Error');
  movie = await MovieModel.findOne({_id: movieID});
  if (!movie)
    return res.status(400).send('Movie doesn\'t exist');
  let movieWatched = new WatchedModel();
  movieWatched.userID = userID;
  movieWatched.movieID = movieID;
  await movieWatched.save();
  return res.status(200).send('You now watched this movie');
}));


router.post('/getMovie', asyncHandler(async(req, res) => {
  let moviePath = req.body.moviePath;
  let downloadedMovie = await DownloadedMovieModel.findOne({path: moviePath});
  if(!downloadedMovie)
    return res.status(203).send('Error');
  return res.status(200).send(downloadedMovie);
}));

router.post('/getComments', asyncHandler(async(req, res) => {
  let movieID = req.body.movie;
  let downloadedMovie =  await DownloadedMovieModel.findOne({_id: movieID})
  if (!downloadedMovie)
    return res.status(400).send('movie not found');
  let comments = await CommentModel.find({movieID: downloadedMovie._id});
  if (!comments)
    return res.status(203).send('No comments yet');
  return res.status(200).send(comments)
}));

router.post('/getSubtitles', asyncHandler(async(req, res) => {
  let movieID = req.body.movie;
  let lang = req.body.lang;
  let downloadedMovie =  await DownloadedMovieModel.findOne({_id: movieID})
  if (!downloadedMovie)
    return res.status(400).send('movie not found');
  let name = downloadedMovie.path.split("films/");
  name[1] = name[1].replace('\\', '/');
  name = name[1].split("/");
  name = name[0];
  if (lang == 'en') {
    name = 'http://localhost:8081/films/' + name + '/en.vtt';
    return res.status(203).send(name);
  } else {
    name = 'http://localhost:8081/films/' + name + '/fr.vtt';
    return res.status(200).send(name);
  }
}));

router.post('/postComment', checkLog(), asyncHandler(async(req, res) => {
  console.log('lolol');
  let comment = req.body.comment;
  let movieID = req.body.movie;
  let userID = req.user;
  let user = await UserModel.findOne({_id: userID});
  let newComment = new CommentModel();
  newComment.movieID = movieID;
  newComment.username = user.username;
  newComment.userPicture = user.picture;
  newComment.commentText = comment;
  newComment.date = Date.now();
  await newComment.save();
  return res.status(200).send('Comment saved');
}));

router.post('/changeDeleteDate', asyncHandler(async(req, res) => {
  let movieID = req.body.movie;
  var currentDate = new Date();
  let movieToUpdate = await DownloadedMovieModel.find({_id: movieID});
  if (!movieToUpdate)
    return res.status(203).send('Can\'t find the movie');
  else {
    DownloadedMovieModel.updateOne({_id: movieToUpdate._id}, { $set: {date: currentDate}},
      function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
    return res.status(200).send('success');
  }
}));


module.exports = router;
