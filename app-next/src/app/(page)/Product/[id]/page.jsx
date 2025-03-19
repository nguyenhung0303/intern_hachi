// page.js trong thư mục /app/product/[id]/
import { fetchProductsById } from "@/util/api";
import ProductDetailUI from "./ProductDetailUI";

export default async function ProductDetailPage({ params }) {
    const { id } = await params;
    console.log("check id pro >>>", id)

    try {
        // Fetch product data
        const product = await fetchProductsById(id);
        console.log("check product>>>>", product)

        if (!product) {
            return <div className="container">Không tìm thấy sản phẩm</div>;
        }

        return <ProductDetailUI product={product} />;
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        return <div className="container">Lỗi: Không thể lấy thông tin sản phẩm</div>;
    }
}