//script usato durante il refactor

const mongoose = require('mongoose')
const CommentsModel = require('../models/CommentsModel')

const fs = require('fs')

require('dotenv').config(
    { path: '../.env' })


//connessione al db
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection error", err))



//importa i dati
const importComments = async () => {

    try {

        //legge il file con i commenti da importare
        const commentData = JSON.parse(fs.readFileSync('./data/comments.json', 'utf-8'))


        //crea ogni documento con Mongoose per inserire i timestamps automaticamente
        for (let comment of commentData) {

            //Mongoose applica i timestamps alla creazione
            await CommentsModel.create(comment)
        }

        //console.log("Commenti creati")
        process.exit()


    } catch (error) {

        console.error("Error importing comments:", error)
        process.exit(1)
    }
}

importComments()