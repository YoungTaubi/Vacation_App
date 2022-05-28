const Trip = require("../models/Trip");
const User = require("../models/User");
const Expence = require("../models/Expence");
//const { populate } = require("../models/Trip");
const Settlement = require("../models/Settlement");
//const { route } = require("express/lib/application");

const router = require("express").Router();

// create a new expence
router.post('/:id', (req, res, next) => { 
    const tripId = req.params.id 
    const { title, amount, debitors } = req.body
    const userId = req.payload._id

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
    // Find the current trip
    Trip.findById(tripId)
    .then(trip => {  
        // Find all expences of the current trip      
        Expence.find({_id: {$in: trip.expences}})
        .populate('creditor')
        .populate('debitors')
        .then(expences => {        
        expences.map((expence, index) => {
            totalTripExpences += expence.amount
            if (String(expence.creditor._id) == userId) {
                userTotalSpent += expence.amount
            }
        })
            Settlement.find({trip: tripId, markedAsPaied: true})
            .then(settlementsFromDB => {        
            expences.map((expence) => {
                expence.debitors.map((debitor) => {
                    if (String(debitor._id) == userId) {                    
                        userTotalDebt += debitor.debitorDebt           
                    } 
                                 
                })            
            }) 
            if (userTotalSpent > userTotalDebt) {
                userTotalCredit = userTotalSpent - userTotalDebt 
            }
            userTotalDebt -= userTotalSpent 
            settlementsFromDB.forEach(settlement => {
                if (String(userId) === String(settlement.creditor)) {
                    userTotalCredit -= settlement.amount
                } else if (String(userId) === String(settlement.debitor)) {
                    userTotalDebt -= settlement.amount
                }
            })
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
    const allExpencesAndDoneSettlements = []
    // Find the current trip
    Trip.findById(tripId)
    .then(trip => {  
        // Find all expences of the current trip      
        Expence.find({_id: {$in: trip.expences}})
        .then(expences => {
            Settlement.find({trip: tripId, markedAsPaied: true})
            .populate('creditor')
            .populate('debitor')
            .then(settlementsFromDB => {
                settlementsFromDB.forEach(settlement => {
                    let settlementCopy = JSON.parse(JSON.stringify(settlement))
                    settlementCopy.type = 'settlement'
                    allExpencesAndDoneSettlements.push(settlementCopy)
                })
                expences.map(expence => {
                    let expenceCopy = JSON.parse(JSON.stringify(expence))
                    expenceCopy.type = 'expence'                   
                    allExpencesAndDoneSettlements.push(expenceCopy)
                })
     
                const allExpencesAndDoneSettlementsSorted = allExpencesAndDoneSettlements.sort((a, b) => {
                    return Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
                })
                res.status(200).json({expencesAndSettlements: allExpencesAndDoneSettlementsSorted})                
            })
                      
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


// get all settlements from db  
router.get('/:id/users-creditAndDebt', (req, res, next) => {
    const tripId = req.params.id
    const userId = req.payload._id


    Settlement.find({$and: [{trip: tripId}, {amount: {$ne: 0}}]})
    .populate('debitor')
    .populate('creditor')
    .then(settlementsFromDB => {
        res.status(200).json({settlementsFromDB})
    })
    .catch(err => next(err))
  });

// update marked as paied
router.post('/:id/settlement', (req, res, next) => {
    const tripId = req.params.id
    const userId = req.payload._id

    Settlement.deleteMany({
        trip: tripId, 
        markedAsPaied: false,
        markedAsReceived: false
    })
    .then(deltedSettlements => {
    })

    let allUsersCreditAndDebt = []
    let creditors = []
    let debitors = []

    Trip.findById(tripId)
    .then(trip => {  
        tripParticipants = trip.participants
        Expence.find({_id: {$in: trip.expences}})
        .populate('debitors')
        .then(expences => {
            Settlement.find({trip: tripId, markedAsPaied: true})
            .then(settlementsFromDB => {
                trip.participants.map(participant => {
                    if (participant.joining === true) {
                        let userTotalDebt = 0
                        let userTotalCredit = 0
                        let user = {_id: participant.id, settlementDone: false}
                        allUsersCreditAndDebt.push(user)
                        expences.map(expence => {
                            if (String(participant._id) === String(expence.creditor)) {
                                userTotalCredit += expence.amount
                                user.credit = userTotalCredit
                            }
                            expence.debitors.map(debitor => {
                                if (String(participant._id) === String(debitor._id)) {
                                    userTotalDebt += debitor.debitorDebt
                                    user.userDebt = userTotalDebt
                                    user.name = debitor.name  
                                    user.markedAsPaied = debitor.markedAsPaied                         
                                } 
                            })
                        })
                        settlementsFromDB.forEach(settlement => {
                            if (String(participant._id) === String(settlement.creditor)) {
                                userTotalCredit -= settlement.amount
                                user.credit = userTotalCredit
                            } else if (String(participant._id) === String(settlement.debitor)) {
                                userTotalDebt -= settlement.amount
                                user.userDebt = userTotalDebt
                            }
                        })
                    }             
                    })
            

            const createSettlement = (creditorID, debitorID, amount) => {
                Settlement.create({
                    creditor: creditorID,
                    debitor: debitorID,
                    trip: tripId,
                    amount: amount,
                    markedAsPaied: false,
                    markedAsReceived: false
                })
                .then(createdSettlement => {
                })
                .catch(err => next(err))
            }
        
            allUsersCreditAndDebt.map(user => {
                if (user.credit && user.credit > user.userDebt) {
                    user.credit = user.credit - user.userDebt
                    user.userDebt = 0
                    creditors.push(user)
                } else {
                    if (user.credit) {
                        user.userDebt = user.userDebt - user.credit
                        user.credit = 0
                    }
                    debitors.push(user)
                }
            }) 
            creditors.map(creditor => {
                debitors.map((debitor, index) => {
                    let res = creditor.credit - debitor.userDebt
                    if (res < 0 && debitor.settlementDone === false) {
                        debitor.userDebt -= creditor.credit
                        if (creditor.credit > 0.1) {
                            createSettlement(
                                creditor, 
                                debitor, 
                                Math.round((creditor.credit + Number.EPSILON) * 100) / 100
                                )
                        }
                        creditor.credit= 0
                        
                    } else if (res > 0 && debitor.settlementDone === false) {
                        creditor.credit -= debitor.userDebt
                        debitor.settlementDone = true
                        if (debitor.userDebt > 0.1) {
                            createSettlement(
                                creditor, 
                                debitor, 
                                Math.round((debitor.userDebt + Number.EPSILON) * 100) / 100
                                )
                        }
                        debitor.userDebt = 0
                                               
                    } else if (res === 0 && debitor.settlementDone === false) {
                        debitor.settlementDone = true
                        if (debitor.userDebt > 0.1) {
                            createSettlement(
                                creditor, 
                                debitor, 
                                Math.round((debitor.userDebt + Number.EPSILON) * 100) / 100
                                )
                        }                        
                        creditor.credit = 0
                        debitor.userDebt = 0
                        
                    }
                })
            })
        })
            
            res.status(200).json({creditors, debitors}) 
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
});

router.put('/:id/markedAsPaied', (req, res) => {
    const { settlementId, markedAsPaied } = req.body
    Settlement.findByIdAndUpdate(settlementId, {
        markedAsPaied: !markedAsPaied
    }, { new: true })
    .then(updatedSettlement => {
        res.status(200).json(updatedSettlement)
    })
    .catch(err => next(err))
})

router.put('/:id/markedAsReceived', (req, res) => {
    const { settlementId, markedAsReceived } = req.body
    Settlement.findByIdAndUpdate(settlementId, {
        markedAsReceived: !markedAsReceived
    }, { new: true })
    .then(updatedSettlement => {
        res.status(200).json(updatedSettlement)
    })
    .catch(err => next(err))
})

module.exports = router;