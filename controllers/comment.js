const Landscape = require('../models/landscape');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res, next) => {
    const landscape = await Landscape.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.user = req.user._id;
    landscape.comments.push(comment);
    await comment.save();
    await landscape.save();
    req.flash('success', 'Comment Created!');
    res.redirect(`/landscapes/${landscape._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Landscape.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment Deleted!');
    res.redirect(`/landscapes/${id}`);
}