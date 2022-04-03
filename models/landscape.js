const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const landscapeSchema = new Schema({
    title: String,
    location: String,
    images: [
        {
            url: String,
            key: String
        }
    ],
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

landscapeSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Landscape', landscapeSchema);