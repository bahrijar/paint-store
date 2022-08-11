const route = require('express').Router();

const routesPaint = require('./paint');
const routesCustomer = require('./customer');
const routesCategory = require('./category');

route.use('/paints', routesPaint);
route.use('/customers', routesCustomer);
route.use('/categories', routesCategory);

module.exports = route;
