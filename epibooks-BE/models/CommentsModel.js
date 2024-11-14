const mongoose = require('mongoose')


const CommentSchema = new mongoose.Schema({


    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booksModel'
    },
    comment: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: false,
        default: 0
    }

},

    { timestamps: true, strict: true })




module.exports = mongoose.model('commentsModel', CommentSchema, 'comments')
