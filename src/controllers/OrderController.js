class OrderController {
    static getOrders(req, res) {
        res.render('pages/order', { location: 'order' });
    }
}

module.exports = OrderController;
