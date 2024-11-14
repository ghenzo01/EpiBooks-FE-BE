

//NB: serve installare @sendgrid/mail
//npm i @sendgrid/mail

const express = require('express')
const sgMail = require('@sendgrid/mail')

const verifyToken = require('../middlewares/verifyToken')
const validateEmailBody = require('../middlewares/validateEmailBody')

const email = express.Router()

//configuro @sendgrid/mail con la mia API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


email.post('/sendEmail', verifyToken, validateEmailBody, async (req, res, next) => {
    const msg = {

        //destinatario ricevuto dal frontend
        to: req.body.to,

        //mittente verificato, preso dalle environment variables
        from: process.env.SENDGRID_SENDER,
        subject: req.body.subject,
        text: req.body.emailText,
    }

    try {

        await sgMail.send(msg)
        res.status(200).send({
            statusCode: 200,
            message: 'Your mail has been sent!'

        })


    } catch (error) {
        console.error('Error during sending mail: ', error)
        res.status(500).send({
            statusCode: 500,
            message: 'Error during sending mail',
            errorDetails: error.response ? error.response.body : 'Unknown error'
        })
    }



})

module.exports = email
