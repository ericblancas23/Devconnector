const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const profile = require('../../models/profile');
const user = require('../../models/User');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//@route Get
//@desct tests post route
//@access public route

router.get('/test', (req, res) => 
   res.json({ message: "Profile Works "})
);



//@route Get  authentication
//@desct tests post route
//@access private route

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.user.id})
      .populate('user', ['name', 'avatar'])
      .then( profile => {
          if (!profile) {
              errors.nonprofile = "no profile was found"
              return res.status(404).json(errors)
          }
          res.json(profile)
      .catch(err => {
          return res.status(404).json(err);
      })
    })
});




//@route Get /all profiles
//@desct tests post route
//@access public route

router.get('/all', (req, res) => {
    const errors = {}

   Profile.find()
    .populate('user', ['avatar', 'name'])
      .then(profiles => {
          if (!profile) {
            errors.noprofile = "no profiles"
            return res.status(404).json(errors);
          }
          res.json(profiles)
      .catch(err => {
         return res.status(404).json({ profile: 'no profiles listed' })
        })
      })
});


//@route Get profile id
//@desct tests post route
//@access public route

router.get('/handle/:handle', (req, res) => {
  const errors = {}
   Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = "there is no existing profile";
        res.status(404).json(errors)
      } 
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

router.get('/user/:user_id', (req, res) => {
  const errors = {}
   Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = "there is no existing profile";
        res.status(404).json(errors)
      } 
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'there is no profile for this user'}));
});

 


//@route post create profile
//@desct tests post route
//@access private route

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);



//@route post /api/profile/experience
//@desct tests post route
//@access private route

router.post('/experience', passport.authenticate({ session: false}, (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
Profile.findOne( {user: req.user.id}.then(profile => {
    const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
    };
        // new elements into array
    profile.experience.unshift(newExp);

    profile.save().then(profile => res.json(profile));
    }));
}));

router.delete('/experience/:exp_id', passport.authenticate({ session: false }), (req, res) => {
  profile.findOne({ user: req.user.id }).then(profile => {
    const removeIndex = profile.experience.map()
  })
});

router.post('/education', passport.authenticate({ session: false}, (req, res) => {
  const { errors, isValid } = validateEInput(req.body);

  if(!isValid) {
      return res.status(400).json(errors);
  }
Profile.findOne( {user: req.user.id}.then(profile => {
  const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldOfStudy: req.body.fieldOfStudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
  };
      // new elements into array
  profile.education.unshift(newEdu);

  profile.save().then(profile => res.json(profile));
  }));
}));

router.delete('/', passport.authenticate({ session: false }), (req, res) => {
   Profile.findOneAndRemove({ user: req.user.id}).then(() => {
     User.findOneAndRemove({ _id: req.user.id}).then(() => {
       res.json({ success: true });
     })
   })
});

module.exports = router;