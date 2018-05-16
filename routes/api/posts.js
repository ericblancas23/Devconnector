const express = require('express');
const router = express.Router();

//@route Get
//@desct tests post route
//@access public route


router.get('/test', (req, res) => 
   res.json({ message: 'Posts Works '})
);


module.exports = router;