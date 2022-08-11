class PaintController {
    static getPaints(req, res) {
        res.render('pages/paint', { location: 'paint' });
    }
}

module.exports = PaintController;
