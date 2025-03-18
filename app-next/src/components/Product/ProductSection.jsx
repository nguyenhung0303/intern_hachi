// ProductSection.js
import Image from "next/image";
import Link from "next/link";
import ProductSwiper from "@/components/Product/ProductSwiper"; // Client component riêng cho Swiper
import { cache } from "react";
import { fetchProducts } from "@/util/api";

// Sử dụng async để tạo component SSR
async function ProductSection() {
    // Truy cập API trực tiếp từ server


    // Lấy dữ liệu sản phẩm
    const productData = await fetchProducts();
    const products = productData.data || [];
    console.log("check>>>respro2", products)

    // Kiểm tra lỗi và trạng thái dữ liệu
    if (products.length === 0) {
        return <p>Không tìm thấy sản phẩm.</p>;
    }

    return (
        <div className="container">
            <div className="product-box-ok product-box">
                <h2 className="product-title">NEW ARRIVALS</h2>
                {/* Sử dụng client component riêng cho Swiper */}
                <ProductSwiper products={products} />
            </div>
            <Link href="/ProductP" className="product-button banner-button">
                View All
            </Link>
        </div>
    );
}

export default ProductSection;