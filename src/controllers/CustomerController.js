class CustomerController {
    static getCustomers(req, res) {
        res.render('pages/customer', { location: 'customer' });
    }
}

module.exports = CustomerController;
