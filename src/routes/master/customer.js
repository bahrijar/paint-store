const { CustomerController } = require('../../controllers');

const route = require('express').Router();

route.get('/', CustomerController.findAll);

route.get('/create', CustomerController.createView);
route.post('/create', CustomerController.create);

route.get('/edit/:id', CustomerController.updateView);
route.post('/edit/:id', CustomerController.update);

route.post('/delete/:id', CustomerController.delete);

module.exports = route;
