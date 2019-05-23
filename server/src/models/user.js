let mongoose = require('mongoose')
let bcrypt = require('bcrypt')

let UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  emailAddress: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  googleId: {
    type: String,
    required: false
  },
  fortytwoId: {
    type: String,
    required: false
  },
  isVerified: {
    type: Boolean,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  picture: {
    type: String,
    default: 'images/default.jpg',
    required: true
  }
})

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}
module.exports = mongoose.model('user', UserSchema)
