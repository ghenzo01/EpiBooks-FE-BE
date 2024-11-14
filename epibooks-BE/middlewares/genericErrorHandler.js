//si occupa della gestione globale degli errori dell'applicazione

//viene chiamato automaticamente ogni volta che si verifica un errore in una rotta
//o in un altro middleware, e permette di inviare una notifica ben strutturata
//al client, senza interrompere il server.

const genericErrorHandler = (err, req, res, next) => {

    //se c'è un codice errore specifico me lo restituisce, altrimenti mi dà un generico 500
    const errorStatus = err.statusCode || 500

    //se c'è un messaggio di errore specifico me lo restituisce, altrimenti mi dà un messaggio generico
    const errorMessage = err.message || 'Oops something went wrong'

    //res.status(errorStatus) imposta il codice di errore della risposta
    res.status(errorStatus)

        //res.send(...) invia una risposta JSON al client con codice errore, messaggio errore e lo stack
        .send({
            status: errorStatus,
            message: errorMessage,

            //contiene informazioni sul punto del codice in cui l'errore si è verificato
            stack: err.stack
        })
}

module.exports = genericErrorHandler


