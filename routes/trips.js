const Trip = require("../models/Trip");
const User = require("../models/User");

const router = require("express").Router();

// get the current users
router.get('/currentUser', (req, res, next) => {
  const userId = req.payload._id
  User.findById(userId)
    .then(user => {
      res.status(200).json(user)
    })
});

// get all the users
router.get('/users', (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json(users)
    })
});

// get all the trips which are eather owned or joined by user
router.get('/', (req, res, next) => {
  const userId = req.payload._id
  Trip.find({ $or: [{ owner: userId }, { 'participants._id': userId }] })
    .populate('participants')
    .then(trips => {
      const filteredStrips = []
      trips.map(trip => {
        trip.participants.map(participant => {
          if (participant?.joining === true && participant?._id.toString() === userId.toString()) {
            filteredStrips.push(trip)
          }
        })
      })
      res.status(200).json(filteredStrips)
    })
});

// get all the trip invites
router.get('/invites', (req, res, next) => {
  const userId = req.payload._id
  Trip.find({ $and: [{ 'participants._id': userId }, { 'participants.joining': false }, { owner: { $ne: userId } }] })
    .populate('owner')
    .then(trips => {
      const filteredStrips = []
      trips.map(trip => {
        trip.participants.map(participant => {
          if (participant?.joining === false && participant?._id.toString() === userId.toString()) {
            filteredStrips.push(trip)
          }
        })
      })
      res.status(200).json(filteredStrips)
    })
});

// get all the participants of the trip
router.get('/:id/trip-participants', (req, res, next) => {
  const tripId = req.params.id
  const userId = req.payload._id
  Trip.findById(tripId)
    .then(trip => {
      User.find({ _id: { $in: trip.participants } })
        .then(users => {
          const allParticipants = Object.entries(trip.participants)
          const filteredUsers = users.filter(user => {
            for (let [key, value] of allParticipants) {
              if (user._id.toString() === userId) {
                return true
              }
              else if (user._id.toString() === value._id.toString() && value.joining === true) {
                return true
              }
            }
          })
          res.status(200).json(filteredUsers)
        })
    })
});

// create a trip
router.post('/', (req, res, next) => {
  const { title, description, participants } = req.body
  const userId = req.payload._id
  let currentUser = req.payload
  currentUser.joining = true
  participants.push(currentUser)
  Trip.create({ title, description, participants, owner: userId })
    .then(trip => {
      res.status(201).json(trip)
    })
    .catch(err => next(err))
})

// get a specific trip
router.get('/:id', (req, res, next) => {
  Trip.findById(req.params.id)
    .then(trip => {
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

// accept an invite
router.put('/invites/:id', (req, res, next) => {
  const { participants } = req.body

  Trip.findByIdAndUpdate(req.params.id, {
    participants
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