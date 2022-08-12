const { CategoryController } = require('../../controllers');

const route = require('express').Router();

route.get('/', CategoryController.findAll);

route.get('/create', CategoryController.createView);
route.post('/create', CategoryController.create);

route.get('/edit/:id', CategoryController.updateView);
route.post('/edit/:id', CategoryController.update);

route.post('/delete/:id', CategoryController.delete);

module.exports = route;
