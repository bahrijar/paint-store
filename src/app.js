require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
var session = require('express-session');
const flashMessageMiddleware = require('./middlewares/flashMessage');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const port = process.env.PORT || 3001;

const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: false, secret: 'keyboard cat' }));
app.use(flash());

app.use(flashMessageMiddleware.flashMessage);

app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static(path.join(__dirname, '../public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Your server listening on port ${port}`);
});
