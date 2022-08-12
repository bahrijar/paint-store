const moment = require('moment');
const { Op } = require('sequelize');
const { Order, Customer, Paint, sequelize } = require('../models');
class OrderController {
    static async findAll(req, res) {
        try {
            const { search } = req.query;
            let where = {};

            if (search) {
                where = {
                    ...where,
                    [Op.or]: {
                        '$Customer.name$': { [Op.iLike]: `%${search}%` },
                        '$Paint.name$': { [Op.iLike]: `%${search}%` }
                    }
                };
            }

            const result = await Order.findAll({
                where,
                include: [Customer, Paint],
                attributes: ['id', 'quantity', 'totalPrice', 'CustomerId', 'PaintId', 'createdAt']
            });

            const newResult = result.map((item) => {
                return {
                    ...item,
                    id: item.id,
                    totalPrice: item.totalPrice,
                    quantity: item.quantity,
                    createdAt: moment(item.createdAt).format('DD MMM YYYY HH:mm:ss')
                };
            });

            // console.log(newResult);

            // res.json(result);
            res.render('pages/order', {
                location: 'order',
                result: newResult,
                search: search || null
            });
        } catch (error) {
            // res.json(error);
            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/order', {
                location: 'order',
                result: [],
                search: null
            });
        }
    }

    static async findOne(req, res) {
        try {
            const { id } = req.params;
            const result = await Order.findOne({ where: { id }, include: [Customer, Paint] });

            if (result !== null) {
                res.render('pages/order/detail.ejs', {
                    location: 'order',
                    result
                });
            } else {
                res.render('pages/notfound.ejs', { location: null });
            }
        } catch (error) {
            res.json(error);
        }
    }

    static async createView(req, res) {
        try {
            const customers = await Customer.findAll();
            const paints = await Paint.findAll();

            res.render('pages/order/addEdit.ejs', {
                location: 'order',
                isCreateMode: true,
                result: null,
                customers,
                paints
            });
        } catch (error) {
            res.json(error);
        }
    }

    static async create(req, res) {
        const { CustomerId, PaintId, quantity } = req.body;
        // Begin transaction
        const t = await sequelize.transaction();

        try {
            // ====== Init new order object =====
            const newOrder = {
                quantity,
                CustomerId,
                PaintId,
                totalPrice: 0
            };
            // ====== Check Stock First =====
            const paint = await Paint.findOne({
                where: { id: PaintId },
                transaction: t
            });

            if (paint) {
                if (quantity > paint.stock) {
                    throw new Error('Not enough stock, need restock paint!');
                } else {
                    newOrder.totalPrice = paint.price * quantity;
                }
            }

            // ====== Create Order =====

            await Order.create(newOrder, { transaction: t });

            // ====== Update stock =====

            const updateObjPaint = {
                ...paint,
                stock: paint.stock - quantity
            };

            await Paint.update(updateObjPaint, {
                where: { id: PaintId },
                transaction: t
            });

            // commit transaction

            await t.commit();

            req.flash('success', 'Paint updated successfully');
            res.redirect('/orders');
        } catch (error) {
            // res.json(error);
            await t.rollback();
            const customers = await Customer.findAll();
            const paints = await Paint.findAll();

            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/order/addEdit.ejs', {
                location: 'order',
                isCreateMode: true,
                result: null,
                customers,
                paints
            });
        }
    }

    static async updateView(req, res) {
        try {
            const { id } = req.params;
            const customers = await Customer.findAll();
            const paints = await Paint.findAll();

            const result = await Order.findOne({
                where: { id },
                attributes: ['id', 'quantity', 'totalPrice', 'CustomerId', 'PaintId', 'createdAt'],
                include: [Customer, Paint]
            });

            res.render('pages/order/addEdit.ejs', {
                location: 'order',
                isCreateMode: false,
                result,
                customers,
                paints
            });
        } catch (error) {
            res.json(error);
        }
    }
    static async update(req, res) {
        const { CustomerId, PaintId, quantity } = req.body;
        const { id } = req.params;
        // Begin transaction
        const t = await sequelize.transaction();

        try {
            // ====== Init new order object =====
            const updateOrder = {
                quantity,
                CustomerId,
                PaintId,
                totalPrice: 0
            };

            // ====== Get old order data ====
            const oldOrder = await Order.findOne({
                where: { id },
                attributes: ['id', 'quantity', 'totalPrice', 'CustomerId', 'PaintId', 'createdAt'],
                transaction: t
            });

            if (oldOrder.PaintId === +PaintId) {
                // ====== Update stock to previous to prevent lossing stock ====
                // find paint
                const currPaint = await Paint.findOne({
                    where: { id: PaintId },
                    transaction: t
                });

                await Paint.update(
                    {
                        ...currPaint,
                        stock: currPaint.stock + oldOrder.quantity
                    },
                    { where: { id: oldOrder.PaintId }, transaction: t }
                );

                // ====== find new updated stock paint
                const paint = await Paint.findOne({
                    where: { id: PaintId },
                    transaction: t
                });

                // ====== Check Stock First =====
                if (paint) {
                    if (quantity > paint.stock) {
                        // if stock not enough then throw an error
                        throw new Error('Not enough stock, need restock paint!');
                    } else {
                        // if stock available then update totalPrice key
                        updateOrder.totalPrice = paint.price * quantity;
                    }
                }

                // ===== Update Order =====
                await Order.update(updateOrder, {
                    where: { id },
                    transaction: t
                });

                // ====== Update stock =====
                const updateObjPaint = {
                    ...paint,
                    stock: paint.stock - quantity
                };

                await Paint.update(updateObjPaint, {
                    where: { id: PaintId },
                    transaction: t
                });

                // commit transaction
                await t.commit();
                req.flash('success', 'Order updated successfully');
                res.redirect('/orders');
            } else {
                // ====== Update stock to previous to prevent lossing stock ====
                // find paint with id from old order
                const currPaint = await Paint.findOne({
                    where: { id: oldOrder.PaintId },
                    transaction: t
                });

                await Paint.update(
                    {
                        ...currPaint,
                        stock: currPaint.stock + oldOrder.quantity
                    },
                    { where: { id: currPaint.id }, transaction: t }
                );

                // ====== find new paint =====
                const paint = await Paint.findOne({
                    where: { id: PaintId },
                    transaction: t
                });

                // ====== Check Stock First =====
                if (paint) {
                    if (quantity > paint.stock) {
                        // if stock not enough then throw an error
                        throw new Error('Not enough stock, need restock paint!');
                    } else {
                        // if stock available then update totalPrice key
                        updateOrder.totalPrice = paint.price * quantity;
                    }
                }

                // ===== Update Order =====
                await Order.update(updateOrder, {
                    where: { id },
                    transaction: t
                });

                // ====== Update stock =====
                const updateObjPaint = {
                    ...paint,
                    stock: paint.stock - quantity
                };

                await Paint.update(updateObjPaint, {
                    where: { id: PaintId },
                    transaction: t
                });

                // commit transaction
                await t.commit();
                req.flash('success', 'Order updated successfully');
                res.redirect('/orders');
            }
        } catch (error) {
            // res.json(error);
            await t.rollback();
            const customers = await Customer.findAll();
            const paints = await Paint.findAll();

            const result = await Order.findOne({
                where: { id },
                attributes: ['id', 'quantity', 'totalPrice', 'CustomerId', 'PaintId', 'createdAt'],
                include: [Customer, Paint]
            });

            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.render('pages/order/addEdit.ejs', {
                location: 'order',
                isCreateMode: false,
                result,
                customers,
                paints
            });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        // Begin transaction
        const t = await sequelize.transaction();

        try {
            // ====== Get old order data ====
            const oldOrder = await Order.findOne({
                where: { id },
                transaction: t
            });

            // i assume if user delete order, the stock will update back to paint
            const currPaint = await Paint.findOne({
                where: { id: oldOrder.PaintId },
                transaction: t
            });

            await Paint.update(
                { ...currPaint, stock: oldOrder.quantity + currPaint.stock },
                {
                    where: { id: currPaint.id },
                    transaction: t
                }
            );

            // Delete order
            await Order.destroy({
                where: { id },
                transaction: t
            });

            // res.json({ message: `Customer has been deleted`, result });
            t.commit();

            req.flash('success', 'Order deleted successfully');
            res.redirect('/orders');
        } catch (error) {
            t.rollback();

            req.flash('error', error.message);
            res.locals.errorMessage = req.flash('error');
            res.redirect('/orders');
        }
    }
}

module.exports = OrderController;
