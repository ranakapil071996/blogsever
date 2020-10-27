const mongoose = require('mongoose');

const ItemDetailSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true},
    strikePrice: { type: Number}, 
    price: { type: Number, required: true}, 
    images: [String],
    isActive: { type: Boolean, default: true},
    sizes: [],
    inStock: { type: Boolean, default: true},
    description: String,
    quantityAvailable: Number,
    category: [String],
    itemType: [String],
    variant: [],
    itemCode: { type: String, trim: true, required: true},
    codAvailable: { type: Boolean, default: true}
},{
    timestamps: true
});

module.exports = mongoose.model('itemDetails', ItemDetailSchema)