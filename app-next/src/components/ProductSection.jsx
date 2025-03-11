"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductApi } from "@/util/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

const ProductSection = () => {
    const router = useRouter(); // Sử dụng useRouter để điều hướng
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductApi();
                if (response.data.length > 0) {
                    setProducts(response.data);
                } else {
                    setError("Không có sản phẩm nào.");
                }
            } catch (error) {
                setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Đang tải sản phẩm...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (products.length === 0) return <p>Không tìm thấy sản phẩm.</p>;

    return (
        <div className="container">
            <div className="product-box">
                <h2 className="product-title">NEW ARRIVALS</h2>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={10}
                    slidesPerView={4} // Hiển thị 4 sản phẩm
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    className="product-list"
                >
                    {products.map((product, index) => {
                        const firstImage = Array.isArray(product.images)
                            ? product.images[0]
                            : typeof product.images === "string"
                                ? product.images.split(",")[0]
                                : "";

                        return (
                            <SwiperSlide
                                key={index}
                                className="product-item"
                                onClick={() => router.push(`/Product/${product._id}`)} // Điều hướng khi click
                                style={{ cursor: "pointer" }}
                            >
                                {firstImage && (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${firstImage.replace(/^\/+/, '')}`}
                                        alt={product.name}
                                        width={295}
                                        height={298}
                                        style={{ objectFit: "cover" }}
                                    />
                                )}
                                <div className="product-name">{product.name}</div>
                                <div className="product-rate">
                                    <span className="rate-star">
                                        <Image src="/assets/img/start.svg" alt="Star" width={16} height={16} />
                                    </span>
                                    <span className="rate-number">1/5</span>
                                </div>
                                <div className="product-price">
                                    <span className="price-new-h ">{'$'}{product.newPrice}</span>
                                    <span className="price-old-h  ">{'$'}{product.oldPrice}</span>
                                    <span className="sale">20%</span>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
            <div className="product-button banner-button">View All</div>
        </div>
    );
};

export default ProductSection;
