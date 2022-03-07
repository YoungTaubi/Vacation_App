const Trip = require("../models/Trip");
const User = require("../models/User");
const Expence = require("../models/Expence");
//const { route } = require("express/lib/application");

const router = require("express").Router();

// create a new expence
router.post('/:id', (req, res, next) => { 
    const tripId = req.params.id 
    const { title, amount, debitors } = req.body
    const userId = req.payload._id
    //console.log('body: ',req.body, 'user ID: ', userId);
    //console.log('tripId: ',tripId);
    User.findById(userId)
        .then(user => {
            Expence.create({ title, amount, debitors, creditor: userId, creditorName: user.name })  
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
            .catch(err => next(err))       
        })
        .catch(err => next(err))    
  })

// get all expences made by the user for exp. overview
router.get('/:id/users-expences', (req, res, next) => {
    const tripId = req.params.id
    const userId = req.payload._id
    let userTotalSpent = 0
    let userTotalDebt = 0
    let userTotalCredit = 0
    let totalTripExpences = 0
    console.log('user total debt1',userTotalDebt);
    // Find the current trip
    Trip.findById(tripId)
    .then(trip => {  
        // Find all expences of the current trip      
        Expence.find({_id: {$in: trip.expences}})
        .populate('creditor')
        .then(expences => {        
        expences.map((expence, index) => {
            totalTripExpences += expence.amount
            if (String(expence.creditor._id) == userId) {
                userTotalSpent += expence.amount
            }
        })
            Expence.find({_id: {$in: trip.expences}})
            .populate('debitors')
            .then(expences => {        
            //console.log('debitors: ',expences[0]);
            expences.map((expence) => {
                expence.debitors.map((debitor) => {
                    //console.log('debitor Id ', debitor.debitorId);
                    if (String(debitor.debitorId) == userId) {                    
                        userTotalDebt += debitor.debitorDebt
                        console.log('trip total expences',totalTripExpences);
                        console.log('user total debt',userTotalDebt);                 
                    } 
                                 
                })            
            }) 
            if (userTotalSpent > userTotalDebt) {
                userTotalCredit = userTotalSpent - userTotalDebt 
                console.log('user total credit',userTotalCredit);
            }
            userTotalDebt -= userTotalSpent 
            res.status(200).json({amount:userTotalSpent, userTotalDebt, userTotalCredit, totalTripExpences})       
        })
        .catch(err => next(err))
        
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
  });

// get all expences of trip
router.get('/:id/all-expences', (req, res, next) => {
    const tripId = req.params.id
    const userId = req.payload._id
    // Find the current trip
    Trip.findById(tripId)
    .then(trip => {  
        // Find all expences of the current trip      
        Expence.find({_id: {$in: trip.expences}})
        .then(expences => {
            res.status(200).json(expences)
        })
        .catch(err => next(err))
    })
});

// get user id
router.get('/user-id', (req, res, next) => {
    const userId = req.payload._id
    res.status(200).json(userId)
});

// delete an expence
router.delete('/:id', (req, res, next) => {
    Expence.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(200).json({ message: 'Expence deleted' })
      })
      .catch(err => next(err))
  });
  
  
    




module.exports = router;