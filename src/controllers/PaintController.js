const { Op } = require('sequelize');
const { Paint, Category } = require('../models');
class PaintController {
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

            const result = await Paint.findAll({ where, include: [Category] });

            // res.json(result);
            res.render('pages/paint', {
                location: 'paint',
                result,
                search: search || null
            });
        } catch (error) {
            // res.json(error);
            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/paint', {
                location: 'paint',
                result: [],
                search: null
            });
        }
    }

    // static async findOne(req, res) {}

    static async createView(req, res) {
        const categories = await Category.findAll();
        res.render('pages/paint/addEdit.ejs', {
            location: 'paint',
            isCreateMode: true,
            result: null,
            categories
        });
    }
    static async create(req, res) {
        try {
            const result = await Paint.create(req.body);

            if (result) {
                // res.json(result)
                req.flash('success', 'Paint created successfully');
                res.redirect('/paints');
            }
        } catch (error) {
            // res.json(error);
            const categories = await Category.findAll();
            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/paint/addEdit.ejs', {
                location: 'paint',
                isCreateMode: true,
                result: null,
                categories
            });
        }
    }

    static async updateView(req, res) {
        try {
            const { id } = req.params;
            const result = await Paint.findOne({ where: { id } });
            const categories = await Category.findAll();
            if (result !== null) {
                res.render('pages/paint/addEdit.ejs', {
                    location: 'paint',
                    isCreateMode: false,
                    result,
                    categories
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
            const result = await Paint.update(req.body, { where: { id } });
            if (result[0] === 1) {
                req.flash('success', 'Paint updated successfully');
                res.redirect('/paints');
            } else {
                req.flash('error', 'Category cannot be updated');
                res.redirect('/paints');
            }
        } catch (error) {
            res.json(error);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await Paint.destroy({ where: { id } });
            if (result !== 0) {
                // res.json({ message: `Paint has been deleted`, result });
                req.flash('success', 'Paint deleted successfully');
                res.redirect('/paints');
            } else {
                res.json({ message: `Paint not found or can't be deleted` });
            }
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = PaintController;
