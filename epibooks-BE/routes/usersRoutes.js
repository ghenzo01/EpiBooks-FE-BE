
const express = require('express')
const users = express.Router()

const UserModel = require('../models/UserModel')

//importo direttamente express-validator per poter usare direttamente nel codice delle rotte i suoi metodi
const { check, validationResult } = require('express-validator')

//devo importarlo come un oggetto (con le parentesi graffe), non come una funzione (senza parentesi graffe)
//middleware di validazione che utilizza express-validator
const { validateUserBody } = require('../middlewares/validateUser')

const verifyToken = require('../middlewares/verifyToken')




//creazione nuovo utente con validazione express-validator
users.post('/users/create', validateUserBody, async (req, res, next) => {

    const userData = req.body
    const newUser = new UserModel(userData)

    //console.log('sono nella rotta')

    try {
        const savedUser = await newUser.save()
        res
            .status(201)
            .send({
                statusCode: 201,
                message: 'User created successfully',
                savedUser

            })
    } catch (error) {

        //console.error('Error during user saving', error)

        //mi invia i messaggi di errore specifici, senò non si capisce cosa succede
        res.status(400).send({

            statusCode: 400,
            message: 'Error during user creation',
            errorDetails: error.message

        })
    }
})





users.get('/users/:userId/collection/', verifyToken, async (req, res, next) => {
    const { userId } = req.params
    const { page = 1, pageSize = 10 } = req.query
    // console.log("Entrato nella rotta GET per la collezione paginata dell'utente con ID:", userId)

    try {
        const user = await UserModel
            .findById(userId)
            .populate({
                path: 'books',
                options: {
                    skip: (page - 1) * pageSize,
                    limit: parseInt(pageSize),
                }
            })

        if (!user) {
            //console.log("Utente non trovato:", userId)

            return res.status(404).send({
                statusCode: 404,
                message: `No user found with the ID: ${userId}`
            })
        }

        const totalBooks = user.books.length
        const totalPages = Math.ceil(totalBooks / pageSize)

        //console.log(`Libri trovati per l'utente (paginati):`, user.books)

        res.status(200).send({
            statusCode: 200,
            books: user.books,
            totalBooks,
            totalPages,
            currentPage: parseInt(page),
            pageSize: parseInt(pageSize)
        })

    } catch (error) {
        //console.error("Errore GET collezione libri:", error)
        next(error)
    }
})






//rotta per aggiungere un libro alla collezione dell'utente
users.post('/users/:userId/collection', [


    //metodo verifica formato dati di express-validator
    check('bookId', 'Book ID is required and must be valid')
        .notEmpty()
        .isMongoId()

], async (req, res, next) => {

    const { userId } = req.params
    const { bookId } = req.body

    //console.log('userId:', userId) 
    //console.log('bookId:', bookId) 

    //raccoglie eventuali errori forniti dalla check
    const errors = validationResult(req)


    if (!errors.isEmpty()) {

        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Validation errors',
                errorDetails: errors.array()
            })
    }


    try {
        const user = await UserModel
            .findById(userId)

        //se non trova l'utente con quell'ID
        if (!user) {

            return res
                .status(404)
                .send({

                    statusCode: 404,
                    message: `User not found with ID ${userId}`
                })
        }

        //se il libro è già presente nella collezione
        if (user.books.includes(bookId)) {
            return res
                .status(400)
                .send({

                    statusCode: 400,
                    message: 'Book already in your collection'
                })
        }


        user
            .books
            .push(bookId)


        await user.save()

        res
            .status(200)
            .send({

                statusCode: 200,
                message: 'Book added to your collection',
                updatedBooks: user.books
            })

    } catch (error) {


        next(error)
    }
})



//rotta per rimuovere un libro dalla collezione dell'utente
users.delete('/users/:userId/collection', verifyToken, [

    //metodo verifica formato dati di express-validator
    check('bookId', 'Book ID is required and must be valid')
        .notEmpty()
        .isMongoId()

], async (req, res, next) => {

    const { userId } = req.params
    const { bookId } = req.body

    //console.log('userId:', userId)
    //console.log('bookId:', bookId)

    // raccoglie eventuali errori forniti dalla check
    const errors = validationResult(req)


    if (!errors.isEmpty()) {

        return res
            .status(400)
            .send({
                statusCode: 400,
                message: 'Validation errors',
                errorDetails: errors.array()
            })
    }


    try {
        const user = await UserModel
            .findById(userId)

        //se non trova l'utente con quell'ID
        if (!user) {

            return res
                .status(404)
                .send({

                    statusCode: 404,
                    message: `User not found with ID ${userId}`
                })
        }

        //se il libro non è presente nella collezione
        if (!user.books.includes(bookId)) {
            return res
                .status(400)
                .send({

                    statusCode: 400,
                    message: 'Book not found in collection'
                })
        }

        // rimuove il libro dalla collezione
        user
            .books = user
                .books
                .filter(book => book.toString() !== bookId)

        await user.save()

        res
            .status(200)
            .send({

                statusCode: 200,
                message: 'Book removed from collection',
                updatedBooks: user.books
            })

    } catch (error) {


        next(error)
    }
})



module.exports = users















