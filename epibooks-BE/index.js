// dopo aver installato dotenv (npm i dotenv)
// con la seguente riga posso leggere le environment variables
// NB: tenerlo in cima al file, senò si rischia che non vengano riconosciute le variabili di ambiente
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

require('./models/CommentsModel')

//importa le rotte
const booksRoutes = require('./routes/booksRoutes')
const commentsRoutes = require('./routes/commentsRoutes')
const usersRoutes = require('./routes/usersRoutes')
const loginRoutes = require('./routes/loginRoutes')
const mailRoutes = require('./routes/eMailSender')
const gitHubRoutes = require('./routes/gitHubRoutes')


// per collegare frontend e backend, se sono su domini o porte differenti, bisogna installare il pacchetto 'cors' nel backend
// npm i cors
const cors = require('cors')

// import del genericErrorHandler per la gestione degli errori
const genericErrorHandler = require('./middlewares/genericErrorHandler')

const PORT = 4040

// istanziamo express per poterne utilizzare i metodi, ho accesso a tutti i metodi di Express
const server = express()

// Abilita CORS per permettere le richieste dal frontend
server.use(cors())

// Middleware per interpretare JSON nel body delle richieste
//da abilitare prima delle rotte
server.use(express.json())

// connessione al database attraverso mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

//ascoltiamo l'evento 'error' per farci loggare un messaggio in caso di errore
db.on('error', console.error.bind(console, 'Db Connection error'))

//ascoltiamo UNA VOLTA l'evento 'open' per farci loggare un messaggio quando la connessione al db è riuscita.
db.once('open', () => {
    console.log('Db connected successfully')
})

//rotte dei libri
server.use('/', booksRoutes)
//rotte dei commenti
server.use('/comments', commentsRoutes)
//rotte degli utenti
server.use('/', usersRoutes)
//rotte di login
server.use('/', loginRoutes)
//rotte per email
server.use('/', mailRoutes)
//rotte per GitHub
server.use('/', gitHubRoutes)



//middleware per la gestione degli errori generici, da inserire alla fine di tutte le rotte
server.use(genericErrorHandler)



//mettiamo il nostro server in ascolto sulla nostra porta, loggando un messaggio quando è 'UP'
server.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))
