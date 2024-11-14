
//middleware per l'hashing della password

//dependency da installare per l'hashing della password
const bcrypt = require('bcrypt')


const hashPassword = async function (next) {

    const user = this

    //se la password non è stata modificata, passa al prossimo middleware
    if (!user.isModified('password'))
        return next()


    try {

        //salt è una stringa di dati casuali che viene aggiunta a una password prima di effettuare l’hashing
        //10 round, 12 consigliato per alta sicurezza
        const salt = await bcrypt.genSalt(10)

        //password hashata, ottenuta combinando stringa fornita da utente con salt
        user.password = await bcrypt.hash(user.password, salt)

        next()
    }

    catch (error) {
        next(error)
    }
}


module.exports = hashPassword