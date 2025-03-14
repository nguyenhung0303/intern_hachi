const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    oldPrice: { type: Number, required: false },
    newPrice: { type: Number, required: true },
    description: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    images: [{ type: String, required: true }],
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;