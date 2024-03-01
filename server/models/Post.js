const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    information: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    images: [{
        data: Buffer, // Assuming you're storing images as buffers
        contentType: String,
      }],
});

module.exports = mongoose.model('Post', PostSchema);