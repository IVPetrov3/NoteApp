const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


// Note model
const Note = require('../models/Note');

// User model
const User = require('../models/User');


// Create notes page
router.get('/create', ensureAuthenticated, function (req, res) {
    Note.find({}, function(err, notes) {
        if(err) {
            console.log(err);
        } else {
            res.render('notes', {
                title: 'Add Note',
                notes: notes
            });
        }
    });
});

// Display notes
router.get('/allnotes', ensureAuthenticated, function (req, res) {
    Note.find({}, function(err, notes) {
        if(err) {
            console.log(err);
        } else {
            res.render('notescontainer', {
                title: 'All notes',
                notes: notes
            });
        }
    });
});



// Get single note
router.get('/:id', ensureAuthenticated, function(req, res) {
    Note.findById(req.params.id, function(err, note) {
        User.findById(note.author, function(err, user) {
            res.render('anote', {
                notes: note,
                author: user.name
            });
        });
    });
});



// Add submit post route
router.post('/create', function(req, res) {
    req.checkBody('title','Title is required!').notEmpty();
    req.checkBody('subject','Subject is required!').notEmpty();
    req.checkBody('text','Text is required!').notEmpty();

    // Get errors
    let errors = req.validationErrors();
    
    if(errors) {
        res.render('notes', {
            errors:errors
        });

    } else{
        const note = new Note();
        note.title = req.body.title;
        note.author = req.user._id;
        note.subject = req.body.subject;
        note.text = req.body.text;
    
        note.save(function(err) {
            if(err) {
                console.log(err);
                return;
            }else {
                req.flash('success','Note successfully added!');
                return res.redirect('/dashboard');
            }
        });

    }
});



// Load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
    Note.findById(req.params.id, function(err, note) {
        if(note.author != req.user._id) {
            req.flash('danger', 'Not authorized');
            return res.redirect('/dashboard');
        }
        res.render('editNote', {
            notes: note
        });
    });
});



// Edit submit post route
router.post('/edit/:id', function(req, res) {
    req.checkBody('title','Title is required!').notEmpty();
    req.checkBody('subject','Subject is required!').notEmpty();
    req.checkBody('text','Text is required!').notEmpty();

        // Get errors
        let errors = req.validationErrors();
        Note.findById(req.params.id, function(err, note) {
        if(errors) {
            res.render('editNote', {
                notes: note,
                errors:errors
            });
        }else {
            const note = {};
            note.title = req.body.title;
            note.subject = req.body.subject;
            note.text = req.body.text;
        
            let query = {_id:req.params.id}
        
            Note.updateOne(query, note, function(err) {
                if(err) {
                    console.log(err);
                    return;
                }else {
                    req.flash('success','Note successfully edited!');
                    res.redirect('/dashboard');
                }
            });
        }
    });
});



// Delete req route
router.delete('/:id', ensureAuthenticated, function(req, res) {
    if(!req.user._id) {
        res.status(500).send();
    }

    let query = {_id:req.params.id}

    Note.findById(req.params.id, function(err, note) {
        if(note.author != req.user._id) {
            res.status(500).send();
        } else {
            Note.deleteOne(query, function(err) {
                if(err) {
                    console.log(err);
                }
                req.flash('success','Note successfully deleted.');
                res.send('Note successfully deleted');
            });
        }
    });
});




module.exports = router;