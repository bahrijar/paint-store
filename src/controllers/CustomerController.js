const { Op } = require('sequelize');
const { Customer } = require('../models');

class CustomerController {
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

            const result = await Customer.findAll({ where });
            // res.json(result);
            res.render('pages/customer', {
                location: 'customer',
                result,
                search: search || null
            });
        } catch (error) {
            // res.json(error);
            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/customer', {
                location: 'customer',
                result: [],
                search: null
            });
        }
    }

    // static async findOne(req, res) {}

    static async createView(req, res) {
        res.render('pages/customer/addEdit.ejs', {
            location: 'customer',
            isCreateMode: true,
            result: null
        });
    }
    static async create(req, res) {
        try {
            const result = await Customer.create(req.body);

            if (result) {
                // res.json(result)
                req.flash('success', 'Customer created successfully');
                res.redirect('/customers');
            }
        } catch (error) {
            // res.json(error);
            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/customer/addEdit.ejs', {
                location: 'customer',
                isCreateMode: true,
                result: null
            });
        }
    }

    static async updateView(req, res) {
        try {
            const { id } = req.params;
            const result = await Customer.findOne({ where: { id } });

            if (result !== null) {
                res.render('pages/customer/addEdit.ejs', {
                    location: 'customer',
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
            const result = await Customer.update(req.body, { where: { id } });
            if (result[0] === 1) {
                req.flash('success', 'Customer updated successfully');
                res.redirect('/customers');
            } else {
                req.flash('error', 'Customer cannot be updated');
                res.redirect('/customers');
            }
        } catch (error) {
            res.json(error);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await Customer.destroy({ where: { id } });
            if (result !== 0) {
                // res.json({ message: `Customer has been deleted`, result });
                req.flash('success', 'Customer deleted successfully');
                res.redirect('/customers');
            } else {
                res.json({ message: `Customer not found or can't be deleted` });
            }
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = CustomerController;
