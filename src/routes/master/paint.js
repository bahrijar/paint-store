const { PaintController } = require('../../controllers');

const route = require('express').Router();

route.get('/', PaintController.getPaints);

module.exports = route;
