"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductSectionx = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Dữ liệu giả lập
        const fakeProducts = [
            { id: 1, name: "Sản phẩm 1", priceNew: "$10", priceOld: "$15", image: "/assets/img/product1.jpg" },
            { id: 2, name: "Sản phẩm 2", priceNew: "$20", priceOld: "$25", image: "/assets/img/product2.jpg" },
            { id: 3, name: "Sản phẩm 3", priceNew: "$30", priceOld: "$35", image: "/assets/img/product3.jpg" },
            { id: 4, name: "Sản phẩm 4", priceNew: "$40", priceOld: "$45", image: "/assets/img/product4.jpg" },
            { id: 5, name: "Sản phẩm 5", priceNew: "$50", priceOld: "$55", image: "/assets/img/product5.jpg" },
        ];
        setProducts(fakeProducts);
    }, []);

    return (
        <div className="container">
            <h2 className="product-title">NEW ARRIVALS</h2>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={4} // Hiển thị 4 sản phẩm
                navigation
                pagination={{ clickable: true }}
                loop={true} // Vòng lặp vô hạn
            >

            </Swiper>
        </div>
    );
};

export default ProductSectionx;
