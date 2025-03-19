"use client"; // Đánh dấu là client component

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules"; // Thêm A11y module
import "swiper/css";

// Client component cho Swiper
export default function ProductSwiper({ products }) {
    const [mounted, setMounted] = useState(false);

    // Hydration safety
    useEffect(() => {
        setMounted(true);
    }, []);

    // Thiết lập slidesPerView phù hợp dựa trên số lượng sản phẩm
    const slidesPerView = products.length < 4 ? products.length : 4;

    // Tối ưu hiệu suất bằng cách tạo sẵn các giá điện thoại
    const formattedProducts = products.map((product, index) => {
        // Xử lý hình ảnh
        const firstImage = Array.isArray(product.images)
            ? product.images[0]
            : typeof product.images === "string"
                ? product.images.split(",")[0]
                : "";

        const imageUrl = firstImage
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${firstImage.replace(/^\/+/, '')}`
            : "/assets/img/placeholder.jpg";

        // Tính giảm giá
        const oldPrice = parseFloat(product.oldPrice);
        const newPrice = parseFloat(product.newPrice);
        const discountPercentage = oldPrice > 0 ? Math.round((1 - newPrice / oldPrice) * 100) : 0;

        return {
            ...product,
            imageUrl,
            discountPercentage,
            formattedNewPrice: `$${newPrice.toFixed(2)}`,
            formattedOldPrice: `$${oldPrice.toFixed(2)}`
        };
    });

    if (!mounted) {
        return <div className="loading-placeholder" aria-busy="true" aria-label="Loading products..."></div>;
    }

    return (
        <div className="product-list">
            <Swiper
                modules={[Navigation, Pagination, A11y]} // Thêm A11y module
                spaceBetween={10}
                slidesPerView={slidesPerView}
                pagination={{ clickable: true }}
                loop={products.length > slidesPerView}
                a11y={{ // Cấu hình accessibility
                    prevSlideMessage: 'Previous product slide',
                    nextSlideMessage: 'Next product slide',
                    containerMessage: 'New arrivals product carousel',
                    paginationBulletMessage: 'Go to slide {{index}}'
                }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: slidesPerView }
                }}
            >
                {formattedProducts.map((product, index) => (
                    <SwiperSlide
                        key={product.id || index}
                        className="product-item"
                    >
                        <article itemProp="itemListElement" itemScope itemType="https://schema.org/Product">
                            <Link href={`/Product/${product.slug}`} aria-label={`View details of ${product.name}`}>
                                <meta itemProp="productID" content={product.id} />
                                <meta itemProp="url" content={`/Product/${product.slug}`} />

                                {/* Thêm noscript fallback */}
                                <noscript>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        width="298"
                                        height="298"
                                        loading="lazy"
                                    />
                                </noscript>

                                <div style={{ position: "relative", width: "100%", height: "298px" }}>
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{ objectFit: "cover" }}
                                        loading="lazy"
                                        itemProp="image"
                                    />
                                </div>

                                <h3 className="product-name" itemProp="name">{product.name}</h3>

                                <div className="product-rate" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                                    <meta itemProp="ratingValue" content="1" />
                                    <meta itemProp="reviewCount" content="1" />
                                    <span className="rate-star">
                                        <Image src="/assets/img/start.svg" alt="Rating" width={16} height={16} />
                                    </span>
                                    <span className="rate-number">1/5</span>
                                </div>

                                <div className="product-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                    <meta itemProp="price" content={product.newPrice} />
                                    <meta itemProp="priceCurrency" content="USD" />
                                    <meta itemProp="availability" content="https://schema.org/InStock" />
                                    <span className="price-new-h">{product.formattedNewPrice}</span>
                                    <span className="price-old-h">{product.formattedOldPrice}</span>
                                    <span className="sale">{product.discountPercentage}%</span>
                                </div>
                            </Link>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}