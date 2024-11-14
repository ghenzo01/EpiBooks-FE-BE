

const express = require('express')
const comments = express.Router()

const BookModel = require('../models/BooksModel')
const CommentModel = require('../models/CommentsModel')

const verifyToken = require('../middlewares/verifyToken')


comments.get('/comments', async (req, res, next) => {
    try {
        const comments = await CommentModel
            .find()
            .populate('book')

        res
            .status(200)
            .send(comments)
    }
    catch (e) {
        next(e)
    }
})




//rotta di "debug" per verificare se esistono ancora i commenti dei libri cancellati
//mantenere sotto la rotta generica /comments, senò va in conflitto !!

//http://localhost:4040/comments/comments/6732182d04ebfd19c6b02840
//http://localhost:4040/comments/comments/6732183604ebfd19c6b02846

comments.get('/comments/:commentId', async (req, res, next) => {
    const { commentId } = req.params
    try {

        const comment = await CommentModel

            .findById(commentId)

        if (!comment) {

            return res
                .status(404)
                .send({
                    statusCode: 404,
                    message: 'Comment not found'
                })
        }

        res
            .status(200)
            .send(comment)
    }
    catch (e) {
        next(e)
    }
})





comments.post('/create', verifyToken, async (req, res, next) => {
    //console.log("entro in /comments/create")
    //console.log("body:", req.body)

    try {
        const book = await BookModel.findById(req.body.book)

        if (!book) {

            return res
                .status(404)
                .send({
                    message: 'Book not found'
                })

            //console.log("libro non trovato")
        }

        //creo corpo del commento basandomi sullo schema
        const newComment = new CommentModel({
            comment: req.body.comment,
            rate: Number(req.body.rate),
            author: req.body.author,
            book: book._id,

        })

        const savedComment = await newComment.save()

        //aggiorna il documento del libro associato aggiungendo l'ID del commento all'array comments
        await BookModel.findByIdAndUpdate(
            book._id,
            {
                $push: {

                    comments: savedComment._id
                }
            })


        res
            .status(201)
            .send(savedComment)

    } catch (e) {
        console.error("Error in creating comment:", e.message)
        next(e)
    }
})






comments.put('/:commentId', verifyToken, async (req, res, next) => {
    try {
        const { commentId } = req.params

        //se il commento non esiste non ho niente da aggiornare
        const existingComment = await CommentModel.findById(commentId)


        if (!existingComment) {

            return res
                .status(404)
                .send({
                    message: 'Comment not found'
                })

        }


        //trova libro (se non lo trova me lo notifica)
        const book = await BookModel.findById(req.body.book)

        if (!book) {


            return res
                .status(404)
                .send({

                    message: 'Book not found'
                })
        }


        const updatedCommentData = {
            comment: req.body.comment,
            rate: Number(req.body.rate),
            author: req.body.author,
            book: book._id,
        }

        const updatedComment = await CommentModel.findByIdAndUpdate(commentId, updatedCommentData, {
            new: true,

            //valida dati, operazione non automatica per la PUT, va specificata
            runValidators: true
        })

        res
            .status(200)
            .send(updatedComment)


    } catch (e) {

        //console.error("Errore", e.message)
        next(e)
    }



})






comments.delete('/:commentId', verifyToken, async (req, res, next) => {
    try {

        const { commentId } = req.params

        //cerca commento da cancellare

        const comment = await CommentModel.findById(commentId)
        if (!comment) {
            return res
                .status(404)
                .send({ message: 'Comment not found' })

        }

        //console.log("commento trovato")

        //rimuove l'ID del commento dall'array comments nel documento del libro associato
        await BookModel.findByIdAndUpdate(
            comment.book,
            { $pull: { comments: comment._id } })



        //eliminazione
        await CommentModel.findByIdAndDelete(commentId)

        res
            .status(200)
            .send({ message: 'Comment deleted successfully' })
    } catch (e) {


        next(e)
    }
})





module.exports = comments
