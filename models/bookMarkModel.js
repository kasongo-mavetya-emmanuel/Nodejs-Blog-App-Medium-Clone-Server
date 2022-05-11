const mongoose= require('mongoose');

const bookMarkSchema= mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:[true, 'A bookMark must have an author']
    },

    blog: {
        type:mongoose.Schema.ObjectId,
        ref: 'Blog',
        required:[true, 'A blog must have an blog']
    }
});

const BookMark= mongoose.model('BookMark', bookMarkSchema);

module.exports= BookMark;