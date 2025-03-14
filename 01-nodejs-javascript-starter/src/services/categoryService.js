const Category = require('../models/category');
const Product = require('../models/product');

const createCategoryService = async (data, imageFile) => {
    try {
        const imageUrl = imageFile ? `/Upload/${imageFile.filename}` : "";

        const category = new Category({
            name: data.name,
            description: data.description || "",
            image: imageUrl,
        });

        console.log("check>>>>category new", category);

        const savedCategory = await category.save();
        return savedCategory;
    } catch (error) {
        throw new Error(`Lỗi khi tạo danh mục: ${error.message}`);
    }
};
const updateCategoryService = async (categoryId, data, imageFile) => {
    try {
        const updateData = {
            name: data.name,
            description: data.description || ""
        };
        if (imageFile) {
            updateData.image = `/Upload/${imageFile.filename}`;
        }

        console.log("check>>>>category update", updateData);
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true }
        );

        if (!updatedCategory) {
            throw new Error('Không tìm thấy danh mục');
        }

        return updatedCategory;
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật danh mục: ${error.message}`);
    }
};
const getCategoryService = async () => {
    try {
        console.log("check pro>>>", Category)
        const category = await Category.find();
        return category;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
    }
};
const deleteCategoryService = async (id) => {
    try {
        if (!id) {
            throw new Error("ID danh mục không hợp lệ");
        }

        const category = await Category.findById(id);
        if (!category) {
            throw new Error(`Không tìm thấy danh mục với ID: ${id}`);
        }

        // Xóa ID của danh mục khỏi tất cả các sản phẩm liên quan
        await Product.updateMany(
            { categoryIds: id },
            { $pull: { categoryIds: id } }
        );

        // Xóa danh mục
        const result = await Category.findByIdAndDelete(id);

        return {
            success: true,
            message: "Danh mục đã được xóa và đã xóa khỏi tất cả sản phẩm liên quan",
            data: result
        };
    } catch (error) {
        throw new Error(`Lỗi khi xóa danh mục: ${error.message}`);
    }
};



module.exports = { createCategoryService, getCategoryService, updateCategoryService, deleteCategoryService };
