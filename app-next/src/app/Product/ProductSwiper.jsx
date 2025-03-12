"use client"; // Đánh dấu là client component

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

// Client component cho Swiper
export default function ProductSwiper({ products }) {
    return (
        <div className="product-list">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                loop={true}
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
                        >
                            <Link href={`/Product/${product._id}`}>
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
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}