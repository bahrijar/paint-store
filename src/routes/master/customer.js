const { CustomerController } = require('../../controllers');

const route = require('express').Router();

route.get('/', CustomerController.getCustomers);

module.exports = route;
