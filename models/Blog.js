const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true},
    content: { type: String, trim: true, required: true}, 
    isActive: { type: Boolean, default: true},
    category: [String],
    keywords: [String],
    description: { type: String, required: true, trim: true},
    popularity: { type: Number, default: 0}
}, {
    timestamps: true
});

module.exports = mongoose.model('blogs', blogSchema)