const route = require('express').Router();
const { HomeController } = require('../controllers');
const routesMaster = require('./master');
const routesOrder = require('./order');

// Home
route.get('/', HomeController.homeView);

// Master data
route.use(routesMaster);
route.use('/orders', routesOrder);

module.exports = route;
