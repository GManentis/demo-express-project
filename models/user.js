const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

//first way for mongoose model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
    minlength:5,
    maxlength:50
  },
  email: {
      type: String,
      required:true,
      minlength:5,
      maxlength:255,
      unique:true
    },
    password: {
      type: String,
      required:true,
      minlength:5,
      maxlength:1024,
    },
    isAdmin:{
      type: Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id:this.id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
  return token;
}
const User = mongoose.model('User', userSchema);

/*
//second way
const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required:true,
        minlength:5,
        maxlength:50
    }
}));
*/

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;