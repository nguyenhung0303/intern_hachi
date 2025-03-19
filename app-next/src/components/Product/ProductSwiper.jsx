"use client"; // Đánh dấu là client component

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

// Client component cho Swiper
export default function ProductSwiper({ products }) {
    // Thiết lập slidesPerView phù hợp dựa trên số lượng sản phẩm
    const slidesPerView = products.length < 4 ? products.length : 4;

    return (
        <div className="product-list">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={slidesPerView}
                pagination={{ clickable: true }}
                loop={products.length > slidesPerView} // Chỉ bật chế độ loop khi có đủ slide
                breakpoints={{
                    // Cài đặt responsive
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: slidesPerView }
                }}
            >
                {products.map((product, index) => {
                    const firstImage = Array.isArray(product.images)
                        ? product.images[0]
                        : typeof product.images === "string"
                            ? product.images.split(",")[0]
                            : "";

                    // Sửa cách tạo URL hình ảnh
                    const imageUrl = firstImage
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${firstImage.replace(/^\/+/, '')}`
                        : "/assets/img/placeholder.jpg";

                    return (
                        <SwiperSlide
                            key={index}
                            className="product-item"
                        >
                            <Link href={`/Product/${product.slug}`}>
                                {firstImage ? (
                                    <div style={{ position: "relative", width: "100%", height: "298px" }}>
                                        <Image
                                            src={imageUrl}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                ) : (
                                    <div className="placeholder-image" style={{ width: "100%", height: "298px", backgroundColor: "#f0f0f0" }} />
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
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}