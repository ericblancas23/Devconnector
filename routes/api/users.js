const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });
  
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });


  router.post('/forgotPassword', (req, res) => {
    User.email = req.body.email;

    User.findOne({ email: email }, (err, user) => {
      if (err) {
          errors.server = "could not return account information";
          return res.json(errors)
      }
      if (!user) {
          errors.email = "Email is not registered under server";
          return res.json(errors);
      }
    const random = ((Math.random() * + 1).toString());
    const token = bcrypt.hash(random);
    if (!token) {
       errors.token = "Unathorized request";
       return res.json(errors);
   }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    user.save();
    res.status(200).json({ message: 'Password changed'});

    });
});



router.get('/resetPassword', (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  if (!password || !req.query.token) return json(errors);
  User.findOne({ resetPasswordToken: token }, (err, data) => {
    //unauthorized token  
    if (err) {
      errors.token = "Unauthorized request";
      return read.json(errors)
    };
    
    //if not data
    if(!data) {
        errors.data = "User not specifed with token";
        return res.json(errors);
     bcrypt.hash(password, 11,(err,hashedPassword) => {
       data.resetPasswordToken = '';
       data.password = hashedPassword;
       data.save();
       res.status(200).json({ message: 'Password changed' })
     });

    }
  });
});

  

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;


