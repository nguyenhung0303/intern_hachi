// ProductSection.js
import Link from "next/link";
import ProductSection from "./ProductSection";
import { fetchProducts, fetchCategorys } from "@/util/api";
import ProductPageUI from "./ProductPageUi"
// Sử dụng async để tạo component SSR
async function ProductPage() {
    // Lấy dữ liệu sản phẩm
    const productData = await fetchProducts();
    const products = productData.data || [];

    // Kiểm tra lỗi và trạng thái dữ liệu
    if (products.length === 0) {
        return <p>Không tìm thấy sản phẩm.</p>;
    }

    // Lấy dữ liệu danh mục
    const categoryData = await fetchCategorys();
    const categories = categoryData.data || [];

    // Kiểm tra lỗi và trạng thái dữ liệu
    if (categories.length === 0) {
        return <p>Không tìm thấy danh mục.</p>;
    }

    return <ProductPageUI products={products} categories={categories} />;
}

export default ProductPage;