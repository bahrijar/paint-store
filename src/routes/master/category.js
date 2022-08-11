const { CategoryController } = require('../../controllers');

const route = require('express').Router();

route.get('/', CategoryController.getCategories);

module.exports = route;
