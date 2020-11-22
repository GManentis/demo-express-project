const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const {Rental,validate} = require('../models/rental');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');//DESC??
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if(!customer) return res.status(400).send({message:"Invalid Customer"});

  const movie = await Movie.findById(req.body.movieId);
  if(!movie) return res.status(400).send({message:"Invalid Movie"});

  if(movie.numberInStock === 0) return res.send({message:"Movie not available"}).status(400);

  let rental = new Rental({
    customer:{
        _id:customer._id,
        name:customer.name,
        phone:customer.phone
    },
    movie:{
        _id:movie._id,
        title:movie.title,
        dailyRentalRate:movie.dailyRentalRate
    }
   
  });
try{
  new Fawn.Task()
    .save('rentals',rental)
    .update('movies',{_id:movie._id},{
        $inc:{numberInStock:-1}
        })
    .run();
}catch(ex){
    console.log(ex.message);
    res.status(500).send('Sth went wrong');
}
  /*
  movie.numberInStock--;
  movie.save();

  rental = await rental.save();
  
  */
 res.send(rental);
});
/*
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if(!genre) return res.status(400).send({message:"Invalid Genre"});
  
  const movie = await Movie.findByIdAndUpdate(req.params.id, 
    {
        title: req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate},
        {
            new:true
        });
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});
*/
module.exports = router;