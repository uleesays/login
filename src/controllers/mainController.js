const path = require('path')
let fs = require('fs');

const main = (req, res) => {
    
    res.render(path.join(__dirname,'../views/main.ejs'));
}


module.exports = {main};

    