const express = require('express');
const routerCreate = express.Router();
const { create,
    process,
    login,
    edit,
    editConfirm,
    deleteUser,
    database } = require('../controllers/usersController');

const multer = require('multer');
const path = require('path');

const { body } = require('express-validator');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/avatars'))
    },
    filename: (req, file, cb) => {
        const newFile = `avatar-${Date.now()}_img${path.extname(file.originalname)}`
        cb(null, newFile)
    }
});

const upload = multer({ storage });

const createValidations = [
    body('firstName').notEmpty().withMessage('Debes escribir un nombre'),
    body('lastName').notEmpty().withMessage('Debes escribir un apellido'),
    body('email')
        .notEmpty().withMessage('Debes escribir un email').bail()
        .isEmail().withMessage('Debes escribir un formato decorreo válido'),
    body('password')
        .notEmpty().withMessage('Debes escribir una contraseña').bail()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener 8 caracteres mínimo'),
    body('img').custom((value, { req }) => {
        let file = req.file;

        let validExtensions = ['.jpg', '.png', '.jpeg', '.webp'];
       
        if (!file) {
            throw new Error('Debes cargar una imagen');
        } else {
            let fileExtension = path.extname(file.originalname);
            if (!validExtensions.includes(fileExtension)) {
                throw new Error(`Las extensiones permitids son ${validExtensions.join(', ')}`);
            }
        }

        return true;
    })
]

/* const editValidations = [
    body('firstName').notEmpty().withMessage('Debes escribir un nombre'),
    body('lastName').notEmpty().withMessage('Debes escribir un apellido'),
    body('email')
        .notEmpty().withMessage('Debes escribir un email').bail()
        .isEmail().withMessage('Debes escribir un formato decorreo válido'),
    body('password')
        .notEmpty().withMessage('Debes escribir una contraseña').bail()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener 8 caracteres mínimo'),
] */

routerCreate.get('/users/create', create);
routerCreate.post('/users/create', upload.single('img'), createValidations, process);

routerCreate.get('/users/login', login);

routerCreate.get('/users/database', database);

routerCreate.get('/users/edit/:id', edit)
routerCreate.put('/users/edit/:id', upload.single('img'), /* editValidations, */ editConfirm)
routerCreate.delete('/users/edit/delete/:id', deleteUser)


module.exports = routerCreate;