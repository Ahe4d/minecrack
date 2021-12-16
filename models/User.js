const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rank: {
    type: Number,
    required: true,
    default: 1
  } 
  /*
    Ranks:
    1 - User
    2 - Admin
    */
})

userSchema.plugin(AutoIncrement, {inc_field: 'id'});

userSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  let compare = bcrypt.compare(password, user.password)
  return compare;
}

module.exports = mongoose.model('User', userSchema);