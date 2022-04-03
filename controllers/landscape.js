const Landscape = require('../models/landscape');
const { s3 } = require('../aws/s3');

module.exports.renderIndex = async (req, res) => {
    const landscapes = await Landscape.find({});
    res.render('landscapes/index', { landscapes, title: "Landscape Photos" });
}

module.exports.renderNewForm = async (req, res) => {
    res.render('landscapes/new', { title: "New Landscape Photo" });
}

module.exports.createLandscape = async (req, res, next) => {
    const landscape = new Landscape(req.body.landscape);
    landscape.images = req.files.map(f => ({ url: f.location, key: f.key }));
    landscape.user = req.user._id;
    await landscape.save();
    req.flash('success', 'Landscape Created!');
    res.redirect(`/landscapes/${landscape._id}`)
}

module.exports.renderLandscapeDetail = async (req, res) => {
    const landscape = await Landscape.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).populate('user');
    if (!landscape) {
        req.flash('error', 'Landscape does not exist')
        res.redirect('/landscapes');
    }
    res.render('landscapes/details', { landscape, title: "Photo Details" });
}

module.exports.renderEditForm = async (req, res) => {
    const landscape = await Landscape.findById(req.params.id);
    if (!landscape) {
        req.flash('error', 'Landscape does not exist')
        res.redirect('/landscapes');
    }
    res.render('landscapes/edit', { landscape, title: "Edit Landscape Details" });
}

module.exports.updateLandscape = async (req, res) => {
    const { id } = req.params;
    const landscapeCur = await Landscape.findById(id);
    if (!landscapeCur.user.equals(req.user._id)) {
        req.flash("error", "No permission");
        res.redirect(`/landscapes/${landscapeCur._id}`);
    }
    const landscape = await Landscape.findByIdAndUpdate(id, { ...req.body.landscape });
    var imgs = req.files.map(f => ({ url: f.location, key: f.key }));
    landscape.images.push(...imgs);
    await landscape.save();
    if (req.body.deleteImages) {
        if (req.body.deleteImages.length < landscape.images.length) {
            await landscape.updateOne({ $pull: { images: { key: { $in: req.body.deleteImages } } } });
            for (let i = 0; i < req.body.deleteImages.length; i++) {
                s3.deleteObject({ Bucket: 'landto', Key: req.body.deleteImages[i] }, function (err, data) {
                    if (err) console.log(err, err.stack);
                });
            }
        } else {
            req.flash('error', 'Must have at least one image')
            res.redirect(`/landscapes/${landscape._id}/edit`);
        }
    }
    req.flash('success', 'Landscape Updated!');
    res.redirect(`/landscapes/${landscape._id}`);
}

module.exports.deleteLandscape = async (req, res) => {
    const { id } = req.params;
    const landscape = await Landscape.findById(id);
    // Delete corresponding images from s3
    for (let i = 0; i < landscape.images.length; i++) {
        s3.deleteObject({ Bucket: 'landto', Key: landscape.images[i].key }, function (err, data) {
            if (err) console.log(err, err.stack);
        });
    }
    await Landscape.findByIdAndDelete(id);
    req.flash('success', 'Landscape Deleted!');
    res.redirect('/landscapes');
}