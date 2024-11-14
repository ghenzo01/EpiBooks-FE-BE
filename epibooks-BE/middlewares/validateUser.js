const { body, validationResult } = require('express-validator')

const validateUserBody = [

    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('The e-mail address in not correct'),



    body('password')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must be almost 8 characters'),


    body('userName')
        .notEmpty()
        .isString()
        .isLength({ min: 5 })
        .withMessage('Username must be almost 5 characters'),


    body('isActive')

        //campo facoltativo
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),

    body('dob')
        .optional()
        .isDate()
        .withMessage('Date of birth must be a valid date format'),




    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            //trasformo l'array degli oggetti error in un array di messaggi di errore, estraendo i soli messaggi di errore
            //dagli oggetti error, che hanno molte più informazioni
            const errorMessages = errors.array().map(error => error.msg)

            //invio l'array dei messaggi di errore al client
            return res.status(400).send({
                errors: errorMessages
            })
        }
        next()
    }
]

module.exports = { validateUserBody }

