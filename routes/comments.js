const catchAsync = require('../utils/catchAsync');
const Landscape = require('../models/landscape');
const Comment = require('../models/comment');
const {isLoggedin, validateComment, isCommentAuth} = require('../middleware');
const express = require('express');
// Allow access of params from parent router
const router = express.Router({ mergeParams: true });
const comment = require('../controllers/comment');

router.post('/', isLoggedin, validateComment, catchAsync(comment.createComment));

router.delete('/:commentId', isLoggedin, isCommentAuth, catchAsync(comment.deleteComment));

module.exports = router;