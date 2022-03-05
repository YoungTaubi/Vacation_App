const Trip = require("../models/Trip");
const User = require("../models/User");
const Expence = require("../models/Expence");

const router = require("express").Router();

// create a new expence
router.post('/:id', (req, res, next) => { 
    const tripId = req.params.id 
    const { title, amount, debitors } = req.body
    const userId = req.payload._id
    //console.log('body: ',req.body, 'user ID: ', userId);
    //console.log('tripId: ',tripId);
    Expence.create({ title, amount, debitors, creditor: userId })  
      .then(expence => {
          Trip.findByIdAndUpdate(tripId, 
            {
                $push: {
                    expences: expence._id
                }
            }
            ).then(trip => {
        //console.log('expence: ', expence);
        //console.log('debitors: ',debitors);
        //console.log('expenceId: ',expence._id);
        //console.log('tripId: ',tripId);
        //console.log('trip: ',trip);
        //console.log('expence: ',expence);
        res.status(201).json(expence)
      })
      .catch(err => next(err))
    })
  })

// get all expences made by the user
router.get('/:id/users-expences', (req, res, next) => {
    const tripId = req.params.id
    const userId = req.payload.name
    let userTotalSpent = 0
    Trip.findById(tripId)
    .then(trip => {
        console.log('trip: ', trip);
        console.log('trip expences: ', trip.expences);
        Expence.find({_id: {$in: trip.expences}})
        .populate('creditor')
        .then(expences => {
        
        console.log('expences: ',expences);
        console.log('creditor: ',expences[0].creditor.name);
        console.log('user ID: ',userId,`new ObjectId("${userId}")`);
        expences.map((expence, index) => {
            console.log(index, expence.creditor.name)
            // if (expence.creditor._id == `new ObjectId("${userId}")`) {
            if (expence.creditor.name == userId) {
                console.log(expence.amount);
                userTotalSpent += expence.amount
            }
        })
        console.log('total spent: ', userTotalSpent);
        res.status(200).json({amount:userTotalSpent})
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
  });

  // get total debt of user

  router.get('/:id/users-debt', (req, res, next) => {

// .catch(err => next(err))
});


module.exports = router;