let mongoose = require('mongoose')

let DeleteMovieModel = mongoose.Schema({
  movieID: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  },
  jobsName: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('deleteMovie', DeleteMovieModel)
