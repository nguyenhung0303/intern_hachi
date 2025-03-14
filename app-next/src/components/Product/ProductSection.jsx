// ProductSection.js
import Image from "next/image";
import Link from "next/link";
import ProductSwiper from "@/components/Product/ProductSwiper"; // Client component riêng cho Swiper
import { cache } from "react";

// Sử dụng async để tạo component SSR
async function ProductSection() {
    // Truy cập API trực tiếp từ server
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/Product`, {
                cache: "no-store",
                next: { revalidate: 0 }, // Luôn lấy dữ liệu mới
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            console.log("check>>>respro", response)
            if (!response.ok) {
                throw new Error("Lỗi khi tải dữ liệu");
            }
            return response.json();
        } catch (error) {
            console.error("Lỗi fetch:", error);
            return { data: [] };
        }
    };

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
            <div className="product-box">
                <h2 className="product-title">NEW ARRIVALS</h2>
                {/* Sử dụng client component riêng cho Swiper */}
                <ProductSwiper products={products} />
            </div>
            <Link href="/products" className="product-button banner-button">
                View All
            </Link>
        </div>
    );
}

export default ProductSection;