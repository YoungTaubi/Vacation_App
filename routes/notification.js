const router = require("express").Router();
const User = require("../models/User");

router.put('/updateNotification/true', (req, res, next) => {
    const receiverId = req.body.receiverId
    User.findByIdAndUpdate(receiverId, {
        notificationState: true
    }, { new: true })
        .then(updatedUser => {
            res.status(200).json(updatedUser)
        })
        .catch(err => next(err))
});

router.put('/updateNotification/false', (req, res, next) => {
    const userId = req.payload._id
    User.findByIdAndUpdate(userId, {
        notificationState: false
    }, { new: true })
        .then(updatedUser => {
            res.status(200).json(updatedUser)
        })
        .catch(err => next(err))
});

router.get('/', (req, res, next) => {
    const userId = req.payload._id
    User.findById(userId)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => next(err))
});



module.exports = router;