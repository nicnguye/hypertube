let mongoose = require('mongoose')

let MovieSchema = mongoose.Schema({
  imdbID: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  rating: {
    type: String,
    required: false
  },
  year: {
    type: String,
    required: false
  },
  coverImage: {
    type: String,
    required: false
  },
  genres: {
    type: String,
    required: false
  },
  runtime: {
    type: String,
    required: false
  },
  summary: {
    type: String,
    required: false
  },
  urlTorrent: {
    type: String,
    required: false
  },
  hash: {
    type: String,
    required: false
  },
  quality: {
    type: String,
    required: false
  },
  size: {
    type: String,
    required: false
  },
})

module.exports = mongoose.model('movie', MovieSchema)
