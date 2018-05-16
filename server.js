const express = require('express');
const mongoose = require('mongoose');
const app = express();

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser');
const passport = require('passport');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connect to mongo db 
mongoose.connect(db)
 .then(() => {
     console.log("mongodb connected");
 })
 .catch(err => {
     console.log(err);
 })

const port = process.env.PORT || 5000;

//middleware passport
app.use(passport.initialize())

//config passport
require('./config/passport')(passport);

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
})

app.get('/', (req, res) => {
    res.send('Connected!');
});
