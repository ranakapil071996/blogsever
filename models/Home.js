const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true},
    description: { type: String, required: true, trim: true},
    isActive: { type: Boolean, default: false},
    popularity: { type: Number, default: 0},
    thumbnails: [{url: {type: String}, caption: { type: String}, type: { type: String, default: "IMAGE"}}],
    type: { type: [String], required: true},
    slug: { type: String, required: true, unique: true},
    author: {
        userId: String,
        name: { type: String, required: true, trim: true },
        profilePic: {type: String, trim: true}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('homepage', homeSchema)