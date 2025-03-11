const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    oldPrice: { type: Number, required: 0 },
    newPrice: { type: Number, required: true },
    description: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    images: [{ type: String, required: true }],
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;

