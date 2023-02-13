const express = require('express');
const app = express();
const methodOverride = require('method-override');
const morgan = require("morgan");
const path = require('path');
const publicPath = path.resolve(__dirname, './public');
const routerMain = require('./src/routes/main');
const routerCreate = require('./src/routes/users')
const session = require('express-session');
const port = process.env.PORT || 3011;

app.listen(port, () => console.log(`Server running in port ${port}...`));

app.set('view engine', 'ejs');

app.use(session ( {secret: "In the words of Eddie Vedder: This is not for you."}))
app.use(methodOverride('_method'));
app.use(morgan("dev"));
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());
app.use(routerMain);
app.use(routerCreate);

