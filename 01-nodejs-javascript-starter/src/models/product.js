const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true }, // Thêm slug
    rating: { type: Number, default: 0 },
    oldPrice: { type: Number, required: false },
    newPrice: { type: Number, required: true },
    description: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    images: [{ type: String, required: true }],
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

productSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;