let mongoose = require('mongoose')

let DownloadedMovieSchema = mongoose.Schema({
  hash: {
    type: String,
    required: false
  },
  downloaded: {
    type: Number,
    required: false
  },
  path: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: false
  }
})

module.exports = mongoose.model('downloadedMovie', DownloadedMovieSchema)
