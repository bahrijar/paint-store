class HomeController {
    static homeView(req, res) {
        res.render('pages/home', { location: 'home' });
    }
}

module.exports = HomeController;
