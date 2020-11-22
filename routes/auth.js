const _ = require('lodash');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const Joi = require('joi');


router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Invalid email or password");

    // user = new User({
    //     name:req.body.name,
    //     email:req.body.email,
    //     password: req.body.password
    // });
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.send(token);

    
    //res.send(_.pick(user,['_id','name','email']));
});


function validate(request) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(request);
}


module.exports = router;