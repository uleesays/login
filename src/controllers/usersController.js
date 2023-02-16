const path = require('path')
let fs = require('fs');
const bcryptjs = require('bcryptjs');

const User = require('../models/User');

const { validationResult } = require('express-validator');

let usersJSON = fs.readFileSync(path.join(__dirname, '../data/users.json'));
let users = JSON.parse(usersJSON);

const create = (req, res) => {

    res.render(path.join(__dirname, '../views/createUser.ejs'));
}

const login = (req, res) => {

    res.render(path.join(__dirname, '../views/login.ejs'));
}

const processLogin = (req, res) => {

    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
        return res.render(path.join(__dirname, '../views/login.ejs'),{
            errors: resultValidation.mapped(),
            oldData: req.body
            });
    }

    let userToLogin = User.findByField('email', req.body.email);

    if(userToLogin) {
            let passwordOk = bcryptjs.compareSync(req.body.password, userToLogin.password)     
        if (passwordOk) {
            delete userToLogin.password;
            req.session.userLogged = userToLogin;


            //SE CREA LA COOKIE

             if(req.body.remember_user) {

                res.cookie('userEmail', req.body.email, { maxAge: (1000 *60) * 2,})
            }  

            res.redirect('/users/profile');
        }
        return res.render(path.join(__dirname, '../views/login.ejs'),{
            errors: {
                email: {
                    msg: 'Credenciales inválidas'
                }
            },           
            });
    }
 return res.render(path.join(__dirname, '../views/login.ejs'),{
        errors: {
            email: {
                msg: 'Usuario incorrecto'
            }
        },      
        });

};



const processCreate = (req, res) => {

    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
        return res.render(path.join(__dirname, '../views/createUser.ejs'),{
            errors: resultValidation.mapped(),
            oldData: req.body
            });
    }

    let userInDb = User.findByField('email', req.body.email);

    if (userInDb) {

        return res.render(path.join(__dirname, '../views/createUser.ejs'),{
            errors: {
                email: {
                    msg: 'Este email ya está registrado'
                }
            },
            oldData: req.body
            });
    }
        let userToCreate = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            img: '/images/avatars/' + req.file.filename
        }
   
      let userCreated = User.create(userToCreate);  
       
    res.redirect('/users/database') 
}

const database = (req, res) => {

    let usersJSON = fs.readFileSync(path.join(__dirname, '../data/users.json'));
    let users = JSON.parse(usersJSON);

    res.render(path.join(__dirname, '../views/database.ejs'), {users});
}

const edit = (req, res) => {

    const { id } = req.params;
    const user = users.find(e => e.id == id);
    res.render(path.join(__dirname, '../views/edit.ejs'), {user});

};

const editConfirm = (req, res) => {

    let usersJSON = fs.readFileSync(path.join(__dirname, '../data/users.json'));
    let users = JSON.parse(usersJSON);

    const image = req.file ? req.file.filename : '';
    let newImage;

    users.forEach(e => {
        if (e.id == req.params.id) {
            e.firstName = req.body.firstName;
            e.lastName = req.body.lastName;
            e.email = req.body.email;
            e.password = req.body.password;
            if (image.length > 0) {
                newImage = `/images/avatars/${image}`
                e.img = newImage
            }
        }
    })
    usersJSON = JSON.stringify(users);

    fs.writeFileSync(path.join(__dirname, '../data/users.json'), usersJSON)

    res.redirect('/users/database');
}

const deleteUser = (req, res) => {

    let usersJSON = fs.readFileSync(path.join(__dirname, '../data/users.json'));
    let users = JSON.parse(usersJSON);

    const idDelete = req.params.id;

    users = users.filter((user) => user.id !=idDelete)

    usersJSON = JSON.stringify(users);

    fs.writeFileSync(path.join(__dirname, '../data/users.json'), usersJSON)

    res.redirect('/users/database');

}

const userProfile = (req, res) => {

    console.log(req.cookies.userEmail); 
   
    res.render(path.join(__dirname, '../views/userProfile.ejs'), {
        user: req.session.userLogged
    });

}

const userLogout = (req, res) => {
    req.session.destroy();
    return res.redirect('/')
}

module.exports = {
    create,
    processCreate,
    login,
    database,
    edit,
    editConfirm,
    deleteUser,
    processLogin,
    userProfile,
    userLogout
};

