

const mongoose = require('mongoose')
const hashPassword = require('../middlewares/hashPassword')



//definizione dello schema utente
const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: function () {

            //email è unica solo se l'utente non usa un provider esterno
            return !this.authProvider
        },
        required: function () {

            //email obbligatoria solo se l'utente non usa un provider esterno
            return !this.authProvider
        }
    },

    password: {
        type: String,
        required: function () {

            //la password obbligatoria solo se l'utente non usa un provider esterno
            return !this.authProvider
        },
        minLength: 8
    },


    userName: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'editor'],
        default: 'user'
    },

    isActive: {
        type: Boolean,
        default: true
    },

    dob: {
        type: Date,
        default: new Date()
    },

    //identifica il provider esterno (github, google,...)
    authProvider: {
        type: String,
        enum: ['github', 'google', null],
        default: null
    },

    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booksModel'


    }]
},


    {
        timestamps: true,
        strict: true
    })


//hook che fa in modo che la password venga hashata prima di essere salvata, in modo da salvare la password hashata
UserSchema.pre('save', hashPassword)


module.exports = mongoose.model('userModel', UserSchema, 'users')
