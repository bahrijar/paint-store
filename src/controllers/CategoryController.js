const { Op } = require('sequelize');
const { Category } = require('../models');
class CategoryController {
    static async findAll(req, res) {
        try {
            const { search } = req.query;
            let where = {};

            if (search) {
                where = {
                    ...where,
                    name: { [Op.iLike]: `%${search}%` }
                };
            }

            const result = await Category.findAll({ where });
            // res.json(result);
            res.render('pages/category', {
                location: 'category',
                result,
                search: search || null
            });
        } catch (error) {
            // res.json(error);
            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/category', {
                location: 'category',
                result: [],
                search: null
            });
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const result = await Category.findOne({ where: { id } });
            res.json(result);
        } catch (error) {
            res.json(error);
        }
    }

    static async createView(req, res) {
        res.render('pages/category/addEdit.ejs', {
            location: 'category',
            isCreateMode: true,
            result: null
        });
    }

    static async create(req, res) {
        try {
            const result = await Category.create(req.body);

            if (result) {
                // res.json(result)
                req.flash('success', 'Category created successfully');
                res.redirect('/categories');
            }
        } catch (error) {
            // res.json(error);
            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/category/addEdit.ejs', {
                location: 'category',
                isCreateMode: true,
                result: null
            });
        }
    }

    static async updateView(req, res) {
        try {
            const { id } = req.params;
            const result = await Category.findOne({ where: { id } });

            if (result !== null) {
                res.render('pages/category/addEdit.ejs', {
                    location: 'category',
                    isCreateMode: false,
                    result
                });
            } else {
                res.render('pages/notfound.ejs', { location: null });
            }
        } catch (error) {
            res.json(error);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const result = await Category.update(req.body, { where: { id } });
            if (result[0] === 1) {
                req.flash('success', 'Category updated successfully');
                res.redirect('/categories');
            } else {
                req.flash('error', 'Category cannot be updated');
                res.redirect('/categories');
            }
        } catch (error) {
            res.json(error);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await Category.destroy({ where: { id } });
            if (result !== 0) {
                // res.json({ message: `Category has been deleted`, result });
                req.flash('success', 'Category deleted successfully');
                res.redirect('/categories');
            } else {
                res.json({ message: `Category not found or can't be deleted` });
            }
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = CategoryController;
