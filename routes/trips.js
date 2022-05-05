const Trip = require("../models/Trip");
const User = require("../models/User");

const router = require("express").Router();

// get the current users
router.get('/currentUser', (req, res, next) => {
  const userId = req.payload._id
  User.findById(userId)
    .then(user => {
      // console.log('user:', user);
      res.status(200).json(user)
    })
});

// get all the users
router.get('/users', (req, res, next) => {
  User.find()
    .then(users => {
      // console.log('users:', users);
      res.status(200).json(users)
    })
});

// get all the trips which are eather owned or joined by user
router.get('/', (req, res, next) => {
  const userId = req.payload._id
  // Trip.find({ $or: [{owner: userId}, {$and: [{'participants._id': userId}, {'participants.joining': true}]}] })
  // Trip.find({$and: [{'participants._id': userId}, {$or:[{'participants.joining': true} , {'participants.joining': 'true'}]}]  })
  // Trip.find({'participants.joining': true})
  Trip.find({ $or: [{owner: userId}, {'participants._id': userId}]})
    .populate('participants')
    .then(trips => {
      // console.log('trips',trips);
      const filteredStrips = []
        trips.map(trip => {
        trip.participants.map(participant => {          
          if (participant.joining === true && participant._id.toString() === userId.toString()) {
            // console.log('participant', participant );
            filteredStrips.push(trip)
          } 
        })
      })
      // console.log('filteredStrips', filteredStrips);
      res.status(200).json(filteredStrips)
    })
});

// get all the trip invites
// router.get('/invites', (req, res, next) => {
//   const userId = req.payload._id
//   Trip.find({ $and: [{'participants._id': userId}, {'participants.joining': false}, {owner: { $ne: userId }}] })
//     .populate('owner')
//     .then(trips => {
//       res.status(200).json(trips)
//     })
// });

// get all the trip invites
router.get('/invites', (req, res, next) => {
  const userId = req.payload._id
  Trip.find({ $and: [{'participants._id': userId}, {'participants.joining': false}, {owner: { $ne: userId }}] })
    .populate('owner')
    .then(trips => {
      const filteredStrips = []
        trips.map(trip => {
        trip.participants.map(participant => {          
          if (participant.joining === false && participant._id.toString() === userId.toString()) {
            // console.log('participant', participant );
            filteredStrips.push(trip)
          } 
        })
      })
      // console.log('filteredStrips', filteredStrips);
      res.status(200).json(filteredStrips)
    })
});

// get all the participants of the trip
router.get('/:id/trip-participants', (req, res , next) => {
  const tripId = req.params.id
  const userId = req.payload._id
  // console.log('loggen in user:', userId);
  //console.log('trip id: ',tripId)
  Trip.findById(tripId)
    .then(trip => {
      //console.log('joining:', trip.participants);
      User.find({_id: {$in: trip.participants}})
      // User.find({ $and: [{_id: {$in: trip.participants}}, {'trip.participants.joining': false}]})
        .then(users => {
        const allParticipants = Object.entries(trip.participants)
        const filteredUsers = users.filter(user => {
          // console.log('user', user._id);
          for (let [key, value] of allParticipants) {
              // console.log('participant',value._id)
              // console.log('user',user._id)
              if (user._id.toString() === userId) {
                return true
              }
              else if (user._id.toString() === value._id.toString() && value.joining === true) {
              //console.log('true')
              return true
              } else {
                //console.log('false')
              }
          }       
        }) 
        //console.log('users: ',users);
        // console.log('filteredusers: ',filteredUsers);
        res.status(200).json(filteredUsers)
      })
    })  
});

// create a trip
router.post('/', (req, res, next) => {
 // console.log('trip body: ',req.body);
  const { title, description, participants } = req.body
  const userId = req.payload._id
  Trip.create({ title, description, participants, owner: userId })  
    .then(trip => {
      //console.log('participants: ', participants);
      //console.log('user: ',userId);
      //console.log('trip: ',trip);
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

// accept an invite
router.put('/invites/:id', (req, res, next) => {
  const { participants } = req.body
  
  Trip.findByIdAndUpdate(req.params.id, {
    participants
  }, { new: true })
    .then(updatedTrip => {
      // console.log('updatedTrip',updatedTrip);
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