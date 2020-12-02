const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true},
    content: { type: String, trim: true, required: true}, 
    isActive: { type: Boolean, default: false},
    category: [String],
    keywords: [String],
    description: { type: String, required: true, trim: true},
    popularity: { type: Number, default: 0},
    slug: { type: String, required: true, unique: true},
    thumbnails: [{url: {type: String}, caption: { type: String}, type: { type: String, default: "IMAGE"}}],
    author: {
        userId: String,
        name: { type: String, required: true, trim: true },
        profilePic: {type: String, trim: true}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('blogs', blogSchema)