if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
const ExpressError = require('../utils/ExpressError');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
  region
})
// TODO: Filter image size and total number image for each landscape
const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
    return cb(new ExpressError('Incorrect image format', 404), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  }),
  fileFilter
})
exports.upload = upload
exports.s3 = s3
