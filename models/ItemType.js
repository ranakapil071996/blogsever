const mongoose = require('mongoose');

const ItemTypeSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true, unique: true},
    value: { type: String, trim: true, required: true, unique: true},
    isActive: { type: Boolean, required: true, default: true}
},{
    timestamps: true
});

module.exports = mongoose.model('itemType', ItemTypeSchema)