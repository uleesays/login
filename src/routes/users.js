const express = require('express');
const routerCreate = express.Router();
const { create,
    processCreate,
    login,
    processLogin,
    edit,
    editConfirm,
    deleteUser,
    userProfile,
    userLogout,
    database } = require('../controllers/usersController');

const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

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

const loginValidations = [
   body('email')
        .notEmpty().withMessage('Debes escribir un email').bail()
        .isEmail().withMessage('Debes escribir un formato decorreo válido'),
    body('password')
        .notEmpty().withMessage('Debes escribir una contraseña').bail()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener 8 caracteres mínimo'),
]

// Vista crear usuario
routerCreate.get('/users/create', guestMiddleware, create);

// Procesar crear usuario
routerCreate.post('/users/create', upload.single('img'), createValidations, processCreate);

// Vista login
routerCreate.get('/users/login', guestMiddleware ,login);

// Procesar el login
routerCreate.post('/users/login', loginValidations, processLogin);

// Vista todos los usuarios
routerCreate.get('/users/database', authMiddleware ,database);

// Vista del usuario logueado
routerCreate.get('/users/profile', authMiddleware ,userProfile);

// Vista editar usuario
routerCreate.get('/users/edit/:id', edit)

// Procesar el edit
routerCreate.put('/users/edit/:id', upload.single('img'), editConfirm)

// Borrar el usuario
routerCreate.delete('/users/edit/delete/:id', deleteUser)

// Logout
routerCreate.get('/users/logout', userLogout)


module.exports = routerCreate;