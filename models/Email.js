const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true},
    email: { type: String, trim: true, required: true}, 
    phone: { type: String, trim: true}, 
    message: { type: String, trim: true}, 
}, {
    timestamps: true
});

module.exports = mongoose.model('query', emailSchema)