const Trip = require("../models/Trip");
const User = require("../models/User");
const Expence = require("../models/Expence");
const { populate } = require("../models/Trip");
const Settlement = require("../models/Settlement");
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
                    if (String(debitor._id) == userId) {                    
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


// get credit/debt of all trip participants  
router.get('/:id/users-creditAndDebt', (req, res, next) => {
    const tripId = req.params.id
    const userId = req.payload._id

    Settlement.find({trip: tripId})
    .populate('debitor')
    .populate('creditor')
    .then(settlementsFromDB => {
        console.log('settlements:',settlementsFromDB);
        res.status(200).json({settlementsFromDB})
    })
    .catch(err => next(err))

    // let tripParticipants = []
    // let allUsersCreditAndDebt = []
    // let creditors = []
    // let debitors = []
    // // Find the current trip
    // Trip.findById(tripId)
    // .then(trip => {  
    //     tripParticipants = trip.participants
    //     Expence.find({_id: {$in: trip.expences}})
    //     .populate('debitors')
    //     .then(expences => {
    //         tripParticipants.map(participant => {
    //         if (participant.joining === true) {
    //             // console.log('Participant', participant); 
    //             let userTotalDebt = 0
    //             let userTotalCredit = 0

    //             let user = {_id: participant.id, settlementDone: false}
    //             // console.log('type: ', typeof user.markedAsPaied);
    //             // if (typeof user.markedAsPaied == 'undefined') {
    //             //     console.log('ja');
    //             //     user.markedAsPaied = false
    //             //     console.log('type: ', typeof user.markedAsPaied);
    //             // }
    //             allUsersCreditAndDebt.push(user)
    //             expences.map(expence => {
    //                 if (String(participant._id) === String(expence.creditor)) {
    //                     // console.log('expence.creditor: ', expence.creditor, 'participant._id: ', participant._id);
    //                     userTotalCredit += expence.amount
    //                     user.credit = userTotalCredit
    //                 }
    //                 expence.debitors.map(debitor => {
    //                     // console.log('debitor: ', debitor);
    //                     if (String(participant._id) === String(debitor._id)) {
    //                         // console.log('debitor: ', debitor);
    //                         userTotalDebt += debitor.debitorDebt
    //                         user.userDebt = userTotalDebt
    //                         user.name = debitor.name  
    //                         user.markedAsPaied = debitor.markedAsPaied                         
    //                     } 
    //                 })
    //             })
    //         }             
    //         })
        
    //         allUsersCreditAndDebt.map(user => {
    //             if (user.credit && user.credit > user.userDebt) {
    //                 user.credit = user.credit - user.userDebt
    //                 user.userDebt = 0
    //                 creditors.push(user)
    //             } else {
    //                 debitors.push(user)
    //             }
    //         }) 
    //         // console.log('allUsersCreditAndDebt: ', allUsersCreditAndDebt);
    //         // console.log('creditors 1 : ', creditors);
    //         // console.log('debitors 1 : ', debitors);
    //         creditors.map(creditor => {
    //             debitors.map((debitor, index) => {
    //                 let res = creditor.credit - debitor.userDebt
    //                 // console.log(res);
    //                 // console.log(creditor.name, creditor.credit);
    //                 // console.log('debitor: ', debitor);
    //                 if (res < 0 && debitor.settlementDone === false) {
    //                     if (!creditor.debitor) {
    //                         creditor.debitor = []
    //                     }   
    //                     if (!debitor.payCreditors) {
    //                         debitor.payCreditors = []
    //                     } 
    //                     // console.log('credit: ', creditor.credit);                    
    //                     debitor.paing = creditor.credit
    //                     // console.log('paing: ', debitor.paing);  
    //                     let debitorCopy = {...debitor}
    //                     debitorCopy.settlementDone = true
    //                     debitorCopy.userDebt = 0
    //                     debitor.payCreditors.push({creditorName : creditor.name, amount : debitor.paing })
    //                     creditor.debitor.push(debitorCopy)
    //                     debitor.userDebt -= creditor.credit
    //                     creditor.credit= 0
    //                 } else if (res > 0 && debitor.settlementDone === false) {
    //                     if (!creditor.debitor) {
    //                         creditor.debitor = []
    //                     } 
    //                     if (!debitor.payCreditors) {
    //                         debitor.payCreditors = []
    //                     }   
    //                     creditor.credit -= debitor.userDebt
    //                     debitor.settlementDone = true
    //                     debitor.paing = debitor.userDebt
    //                     let debitorCopy1 = {...debitor}
    //                     debitorCopy1.userDebt = 0
    //                     debitor.payCreditors.push({creditorName : creditor.name , amount : debitor.paing })
    //                     creditor.debitor.push(debitorCopy1)
    //                     debitor.userDebt = 0
    //                     creditor.credit -= debitor.userDebt                       
    //                 } else if (res === 0 && debitor.settlementDone === false) {
    //                     if (!creditor.debitor) {
    //                         creditor.debitor = []
    //                     }
    //                     if (!debitor.payCreditors) {
    //                         debitor.payCreditors = []
    //                     } 
    //                     debitor.paing = debitor.userDebt
    //                     debitor.settlementDone = true
    //                     debitor.payCreditors.push({creditorName : creditor.name , amount : debitor.paing })
    //                     let debitorCopy2 = {...debitor}
    //                     debitorCopy2.userDebt = 0
    //                     creditor.debitor.push(debitorCopy2)
    //                     creditor.credit = 0
    //                     debitor.userDebt = 0
    //                 }
    //             })
    //         })
    //         // console.log('creditors 2 : ', creditors, 
    //         // 'creditor 1 debitors : ', creditors[0].debitor,
    //         // 'debitor 1 pay to: ', debitors[0].payCreditors,
    //         // // 'creditor 2 debitors : ', creditors[1].debitor,
    //         // 'debitor 2 pay to: ', debitors[1].payCreditors
    //         // );
    //         // console.log('debitors 2 : ', debitors);
    //         res.status(200).json({creditors, debitors}) 
    //     })
    //     .catch(err => next(err))
    // })
    // .catch(err => next(err))
  });

// create random ID
const uniqueId = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

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
        // console.log('delted Settlements: ', deltedSettlements);
    })

    let allUsersCreditAndDebt = []
    let creditors = []
    let debitors = []

    // const findTrip = Trip.findById(tripId)
    // .populate({ 
    //        path: 'expences',
    //        populate: {
    //         path: 'debitors',
    //         model: 'Expence'
    //        }
    //     })
    // const findSettlements = Settlement.find({trip: tripId})

    // Promise.all([findTrip, findSettlements])
    // .then(dataFromDB => {
    //     console.log('data from DB: ', dataFromDB);
    //     console.log(dataFromDB[0].expences);
    // })

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
                        // console.log('user',user);
                        allUsersCreditAndDebt.push(user)
                        // console.log('allUsersCreditAndDebt0:', allUsersCreditAndDebt);
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
                        console.log('settlementsFromDB', settlementsFromDB);
                        settlementsFromDB.forEach(settlement => {
                            if (String(participant._id) === String(settlement.creditor)) {
                                userTotalCredit -= settlement.amount
                                user.credit = userTotalCredit
                                console.log('user.credit', user.credit);
                            } else if (String(participant._id) === String(settlement.debitor)) {
                                userTotalDebt -= settlement.amount
                                user.userDebt = userTotalDebt
                                console.log('user.userDebt', user.userDebt);
                            }
                        })
                    }             
                    })
            
            console.log('allUsersCreditAndDebt1:', allUsersCreditAndDebt);

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
                    console.log(createdSettlement);
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
            // console.log('creditors', creditors);
            // console.log('debitors', debitors);
            creditors.map(creditor => {
                debitors.map((debitor, index) => {
                    let res = creditor.credit - debitor.userDebt
                    if (res < 0 && debitor.settlementDone === false) {
                        // if (!creditor.debitor) {
                        //     creditor.debitors = []
                        // }   
                        // if (!debitor.payCreditors) {
                        //     debitor.payCreditors = []
                        // }   
                        // console.log('Res neg');              
                        // debitor.paing = creditor.credit
                        // let debitorCopy = {...debitor}
                        // debitorCopy.settlementDone = true
                        // debitorCopy.userDebt = 0
                        // debitor.creditor = creditor.name
                        // debitor.creditorId = creditor._id
                        // creditor.debitors.push(debitorCopy)
                        debitor.userDebt -= creditor.credit
                        if (creditor.credit !== 0) {
                            createSettlement(creditor, debitor, creditor.credit)
                        }
                        creditor.credit= 0
                        
                    } else if (res > 0 && debitor.settlementDone === false) {
                        // if (!creditor.debitors) {
                        //     creditor.debitors = []
                        // } 
                        // if (!debitor.creditor) {
                        //     debitor.creditor = []
                        // }   
                        creditor.credit -= debitor.userDebt
                        debitor.settlementDone = true
                        // debitor.paing = debitor.userDebt
                        // let debitorCopy1 = {...debitor}
                        // debitorCopy1.userDebt = 0
                        // debitor.creditor = creditor.name
                        // debitor.creditorId = creditor._id
                        // creditor.debitors.push(debitorCopy1
                        if (debitor.userDebt !== 0) {
                            createSettlement(creditor, debitor, debitor.userDebt)
                        }
                        debitor.userDebt = 0
                        // creditor.credit -= debitor.userDebt
                                               
                    } else if (res === 0 && debitor.settlementDone === false) {
                        // if (!creditor.debitors) {
                        //     creditor.debitors = []
                        // }
                        // if (!debitor.creditor) {
                        //     debitor.creditor = []
                        // } 
                        // debitor.paing = debitor.userDebt
                        debitor.settlementDone = true
                        // debitor.creditor = creditor.name 
                        // debitor.creditorId = creditor._id
                        // let debitorCopy2 = {...debitor}
                        // debitorCopy2.userDebt = 0
                        // creditor.debitors.push(debitorCopy2)
                        if (debitor.userDebt !== 0) {
                            createSettlement(creditor, debitor, debitor.userDebt)
                        }                        
                        creditor.credit = 0
                        debitor.userDebt = 0
                        
                    }
                })
            })
        })
            // console.log('debitors2', debitors);
            
            


            // debitors.forEach(debitor => {
            //     Settlement.findOne({
            //         $and: [{creditor: debitor.creditorId}, {debitor: debitor._id}, {trip: tripId}]
            //     })
            //     .then(settlementFromId => {
            //         if (settlementFromId === null) {
            //             Settlement.create({
            //                 creditor: debitor.creditorId,
            //                 debitor: debitor._id,
            //                 trip: tripId,
            //                 amount: debitor.paing
            //             })
            //             .then(createdSettlement => {
            //                 console.log(createdSettlement);
            //             })
            //             .catch(err => next(err))
            //         } else {
            //             console.log('already exsists');
            //             settlementFromId.creditor = debitor.creditorId
            //             settlementFromId.debitor = debitor._id
            //             settlementFromId.trip = tripId
            //             settlementFromId.amount = debitor.paing
            //             settlementFromId.save()
            //             .then(savedObj => {
            //                 // console.log('savedObj',savedObj);
            //               });
            //         }
            //         // console.log('settlementFromId', settlementFromId);
            //     })
            //     .catch(err => next(err))

            //})
            
            // console.log('debitors', debitors, 'creditors', creditors);
            res.status(200).json({creditors, debitors}) 
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))


    // console.log('settlemnt backend');
    // const { markedAsPaied } = req.body
    // const tripId = req.params.id
    // const debitorId = req.body 
    // console.log(req.body);
    // Trip.findById(tripId)
    // .then(trip => {
    //     Expence.find({_id: {$in: trip.expences}})
    //     .then(expences => console.log('expences',expences))
    // })
    
    // .populate('expences')
    // .populate({ 
    //     path: 'expences',
    //     populate: {
    //      path: 'debitors',
    //      model: 'Expence'
    //     }
    //  })
    // .then(trip => {
    //     trip.expences.forEach(expence => {
    //         expence.debitors.forEach(debitor => {
    //             if (true) {
    //                 console.log('click');
    //                 debitor.markedAsPaied = !debitor.markedAsPaied
    //                 debitor.save()
    //                 .then(savedDebitor => {
    //                     savedDebitor === debitor 
    //                 })
    //             }
    //         })
            
    //     });
    //     console.log(trip.expences[0].debitors);
    //     // console.log(trip.expences[1].debitors);

    // })
    // User.findByIdAndUpdate(req.params.id, {
    //   name,
    //   email
    // }, { new: true })
    //   .then(updatedUser => {
    //     res.status(200).json(updatedUser)
    //   })
    //   .catch(err => next(err))
});

router.put('/:id/markedAsPaied', (req, res) => {
    console.log('clicked backend');
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
    console.log('clicked backend');
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