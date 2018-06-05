const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//@route Get
//@desct tests post route
//@access public route


router.get('/test', (req, res) => 
   res.json({ message: 'Posts Works '})
);

//@route Get posts
//@desct getting posts and sort
//@access public route


router.get('/', (req, res) => {
    Post.find()
      .sort({ date: -1 })
      .then(posts => res.json(posts))
      .catch(err => res.status(404).json({ nopostsFound: "no posts are found"}));
});

//@route Get posts by id
//@desct getting posts by id
//@access public route

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
     .then(posts => res.json(posts))
     .catch(err => res.status(404).json({ nopostfound: "no post was found within this id"}));
});

//@route Post create new posts
//@desct create new
//@access private route

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
        return res.status.json({ message: errors })
    } 

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.body.id
    })
    newPost.save().then(post => res.json(post))
});

//@route delete posts
//@desct delete posts 
//@access private route

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    Profile.findOne({ user: req.params.id }).then(profile => {
        Posts.findById(req.params.id) 
         .then(post => {
             if (post.toString() !== req.user.id) {
                 return res.status.json({ notauthorized: 'forbidden access' })
             }
         })

         //Delete
         post.remove().then(() => res.json({ sucess: true }))
    })
    .catch(err => res.status(404).json({ postnotfound: 'no posts found' }))
});

router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyliked: 'User already liked this post' });
            }
  
            // Add user id to likes array
            post.likes.unshift({ user: req.user.id });
  
            post.save().then(post => res.json(post));
          })
          .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
      });
    }
);

router.post('/unlike/:id', passport.authenticate('jwt', { session: false }),   (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this post' });
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
 });

 router.post('/comment/:id', passport.authenticate( 'jwt', { session: false}), (req, res) => {
   const { errors, isValid } = validatePostInput(req.body);

   if (!isValid) {
       return res.status(404).json({ message: 'post is not valid '});
   }

   Post.findById({ user: req.params.id })
    .then(post => {
        const newComment = {
            name: req.body.name,
            text: req.body.text,
            avatar: req.body.avatar,
            user: req.params.id
        }
    Posts.comments.unshift(newComment);
    Posts.save().then(post => res.json.post);
    })
    .catch(err => res.status(404).json({ message: 'no post was found'}));

 });

//  router.delete('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//      Post.findById({ user: req.params.id}).then(post => {
//          if (
//              post.comments.filter(
//                  comment => comment._id.toString() === req.params.comment_id
//              ).length == 0
//          ) {
//              return res.status(404).json({ commentdoesnotexist: 'comment does not exist'});
//          }
//          const removeIndex = post.comments
//            .map( item => item._id.toString())
//            .indexOf(req.params.comment_id)

//            post.comments.splice(removeIndex, 1);
//            post.save().then(post => res.json(post))
//      })
//      .catch(err => res.status(404).json({ message: 'post does not exist'}))
//  });
router.delete(
    '/comment/:id/:comment_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Post.findById(req.params.id)
        .then(post => {
          // Check to see if comment exists
          if (
            post.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentnotexists: 'Comment does not exist' });
          }
  
          // Get remove index
          const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);
  
          // Splice comment out of array
          post.comments.splice(removeIndex, 1);
  
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    }
  );
module.exports = router;