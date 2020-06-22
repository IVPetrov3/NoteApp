const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const expressValidator = require('express-validator');
const passport = require('passport');
const path = require('path');

const app = express();


// Passport
require('./config/passport')(passport);


// Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/passProject';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

// Get the default connection
var db = mongoose.connection;


// Note model
const Note = require('./models/Note');


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


// Bodyparser
app.use(express.urlencoded({ extended: false}));
app.use(express.json());


// Set public folder
app.use(express.static(__dirname + '/public'));


// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Connect flash
app.use(flash());


// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



// Express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
}); 


// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/notes', require('./routes/notes'));
let notes = require('./routes/notes');





const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));