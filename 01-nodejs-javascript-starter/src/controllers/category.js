const { createCategoryService, getCategoryService, updateCategoryService, deleteCategoryService } = require('../services/categoryService')

const createCategoryController = async (req, res) => {
    try {
        console.log("check req.body>>>", req.body);
        console.log("check req.file>>>", req.files[0]); // Dùng req.file vì category thường có 1 ảnh đại diện

        // Gọi service để tạo danh mục mới
        const newCategory = await createCategoryService(req.body, req.files[0]);

        return res.status(201).json({
            message: "Danh mục đã được tạo thành công!",
            category: newCategory,
        });
    } catch (error) {
        console.error("Lỗi khi tạo danh mục:", error);
        return res.status(400).json({ error: error.message });
    }
};
const updateCategoryController = async (req, res) => {
    try {
        const categoryId = req.params.id; // Assuming category ID is passed as a route parameter
        console.log("check categoryId>>>", categoryId);
        console.log("check req.body>>>", req.body);
        console.log("check req.file>>>", req.files ? req.files[0] : null);

        // Gọi service để cập nhật danh mục
        const updatedCategory = await updateCategoryService(
            categoryId,
            req.body,
            req.files && req.files.length > 0 ? req.files[0] : null
        );

        return res.status(200).json({
            message: "Danh mục đã được cập nhật thành công!",
            category: updatedCategory,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        return res.status(400).json({ error: error.message });
    }
};
const getCategorys = async (req, res) => {
    try {
        const categorys = await getCategoryService();
        res.status(200).json({ success: true, data: categorys });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    const result = await deleteCategoryService(id);
    console.log("check>>>id", result)
    if (result) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
}
module.exports = { createCategoryController, getCategorys, updateCategoryController, deleteCategory };
