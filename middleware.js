const { landscapeSchema, commentSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Comment = require('./models/comment');

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.previousUrl = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateLandscape = (req, res, next) => {
    // console.log(req.body.landscape)
    const { error } = landscapeSchema.validate(req.body);
    if (error) {
        var msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        var msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isCommentAuth = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.user.equals(req.user._id)) {
        req.flash("error", "No Permission");
        return res.redirect(`/landscapes/${id}`);
    }
    next();
}