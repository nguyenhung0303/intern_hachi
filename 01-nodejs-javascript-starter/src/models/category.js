const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // Ảnh đại diện cho danh mục
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;