const Trip = require("../models/Trip");
const User = require("../models/User");

const router = require("express").Router();

// get all the users
router.get('/users', (req, res, next) => {
  User.find()
    .then(users => {
      console.log('users:', users);
      res.status(200).json(users)
    })
});

// get all the trips which are eather owned or joined by user
router.get('/', (req, res, next) => {
  const userId = req.payload._id
  Trip.find({ owner: userId })
    .then(trips => {
      res.status(200).json(trips)
    })
});

// create a trip
router.post('/', (req, res, next) => {
  const { title, description, participants } = req.body
  const userId = req.payload._id
  Trip.create({ title, description, participants, owner: userId })  
    .then(trip => {
      console.log('participants: ', participants);
      console.log('user: ',userId);
      res.status(201).json(trip)
    })
    .catch(err => next(err))
})

// get a specific trip
router.get('/:id', (req, res, next) => {
  Trip.findById(req.params.id)
    .then(trip => {
      // check for a valid mongoobject id
      // mongoose.Types.ObjectId.isValid(<id>) 
      if (!trip) {
        res.status(404).json(trip)
      } else {
        res.status(200).json(trip)
      }
    })
});

// update a trip
router.put('/:id', (req, res, next) => {
  const { title, description } = req.body
  
  Trip.findByIdAndUpdate(req.params.id, {
    title,
    description,
  }, { new: true })
    .then(updatedTrip => {
      res.status(200).json(updatedTrip)
    })
    .catch(err => next(err))
});

// delete a Trip
router.delete('/:id', (req, res, next) => {
  Trip.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'Trip deleted' })
    })
    .catch(err => next(err))
});


module.exports = router;