require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3001;

const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app.use(express.static(path.join(__dirname, '../public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Your server listening on port ${port}`);
});
