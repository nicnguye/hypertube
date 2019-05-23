let mongoose = require('mongoose')
let bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

let AuthenticationToken = mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  expire: {
    type: Date,
    default: new Date(+new Date() + (60 * 60 * 24 * 365)),
    required: true,
    expires: 60
  }
})



module.exports = mongoose.model('AuthenticationToken', AuthenticationToken)
