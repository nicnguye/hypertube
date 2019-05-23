let mongoose = require('mongoose');

let tokenSchema = mongoose.Schema({
  _userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
   token:{
     type: String,
     required: true
   }
});

let token = module.exports = mongoose.model('registrationToken', tokenSchema);
