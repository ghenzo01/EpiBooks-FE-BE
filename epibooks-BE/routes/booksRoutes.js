

const express = require('express')

const BooksModel = require('../models/BooksModel')
const CommentsModel = require('../models/CommentsModel')

const books = express.Router()

const mongoose = require('mongoose')

const multer = require('multer')

const { cloudStorage, internalStorage, filter } = require('../middlewares/multer/storages')

const upload = multer({ storage: internalStorage })
const cloud = multer({ storage: cloudStorage, fileFilter: filter })



//rotta GET per ottenere i libri con paginazione
books.get('/books', async (req, res) => {
    const { page = 1, pageSize = 16 } = req.query

    try {

        //parte di logica per la paginazione
        const skip = (page - 1) * pageSize

        const books = await BooksModel.find()

            .limit(parseInt(pageSize))
            .skip(skip)
            .populate({
                path: 'author',
                select: 'email userName'
            })
            .populate('comments')

        const totalBooks = await BooksModel.countDocuments()

        //parte di logica per la paginazione
        const totalPages = Math.ceil(totalBooks / pageSize)


        res.status(200).json({
            books,
            totalBooks,
            totalPages,
            currentPage: parseInt(page),
            pageSize: parseInt(pageSize)
        })

    } catch (error) {


        //console.error("Errore:", error)

        res.status(500).json({
            message:
                'Error loading books',
            error: error.message
        })
    }
})


//rotta GET per la ricerca nei campi title, asin e id con paginazione
//tenere più sopra a /books/:bookId, sennò vanno in conflitto!! Senò interpreta la query dentro search come bookID!!!
books.get('/books/search', async (req, res) => {
    const { query, page = 1, pageSize = 16 } = req.query

    try {
        const searchConditions = [

            //ricerca per titolo anche parziale, con regex che specifica il case insensitive
            {
                title: {
                    $regex: query,
                    $options: 'i'
                }
            },

            //ricerca per asin completo
            { asin: query }
        ]

        //ricerca per _id completo
        //verifica se query è un ObjectId valido prima di includere `_id` nelle opzioni di ricerca
        if (mongoose.Types.ObjectId.isValid(query)) {
            searchConditions.push({

                _id: query
            })
        }

        //$or: operatore che accetta un array di condizioni e restituisce tutti i documenti che ne soddisfano almeno una
        const skip = (page - 1) * pageSize //calcola l'offset per la paginazione

        const books = await BooksModel.find({
            $or: searchConditions
        })
            .limit(parseInt(pageSize))
            .skip(skip)

        const totalBooks = await BooksModel.countDocuments({
            $or: searchConditions
        }) //calcola il numero totale di libri trovati

        //calcola il numero totale di pagine in base ai risultati trovati e alla dimensione della pagina
        const totalPages = Math.ceil(totalBooks / pageSize)

        res.status(200)
            .json({
                books,
                totalBooks,
                totalPages,
                currentPage: parseInt(page),
                pageSize: parseInt(pageSize)
            })

    } catch (error) {
        console.error("Error while searching for books:", error)

        res.status(500).json({
            message: 'Error while searching for books',
            error: error.message
        })
    }
})



books.get('/books/:bookId', async (request, response, next) => {

    const { bookId } = request.params

    try {
        const book = await BooksModel.findById(bookId)

        if (!book) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: `No books found with the given ID:${bookId}`
                })
        }

        response
            .status(200)
            .send(book)

    } catch (e) {
        next(e)
    }
})





//rotta per l'upload di un'immagine su Cloudinary

//upload singola immagine
books.post('/books/uploadImage/cloudinary', cloud.single('img'), async (req, res, next) => {
    try {
        // restituisce il path dell'immagine su Cloudinary
        res.status(200).json({

            img: req.file.path
        })

    } catch (e) {
        next(e)
    }
})


//rotta per l'upload di un'immagine locale nella cartella uploads
books.post('/books/uploadImage/local', upload.single('img'), async (req, res, next) => {
    try {
        console.log("in upload local")
        // restituisce indirizzo fisico su cui è salvato il nostro file
        // http o https = protocol :// host
        const url = `${req.protocol}://${req.get('host')}`

        // arriverà così: /uploads/nomefile-asdasfdsadfgsdfg.jpg
        const imgUrl = req.file.filename

        res.status(200).json({
            img: `${url}/uploads/${imgUrl}`
        })

    } catch (e) {
        next(e)
    }
})


//per l'update/modifica dei dati. Differentemente dalla PUT, con la PATCH potrei 
//inviare oggetti contenenti anche solo una parte dei campi  di un documento (record di MongoDB)
books.patch('/books/update/:bookId', async (request, response, next) => {
    const { bookId } = request.params

    try {
        const updatedBookData = {
            ...request.body,

            //mi serve questo ternario perchè l'immagine definita di default, da assegnare qualora il valore img non
            //è passato, non viene assegnata, nè con img="", nè con img=undefined
            img: request.body.img === "" ? "https://picsum.photos/200/300" : request.body.img

        }
        //console.log("updatebookdata.img: ", updatedBookData.img)

        //NB: la patch di Mongoose non valida automaticamente i dati secondo lo Schema, se voglio una
        //validazione, come quella che avviene di default nella POST, posso mettere runValidators: true
        const options = {
            new: true,
            runValidators: true
        }

        const result = await BooksModel.findByIdAndUpdate(bookId, updatedBookData, options)

        response.status(200).send(result)
    } catch (e) {
        next(e)
    }
})


books.delete('/books/:bookId', async (req, res, next) => {
    const { bookId } = req.params
    try {
        const book = await BooksModel.findByIdAndDelete(bookId)

        if (!book) {

            return res
                .status(400)
                .send({
                    statusCode: 400,
                    message: 'No books with the given ID'
                })
        }

        //cancello anche tutti i commenti relativi al libro eliminato, cioè i documenti del CommentModel
        //il cui campo book coincide col bookId del libro eliminato
        await CommentsModel.deleteMany({
            book: bookId
        })

        res
            .status(200)
            .send({
                statusCode: 200,
                message: 'Book and related comments deleted successfully'
            })


    } catch (e) {
        next(e)
    }
})




//rotta per prendere il libro e i commenti in un unico passaggio
books.get('/books/:bookId/details', async (request, response, next) => {
    const { bookId } = request.params
    try {

        //cerca il libro per ID e popola il suo campo 'comments', che è un array di ObjectId,
        //con i dati effettivi dei commenti del modello 'commentsModel'
        const book = await BooksModel
            .findById(bookId)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: '_id userName books'
                }
            })


        if (!book) {
            return response
                .status(404)
                .send({
                    statusCode: 404,
                    message: `No book found with the given ID: ${bookId}`
                })
        }

        response
            .status(200)
            .send({
                statusCode: 200,
                book
            })

    } catch (e) {
        next(e)
    }
})









//rotta POST per aggiungere un nuovo libro
books.post('/books/create', async (request, response, next) => {
    try {

        //creo nuovo oggetto book
        const newBook = new BooksModel({
            asin: request.body.asin,
            price: request.body.price,

            //mi serve questo ternario perchè l'immagine definita di default, da assegnare qualora il valore img non
            //è passato, non viene assegnata, nè con img="", nè con img=undefined
            img: request.body.img === "" ? "https://picsum.photos/200/300" : request.body.img,


            category: request.body.category,
            title: request.body.title
        })

        //salvataggio
        const savedBook = await newBook.save()

        response.status(201).send({
            statusCode: 201,
            message: 'Book saved successfully',
            savedBook
        })

    } catch (e) {
        next(e)
    }
})














module.exports = books
