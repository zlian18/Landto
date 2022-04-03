const catchAsync = require('../utils/catchAsync');
const { isLoggedin, validateLandscape } = require('../middleware');
const express = require('express');
// Use of Controller to store operations to landscapes
const landscape = require('../controllers/landscape');
const router = express.Router();

const { upload } = require('../aws/s3');

// Use the express.Router class to create modular, mountable route handlers. 
router.route('/')
    .get(landscape.renderIndex)
    .post(isLoggedin, upload.array('images', 5), validateLandscape, catchAsync(landscape.createLandscape));

router.get('/new', isLoggedin, landscape.renderNewForm);

router.route('/:id')
    .get(catchAsync(landscape.renderLandscapeDetail))
    .put(isLoggedin, upload.array('images', 5), validateLandscape, catchAsync(landscape.updateLandscape))
    .delete(catchAsync(landscape.deleteLandscape));

router.get('/:id/edit', isLoggedin, catchAsync(landscape.renderEditForm));

module.exports = router;