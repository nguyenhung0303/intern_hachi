"use client";

import { useState } from "react";
import Head from 'next/head';

const ProductDetailUI = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Lấy BACKEND_URL từ biến môi trường
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    const changeQuantity = (amount) => {
        const newQuantity = quantity + amount;
        if (newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

    // Xử lý mảng hình ảnh từ MongoDB với BACKEND_URL
    const images = product.images && product.images.length > 0
        ? product.images.map(img => `${BACKEND_URL}${img.startsWith("/") ? img : `/${img}`}`)
        : [`${BACKEND_URL}/assets/img/product/image 1.png`];

    // Chuyển đổi giá từ MongoDB
    const price = product.newPrice || product.price || 0;
    const oldPrice = product.oldPrice || null;

    // Xử lý màu sắc và kích thước
    const colors = product.colors || [];
    const sizes = product.sizes || [];

    return (
        <>
            <Head>
                <title>Chi tiết sản phẩm - {product.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="container">
                <div className="product-box-d">
                    <div className="img-s">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} - ảnh ${index + 1}`}
                                onClick={() => handleImageClick(index)}
                                className={selectedImageIndex === index ? "selected" : ""}
                            />
                        ))}
                    </div>
                    <div className="img-b">
                        <img src={images[selectedImageIndex]} alt={product.name} />
                    </div>

                    <div className="product-main">
                        <div className="froduct-name-d">{product.name || "T-SHIRT WITH TAPE DETAILS"}</div>
                        <div className="froduct-rate froduct-rate-d">
                            <span className="rate-start-d"><img src={`/assets/img/start.svg`} alt="" /></span>
                            <span className="rate-number-d">{product.rating || "1/5"}</span>
                        </div>
                        <div className="froduct-price">
                            <span className="price-new">${price}</span>
                            {oldPrice && (
                                <>
                                    <span className="price-old">${oldPrice}</span>
                                    <span className="sale">
                                        {product.discount ||
                                            (oldPrice && price ? `-${Math.round((1 - price / oldPrice) * 100)}%` : "")}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="froduct-des">
                            {product.description || "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."}
                        </div>

                        <div className="line-ft"></div>
                        <p className="title-color">Choose Size</p>
                        <div className="froduct-size">
                            {sizes.length > 0 ? (
                                sizes.map((size, index) => (
                                    <button key={index} className={getSizeClass(size)}>{size}</button>
                                ))
                            ) : (
                                <>
                                    <button className="sm">Small</button>
                                    <button className="big">Big</button>
                                </>
                            )}
                        </div>
                        <div className="line-ft"></div>
                        <div className="Purchase-Controls">
                            <div className="quantity-selector">
                                <button onClick={() => changeQuantity(-1)}>−</button>
                                <span id="quantity">{quantity}</span>
                                <button onClick={() => changeQuantity(1)}>+</button>
                            </div>
                            <button className="banner-button banner-button-d">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Hàm helper để chuyển đổi mã màu thành giá trị CSS
const getColorValue = (colorCode) => {
    const colorMap = {
        "1": "black",
        "2": "blue",
        "3": "red",
        "4": "green",
        "5": "yellow",
        // Thêm các mã màu khác nếu cần
    };
    return colorMap[colorCode] || colorCode;
};

// Hàm helper để xác định class CSS cho kích thước
const getSizeClass = (sizeCode) => {
    const sizeMap = {
        "S": "sm",
        "M": "md",
        "L": "lg",
        "XL": "xl",
        "XXL": "xxl",
        "1": "sm",
        "2": "md",
        "3": "lg",
        "4": "xl",
        "5": "xxl",
        // Thêm các mã kích thước khác nếu cần
    };
    return sizeMap[sizeCode] || "sm";
};

export default ProductDetailUI;