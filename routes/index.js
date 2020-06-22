const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Note model
const Note = require('../models/Note');


// Welcome page
router.get('/', (req, res) => res.render('Welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, function (req, res) {
    Note.find({}, function(err, notes) {
        if(err) {
            congole.log(err);
        } else {
            res.render('dashboard', {
                name: req.user.name,
                notes: notes
            });
        }
    });
});


module.exports = router;