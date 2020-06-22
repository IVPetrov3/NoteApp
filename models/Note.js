const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', NoteSchema);


/* User.save().then(result => {
    console.log('User saved!')
    mongoose.connection.close()
  })  */

module.exports = Note;