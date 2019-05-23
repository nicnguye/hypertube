let mongoose = require('mongoose')

let ViewSchema = mongoose.Schema({
  userID: {
    type: String,
    required: false
  },
  movieID: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('alreadyViewed', ViewSchema)
