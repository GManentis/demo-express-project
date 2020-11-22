const Joi = require('joi');
const mongoose = require('mongoose');

//first way for mongoose model
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
    minlength:5,
    maxlength:50
  }
});

const Genre = mongoose.model('Genre',genreSchema);

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

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(genre);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;