
//per questo middleware installare 
//npm i multer cloudinary multer-storage-cloudinary

//in caso di errore nell'installazione di multer-storage-cloudinary, installare
//npm i multer-storage-cloudinary --legacy-peer-deps

const { CloudinaryStorage } = require("multer-storage-cloudinary")
const { v2: cloudinary } = require("cloudinary")
const multer = require("multer")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'BOOKS_IMG_UPLOADS',

        //NB: allowed_formats non blocca automaticamente l'upload di file con estensioni non elencate, indica solo a
        //Cloudinary quali formati può elaborare e convertire. Posso comunque caricare un pdf, ad esempio.
        //allowed_formats: ['jpg', 'png', 'gif', 'mp4'],
        allowed_formats: ['png'],

        format: async (req, file) => 'png',
        public_id: (req, file) => file.name
    }
})

const internalStorage = multer.diskStorage({

    //in locale la destinazione degli upload è la cartella 'uploads' nella root del backend
    destination: (req, file, cb) => {
        //console.log("Setting destination for file upload")
        cb(null, 'uploads')
    },

    //non posso avere mai files con lo stesso nome, quindi creo un algoritmo che mi permette di dare un nome univoco
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = file.originalname.split('.').pop()


        cb(null, `${file.originalname.split('.')[0]}-${uniqueSuffix}.${fileExtension}`)

    },
})


const filter = (req, file, cb) => {
    //file.mimetype controlla il tipo MIME dichiarato dal client, che però può essere falsificato
    //se il mimetype è 'image/png', allora il client sta assumendo che l'immagine sia un formato png

    //tuttavia, per per rafforzare la validazione, controllo che png sia anche l'estensione
    if (file.mimetype === 'image/png' && file.originalname.endsWith('.png')) {
        //if (file.mimetype === 'image/png' ) {
        cb(null, true)
    } else {
        cb(new Error('Only .png files are allowed!'), false)
    }
}

module.exports = {
    cloudStorage,
    internalStorage,
    filter
}
