
//per poter utilizzare jsonwebtoken bisogna installarlo nel backend
//npm install jsonwebtoken


const jwt = require('jsonwebtoken')

//MIDDLEWARE DI VERIFICA DEL TOKEN JWT
module.exports = function (req, res, next) {

    //recupera il token dall'intestazione 'authorization' della richiesta
    const token = req.header('authorization')

    //se il token non è presente risponde con uno status 403 (forbidden) e un messaggio di errore
    if (!token) {
        return res
            .status(403)
            .send({
                statusCode: 403,
                message: "Token not valid or not passed"
            })
    }

    //se il token è presente prova a verificarne la validità usando JWT_SECRET nel file .env
    try {


        //se dalla verifica risulta valido, 'jwt.verify' restituirà i dati contenuti nel token
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        //aggiunge i dati verificati al campo 'user' dell'oggetto 'req' per utilizzarli successivamente
        req.user = verified

        //console.log("token ok")
        //passa il controllo al prossimo middleware o alla rotta successiva
        next()
    } catch (e) {

        //se il token non è valido o è scaduto, invia una risposta di errore 403
        res
            .status(403)
            .send({
                statusCode: 403,
                message: 'Token expired or not valid'
            })
    }
}