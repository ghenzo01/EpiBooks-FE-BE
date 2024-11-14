//script usato durante il refactor

const mongoose = require('mongoose')
const BooksModel = require('../models/BooksModel')

const fs = require('fs')

require('dotenv').config(
    { path: '../.env' })

//connessione al db
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection error", err))



//importa i dati
const importBooks = async () => {
    try {

        //legge il file con i commenti da importare

        //scommentare le seguenti righe una alla volta ed eseguire lo script volta per volta

        const booksData = JSON.parse(fs.readFileSync('./data/fantasy.json', 'utf-8'))
        //const booksData = JSON.parse(fs.readFileSync('./data/horror.json', 'utf-8'))
        //const booksData = JSON.parse(fs.readFileSync('./data/scifi.json', 'utf-8'))
        //const booksData = JSON.parse(fs.readFileSync('./data/history.json', 'utf-8'))
        //const booksData = JSON.parse(fs.readFileSync('./data/romance.json', 'utf-8'))


        //crea ogni documento con Mongoose per inserire i timestamps automaticamente
        for (let book of booksData) {

            //Mongoose applica i timestamps alla creazione
            await BooksModel.create(book)
        }

        console.log("Books imported successfully with timestamps")
        process.exit()

    } catch (error) {


        console.error("Error importing books:", error)
        process.exit(1)
    }
}

importBooks()