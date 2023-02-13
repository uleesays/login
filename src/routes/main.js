const express = require('express');
const routerMain = express.Router();
const {main} = require('../controllers/mainController');

routerMain.get('/', main );

module.exports = routerMain;