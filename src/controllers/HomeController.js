const { Order, Customer, Paint, Category, sequelize } = require('../models');
class HomeController {
    static async homeView(req, res) {
        try {
            const countOrder = await Order.count();
            const countCategory = await Category.count();
            const countCustomer = await Customer.count();
            const countPaint = await Paint.count();

            const order = await Order.findAll({
                attributes: [[sequelize.fn('SUM', sequelize.cast(sequelize.col('totalPrice'), 'integer')), 'totalIncome']]
            });

            res.render('pages/home', {
                location: 'home',
                result: {
                    countOrder,
                    countCategory,
                    countCustomer,
                    countPaint,
                    totalIncome: order[0].dataValues.totalIncome || 0
                }
            });
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = HomeController;
