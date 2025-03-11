"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import "@/css/style.css";
import { getProductByIdApi } from "@/util/api"; // Import API
import namer from "color-namer";
import { usePathname } from "next/navigation";

const ProductDetail = () => {
    //url
    const pathname = usePathname(); // Lấy URL hiện tại
    const pathSegments = pathname.split("/").filter((segment) => segment);


    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");

    const getColorName = (hex) => {
        const names = namer(hex); // Lấy danh sách tên màu gần nhất
        return names.basic[0].name; // Lấy tên màu cơ bản (basic)
    };

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const response = await getProductByIdApi(id);
                setProduct(response);


                if (response.images && response.images.length > 0) {
                    setSelectedImage(`${process.env.NEXT_PUBLIC_BACKEND_URL}${response.images[0]}`);
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const changeQuantity = (amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    if (!product) return <p>Loading...</p>;
    console.log("check pro>>>>>", product.images)

    return (
        <div className="container">

            <div className="breadcrumb">
                <a href="/">Home</a>
                <img src="/assets/img/dieuhuong.svg" alt="Arrow" />
                <a href="/products">Products</a>
                <img src="/assets/img/dieuhuong.svg" alt="Arrow" />
                <a href="">{product.name}</a>

            </div>

            <div className="product-box-d">

                <div className="img-s">
                    {product.images?.map((img, index) => (

                        < Image
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${img}`}
                            alt={`Product ${index}`}
                            width={80}
                            height={80}
                            className={selectedImage === `${process.env.NEXT_PUBLIC_BACKEND_URL}${img}` ? "selected" : ""}
                            onClick={() => setSelectedImage(`${process.env.NEXT_PUBLIC_BACKEND_URL}${img}`)}
                        />

                    ))}
                </div>


                <div className="img-b">
                    <Image src={selectedImage} alt="Main Product" width={400} height={400} />
                </div>

                <div className="product-main">
                    <div className="froduct-name-d">{product.name}</div>
                    <div className="froduct-rate froduct-rate-d">
                        <span className="rate-start-d">
                            <Image src="/assets/img/start.svg" alt="Rating" width={16} height={16} />
                        </span>
                        <span className="rate-number-d">{product.rating}/5</span>
                    </div>
                    <div className="froduct-price">
                        <span className="price-new">${product.newPrice}</span>
                        <span className="price-old">${product.oldPrice}</span>
                        <span className="sale">20%</span>
                    </div>
                    <div className="froduct-des">{product.description}</div>
                    <div className="line-ft"></div>

                    <p className="title-color">Select Colors</p>
                    <div className="froduct-coler">
                        {product.colors?.map((color, index) => {
                            const colorName = getColorName(color); // Dịch mã màu sang tên màu
                            return (
                                <button
                                    key={index}
                                    style={{ backgroundColor: color }} // Đặt màu nền
                                    className="color-button"
                                >
                                </button>
                            );
                        })}
                    </div>

                    <div className="line-ft"></div>
                    <p className="title-color">Choose Size</p>
                    <div className="froduct-size">
                        {product.sizes?.map((size, index) => (
                            <button key={index} className={size.toLowerCase()}>{size}</button>
                        ))}
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
