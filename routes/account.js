const User = require("../models/User");

const router = require("express").Router();

// get User data
router.get("/:id", (req, res, next) => {
    const userId = req.payload._id
    User.findById(userId)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => next(err))     
});

// update user data
router.put('/:id', (req, res, next) => {
    // console.log('test');
    const { name, email } = req.body
    User.findByIdAndUpdate(req.params.id, {
      name,
      email
    }, { new: true })
      .then(updatedUser => {
        res.status(200).json(updatedUser)
      })
      .catch(err => next(err))
  });
  
  module.exports = router;