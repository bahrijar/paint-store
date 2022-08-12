const { OrderController } = require('../../controllers');

const route = require('express').Router();

route.get('/', OrderController.findAll);

route.get('/detail/:id', OrderController.findOne);

route.get('/create', OrderController.createView);
route.post('/create', OrderController.create);

route.get('/edit/:id', OrderController.updateView);
route.post('/edit/:id', OrderController.update);

route.post('/delete/:id', OrderController.delete);

module.exports = route;
