const { OrderController } = require('../../controllers');

const route = require('express').Router();

route.get('/', OrderController.getOrders);

module.exports = route;
