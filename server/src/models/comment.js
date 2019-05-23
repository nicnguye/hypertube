let mongoose = require('mongoose')

let CommentSchema = mongoose.Schema({
  movieID: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false
  },
  userPicture: {
    type: String,
    required: false
  },
  commentText: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: false
  }
})

module.exports = mongoose.model('comment', CommentSchema)
