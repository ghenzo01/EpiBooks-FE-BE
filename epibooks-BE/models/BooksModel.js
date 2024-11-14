const mongoose = require('mongoose')
require('./CommentsModel')

const BookSchema = new mongoose.Schema({
    asin: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: false,
        default: 0
    },
    img: {
        type: String,
        required: false,

        //non funziona l'assegnazione di default
        //default: 'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png'
    },
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },

    // è un semplice array di oggetti ObjectId, che però fanno riferimento agli ID dello schema 'commentsModel'
    // Lo popolerò per "sostituire" gli ID dei commenti ai dati effettivi ad essi riferiti
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentsModel'
    }]

}, { timestamps: true, strict: true })


module.exports = mongoose.model('booksModel', BookSchema, 'books')
