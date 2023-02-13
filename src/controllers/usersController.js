const path = require('path')
let fs = require('fs');

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

const process = (req, res) => {

    const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
        return res.render(path.join(__dirname, '../views/createUser.ejs'),{
            errors: resultValidation.mapped(),
            oldData: req.body
            });
    }

   
        
       
   let usersJSON = fs.readFileSync(path.join(__dirname, '../data/users.json'));
    let users = JSON.parse(usersJSON);

    const {
        firstName,
        lastName,
        email,
        password,
        img
    } = req.body;

    const image = req.file ? req.file.filename : '';
    let newImage;

    if (image.length > 0) {
        newImage = `/images/avatars/${image}`;
    }

    const newId = users[users.length - 1].id + 1;

    const obj = {
        id: newId,
        firstName,
        lastName,
        email,
        password,
        img: newImage
    }

    users.push(obj);

    usersJSON = JSON.stringify(users);

    fs.writeFileSync(path.join(__dirname, '../data/users.json'), usersJSON) 

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

   /*  const resultValidation = validationResult(req);

    if (resultValidation.errors.length > 0) {
        return res.render(path.join(__dirname, '../views/edit.ejs'),{
            errors: resultValidation.mapped(),
            oldData: req.body
            });
    } */

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

module.exports = {
    create,
    process,
    login,
    database,
    edit,
    editConfirm,
    deleteUser
};

