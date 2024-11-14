//NB: serve installare jsonwebtoken

//npm i jsonwebtoken

const express = require('express')
const login = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserModel = require('../models/UserModel')


login.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body

        //cerca utente by mail
        const user = await UserModel.findOne({ 
            email })

        if (!user) {

            return res.status(404).send({

                statusCode: 404,
                message: 'No users found with this email.'

            })
        }

        //verifica che password, digitata dall'utente, ricalvolata con bycrypt,
        //coincida con quella dell'utente
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {

            return res.status(401).send({
                statusCode: 401,

                message: 'Incorrect password'
            })
        }

        //crea token JWT con informazioni dell'utente
        const token = jwt.sign({
            
            id: user._id,
            email: user.email,
            role: user.role,
            userName: user.userName,

            isActive: user.isActive
        }, process.env.JWT_SECRET, { 

            //impostazione durata validità del token
            expiresIn: '1h' })

        res
            .header('authorization', token)
            .status(200)

            .send({
                statusCode: 200,
                message: 'You have successfully logged in!',
                token
            })

    } catch (error) {


        next(error)
    }
})



module.exports = login

