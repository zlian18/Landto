const User = require('../models/user');

module.exports.renderRegisterPage = (req, res) => {
    res.render('user/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function (err) {
            if (err) return next(err);
            req.flash('success', 'Register Success');
            res.redirect('/landscapes');
        });
    } catch {
        req.flash('error', 'Username or Email Already Registered');
        res.redirect('/register');
    }
}

module.exports.renderLoginPage = (req, res) => {
    res.render('user/login');
}

module.exports.renderPreviousPage = (req, res) => {
    const redirectUrl = req.session.previousUrl || '/landscapes';
    delete req.session.previousUrl;
    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res) => {
    req.logOut();
    req.flash('success', 'Logged Out!');
    res.redirect('/landscapes');
}