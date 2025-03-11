"use client";

import { useState } from "react";
import Image from "next/image";
import "@/css/style.css"
const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);

    const changeQuantity = (amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    return (
        <div className="container">
            <div className="breadcrumb">
                <span>Home <img src="/assets/img/product/dieuhuong.svg" alt="" />T-shirt</span>
            </div>

            <div className="product-box-d">
                <div className="img-s">
                    <Image src="/assets/img/product/image 2.svg" alt="Product 2" width={80} height={80} />
                    <Image src="/assets/img/product/image 5.png" alt="Product 5" width={80} height={80} />
                    <Image src="/assets/img/product/image 6.png" alt="Product 6" width={80} height={80} />
                </div>
                <div className="img-b">
                    <Image src="/assets/img/product/image 1.png" alt="Product 1" width={400} height={400} />
                </div>

                <div className="product-main">
                    <div className="froduct-name-d">T-SHIRT WITH TAPE DETAILS</div>
                    <div className="froduct-rate froduct-rate-d">
                        <span className="rate-start-d">
                            <Image src="/assets/img/start.svg" alt="Rating" width={16} height={16} />
                        </span>
                        <span className="rate-number-d">1/5</span>
                    </div>
                    <div className="froduct-price">
                        <span className="price-new">$240</span>
                        <span className="price-old">$260</span>
                        <span className="sale">-20%</span>
                    </div>
                    <div className="froduct-des">
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                    </div>
                    <div className="line-ft"></div>

                    <p className="title-color">Select Colors</p>
                    <div className="froduct-coler">
                        <button className="yl"></button>
                        <button className="red"></button>
                    </div>

                    <div className="line-ft"></div>
                    <p className="title-color">Choose Size</p>
                    <div className="froduct-size">
                        <button className="sm">Small</button>
                        <button className="big">Big</button>
                    </div>

                    <div className="line-ft"></div>
                    <div className="Purchase-Controls">
                        <div className="quantity-selector">
                            <button onClick={() => changeQuantity(-1)}>−</button>
                            <span>{quantity}</span>
                            <button onClick={() => changeQuantity(1)}>+</button>
                        </div>
                        <button className="banner-button banner-button-d">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
