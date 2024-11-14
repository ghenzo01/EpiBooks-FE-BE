const express = require('express')
const github = express.Router()
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const session = require('express-session')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const UserModel = require('../models/UserModel')


//configurazione base per utilizzo github
github.use(

    session({

        //uso chive segreta complessa per firmare ogni sessione di un utente
        //in questo caso usiamo la chiave GITHUB_CLIENT_SECRET che ci va bene
        secret: process.env.GITHUB_CLIENT_SECRET,

        //non risalvo la sessione se questa non ha subito modifiche
        resave: false,

        //non salva una sessione non inizializzata, vuota, senza dati
        saveUninitialized: false,





    })




)


// inizializziamo passport per l'uso
github.use(passport.initialize())
//connette passport con la sessione di express
github.use(passport.session())


// Determina come i dati dell'utente vengono memorizzati nella sessione.
// Qui ad esempio salva in sessione l'intero oggetto USER
passport.serializeUser((user, done) => {
    done(null, user)
})



// Recupera i dati dell'utente dalla sessione sotto forma di oggetto USER
passport.deserializeUser((user, done) => {
    done(null, user)
})




// usiamo la strategy che abbiamo deciso di importare (in questo caso github)
/*
* istanziamo GithubStrategy passando come oggetto di configurazione le chiavi
* precedentemente create per la nostra OAUTH APP
*
* come secondo argomento una callback (vedi documentazione) che restituisce il profilo utente
* */

passport.use(
    new GitHubStrategy(

        //passo oggetto di configurazione
        {

            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },

        //secondo argomento: callback che ritorna profilo utente se autenticazione è andata a buon fine
        (accessToken, refreshToken, profile, done) => {

            //console.log(profile)

            // qui dobbiamo eventualmente salvare l'utente!
            return done(null, profile)
        }
    )

)

//passport.authenticate è middleware

github.get('/auth/github', passport.authenticate('github',

    //scope: permessi che ho presso il provider
    //non ho accesso a tutti i dati, ma a quelli standard che github ha deciso di mostrare
    { scope: ['user:email'] }), async (req, res, next) => {


        const redirectUrl = `${process.env.FRONTEND_BASE_URL}/success?user=${encodeURIComponent(JSON.stringify(req.user))}`
        res.redirect(redirectUrl)
    })


//qui so se l'utente si è loggato con successo o no. Se no, avrò failureredirect, se sì avrò i dati e potrò generare
//il token

github.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res, next) => {
        const user = req.user

        // console.log('Utente restituito da GitHub:', user)
        // console.log('username:', user.username)
        // console.log('raw:', user._raw)
        // console.log('json login:', user._json.login)

        try {
            // Verifica se l'oggetto user e i suoi campi sono definiti
            const login = user._json.login

            if (!login) {
                throw new Error('Impossible get username from GitHub')
            }

            //uso i dati dell'utente forniti da GitHub per salvare o caricare l'utente nel database
            const userData = {
                userName: login, //username dal profilo GitHub
                role: 'user', //assegno il ruolo "user" di default per utenti esterni
            }

            const savedUser = await findOrCreateUser(userData)

            //console.log('utente salvato o trovato:', savedUser)

            //uso tutti i dati dell'utente per generare un nostro token, firmato da noi
            const token = jwt.sign(
                {
                    id: savedUser._id,
                    userName: savedUser.userName,
                    role: savedUser.role,
                },
                process.env.JWT_SECRET
            )

            //console.log('Token generato:', token)

            //nel frontend avrò rotta success alla quale allego il token con ulteriore encoding per non facilitare chi vuole rubare i dati
            const redirectUrl = `${process.env.FRONTEND_BASE_URL}/success/${encodeURIComponent(token)}`

            //redirecto l'url appena generato, col token codificato ulteriormente
            res.redirect(redirectUrl)
        } catch (error) {
            //console.error('Errore:', error.message)

            //in caso di errore, torno alla pagina di login
            res.redirect('/login')
        }
    }
)






github.get('/success', (req, res) => {
    res.redirect('http://localhost:3000/')
})



const findOrCreateUser = async (githubUser) => {
    try {
        const username = githubUser.userName // Usa _json.login per estrarre lo username
        if (!username) {
            throw new Error('Username not found in GitHub user object')
        }

        // Controlla se l'utente esiste già
        const user = await UserModel.findOne({ userName: username })

        if (user) {
            console.log('Utente già presente:', user)
            return user
        }

        // Crea un nuovo utente
        const newUser = new UserModel({
            userName: username,
            authProvider: 'github',
            email: null, // Esplicitamente null per utenti GitHub
            password: null // Esplicitamente null per utenti GitHub
        })

        await newUser.save()
        console.log('Nuovo utente creato:', newUser)
        return newUser
    } catch (error) {
        console.error('Errore durante la gestione dell\'utente:', error)
        throw new Error('Errore salvataggio utente')
    }
}





github.get('/oauth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('errore')
        }

        req.session.destroy((error) => {
            if (error) {
                // fai qualcosa
            }

            res.redirect('/')
        })
    })
})




module.exports = github