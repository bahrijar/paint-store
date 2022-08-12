exports.flashMessage = function (req, res, next) {
    const successMessageArr = req.flash('success');
    const errorMessageArr = req.flash('error');
    res.locals.successMessage = successMessageArr[0];
    res.locals.errorMessage = errorMessageArr[0];
    next();
};
