class CategoryController {
    static getCategories(req, res) {
        res.render('pages/category', { location: 'category' });
    }
}

module.exports = CategoryController;
