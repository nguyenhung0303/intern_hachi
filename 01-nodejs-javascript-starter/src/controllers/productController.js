const { createProductService, getProductService, getProductByIdService, updateProductService, deleteProductService } = require('../services/productService')

const createProductController = async (req, res) => {
    try {
        console.log("check req.body>>>", req.body);
        console.log("check req.files>>>", req.files);


        const newProduct = await createProductService(req.body, req.files);

        return res.status(201).json({
            message: "Sản phẩm đã được tạo thành công!",
            product: newProduct,
        });
    } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);
        return res.status(400).json({ error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await getProductService();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getProductsById = async (req, res) => {
    const { id } = req.params;
    let result = await getProductByIdService(id);
    return res.status(200).json(result);
};
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    console.log("check data update>>", req.body)
    console.log("check req.files>>>", req.files);

    const result = await updateProductService(id, updateData, req.files);

    if (result) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
};
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const result = await deleteProductService(id);
    console.log("check>>>id", result)
    if (result) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }
}
module.exports = {
    createProductController, getProducts, getProductsById, updateProduct, deleteProduct
}