const { PaintController } = require('../../controllers');

const route = require('express').Router();

route.get('/', PaintController.findAll);

route.get('/create', PaintController.createView);
route.post('/create', PaintController.create);

route.get('/edit/:id', PaintController.updateView);
route.post('/edit/:id', PaintController.update);

route.post('/delete/:id', PaintController.delete);

module.exports = route;
