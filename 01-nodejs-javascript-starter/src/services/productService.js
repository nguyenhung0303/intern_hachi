const Product = require('../models/product');


const createProductService = async (data, imageFiles) => {
    try {
        // Validate tên sản phẩm (5-30 ký tự)
        if (!data.name || data.name.length < 5 || data.name.length > 30) {
            throw new Error('Tên sản phẩm phải từ 5 đến 30 ký tự.');
        }

        // Validate giá mới - không được chứa chữ cái
        if (data.newPrice) {
            const newPriceValue = data.newPrice.toString();
            if (!/^\d+(\.\d+)?$/.test(newPriceValue)) {
                throw new Error('Giá sản phẩm chỉ được chứa số, không được chứa chữ.');
            }

            // Kiểm tra tối đa 9 chữ số
            if (newPriceValue.replace(/\D/g, '').length > 9) {
                throw new Error('Giá sản phẩm không được vượt quá 9 chữ số.');
            }
        }

        // Validate giá cũ (nếu có) - không được chứa chữ cái
        if (data.oldPrice) {
            const oldPriceValue = data.oldPrice.toString();
            if (!/^\d+(\.\d+)?$/.test(oldPriceValue)) {
                throw new Error('Giá cũ sản phẩm chỉ được chứa số, không được chứa chữ.');
            }

            // Kiểm tra tối đa 9 chữ số
            if (oldPriceValue.replace(/\D/g, '').length > 9) {
                throw new Error('Giá cũ sản phẩm không được vượt quá 9 chữ số.');
            }
        }


        // Chuyển đổi danh sách ảnh thành đường dẫn lưu trữ
        const imageUrls = imageFiles.map((file) => `/Upload/${file.filename}`);

        // Xử lý mảng màu sắc và kích thước (tách từ chuỗi nếu có)
        const colors = Array.isArray(data.colors)
            ? data.colors
            : data.colors?.split(",").map(c => c.trim()) || [];

        const sizes = Array.isArray(data.sizes)
            ? data.sizes
            : data.sizes?.split(",").map(s => s.trim()) || [];

        // Xử lý categoryIds - chuyển thành mảng ObjectId
        const categoryIds = Array.isArray(data.categoryIds)
            ? data.categoryIds
            : data.categoryIds?.split(",").map(id => id.trim()) || [];

        const oldPrice = data.oldPrice ? parseFloat(data.oldPrice) : 0;

        // Tạo sản phẩm mới
        const product = new Product({
            name: data.name,
            oldPrice,
            newPrice: parseFloat(data.newPrice),
            description: data.description || "",
            colors,
            sizes,
            images: imageUrls,
            categoryIds,
        });

        console.log("check>>>>product new", product);

        // Lưu vào database
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw new Error(`Lỗi khi tạo sản phẩm: ${error.message}`);
    }
};
const getProductService = async () => {
    try {
        console.log("check pro>>>", Product)
        const products = await Product.find(); // Lấy tất cả sản phẩm
        return products;
    } catch (error) {
        throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
    }
};
const updateProductService = async (productId, data, imageFiles = []) => {
    try {
        // Tìm sản phẩm cần cập nhật
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Không tìm thấy sản phẩm');
        }

        // Xử lý hình ảnh
        let updatedImages = [...product.images];
        if (imageFiles && imageFiles.length > 0) {
            const newImageUrls = imageFiles.map((file) => `/Upload/${file.filename}`);
            updatedImages = newImageUrls;
        }

        // Xử lý màu sắc
        const colors = Array.isArray(data.colors)
            ? data.colors
            : data.colors?.split(",").map(c => c.trim()) || product.colors;

        // Xử lý kích thước
        const sizes = Array.isArray(data.sizes)
            ? data.sizes
            : data.sizes?.split(",").map(s => s.trim()) || product.sizes;

        // Xử lý danh mục - thêm xử lý categoryIds
        const categoryIds = Array.isArray(data.categoryIds)
            ? data.categoryIds
            : data.categoryIds?.split(",").map(id => id.trim()) || product.categoryIds;

        // Xử lý giá cũ
        const oldPrice = data.oldPrice ? parseFloat(data.oldPrice) : product.oldPrice;

        // Cập nhật sản phẩm
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name: data.name || product.name,
                oldPrice,
                newPrice: data.newPrice ? parseFloat(data.newPrice) : product.newPrice,
                description: data.description || product.description,
                colors,
                sizes,
                images: updatedImages,
                categoryIds, // Thêm trường categoryIds vào cập nhật
            },
            { new: true }
        );

        console.log("check>>>>product updated", updatedProduct);

        return updatedProduct;
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
    }
};
const getProductByIdService = async (productId) => {
    try {
        console.log("check product ID >>>", productId);
        const product = await Product.findById(productId); // Tìm sản phẩm theo ID

        if (!product) {
            throw new Error("Không tìm thấy sản phẩm.");
        }

        return product;
    } catch (error) {
        throw new Error(`Lỗi khi lấy sản phẩm: ${error.message}`);
    }
};
const deleteProductService = async (id) => {
    try {

        if (!id) {
            throw new Error("ID sản phẩm không hợp lệ");
        }


        const product = await Product.findById(id);
        if (!product) {
            throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
        }

        const result = await Product.findByIdAndDelete(id);

        return { success: true, message: "Sản phẩm đã bị xóa", data: result };
    } catch (error) {
        throw new Error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
};

module.exports = {
    createProductService, getProductService, getProductByIdService, updateProductService, deleteProductService
}