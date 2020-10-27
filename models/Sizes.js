const mongoose = require('mongoose');

const sizesSchema = new mongoose.Schema({
    name: { type: String, trim: true},
    type: { type: String, trim: true},
    value: { type: String, trim: true, unique: true}
}, {
    timestamps: true
});

module.exports = mongoose.model('sizes', sizesSchema)