"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from 'next/head'; // Thêm React Helmet để kiểm soát thẻ meta

const Banner = () => {
    const [bannerData] = useState({
        titles: [
            "FIND CLOTHES THAT MATCHES YOUR STYLE",
            "DISCOVER THE LATEST FASHION TRENDS",
            "ELEVATE YOUR WARDROBE WITH PREMIUM QUALITY",
            "EXPRESS YOURSELF THROUGH STYLISH APPAREL"
        ],
        description:
            "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
        stats: [
            { number: "200+", text: "International Brands" },
            { number: "2,000+", text: "High-Quality Products" },
            { number: "30,000+", text: "Happy Customers" },
        ],
    });

    const [displayedTitle, setDisplayedTitle] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseBeforeDelete = 2000;
    const pauseBeforeNewTitle = 500;

    const typingRef = useRef(null);

    useEffect(() => {
        clearInterval(typingRef.current);

        const currentFullTitle = bannerData.titles[currentTitleIndex];

        typingRef.current = setInterval(() => {
            if (!isDeleting) {
                if (displayedTitle.length < currentFullTitle.length) {
                    setDisplayedTitle(currentFullTitle.slice(0, displayedTitle.length + 1));
                } else {
                    setIsTyping(false);
                    setTimeout(() => {
                        setIsDeleting(true);
                        setIsTyping(true);
                    }, pauseBeforeDelete);
                    clearInterval(typingRef.current);
                }
            } else {
                if (displayedTitle.length > 0) {
                    setDisplayedTitle(displayedTitle.slice(0, displayedTitle.length - 1));
                } else {
                    setIsDeleting(false);
                    const nextTitleIndex = (currentTitleIndex + 1) % bannerData.titles.length;
                    setCurrentTitleIndex(nextTitleIndex);
                    setTimeout(() => {
                        setIsTyping(true);
                    }, pauseBeforeNewTitle);
                    clearInterval(typingRef.current);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearInterval(typingRef.current);
    }, [displayedTitle, isDeleting, currentTitleIndex, isTyping, bannerData.titles]);

    return (
        <>
            <Head>
                <title>Cửa hàng thời trang - Quần áo chất lượng cao cấp</title>
                <meta name="description" content={bannerData.description} />
                <meta name="keywords" content="thời trang, quần áo, phong cách, cao cấp, thương hiệu quốc tế" />
                <link rel="canonical" href="https://yourwebsite.com/fashion" />
                <meta property="og:title" content="Cửa hàng thời trang - Quần áo chất lượng cao cấp" />
                <meta property="og:description" content={bannerData.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://yourwebsite.com/fashion" />
                <meta property="og:image" content="https://yourwebsite.com/images/fashion-banner.jpg" />
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": "Bộ sưu tập thời trang",
                            "description": "${bannerData.description}",
                            "brand": {
                                "@type": "Brand",
                                "name": "Thương hiệu thời trang của bạn"
                            },
                            "offers": {
                                "@type": "AggregateOffer",
                                "priceCurrency": "VND",
                                "lowPrice": "450000",
                                "highPrice": "4500000",
                                "offerCount": "2000"
                            }
                        }
                    `}
                </script>
            </Head>

            {/* Thêm thuộc tính schema.org có cấu trúc JSON-LD cho SEO */}
            <script type="application/ld+json">
                {`
                    {
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": "Fashion Collection",
                        "description": "${bannerData.description}",
                        "brand": {
                            "@type": "Brand",
                            "name": "Your Fashion Brand"
                        },
                        "offers": {
                            "@type": "AggregateOffer",
                            "priceCurrency": "USD",
                            "lowPrice": "19.99",
                            "highPrice": "199.99",
                            "offerCount": "2000"
                        }
                    }
                `}
            </script>

            {/* Sử dụng header thay vì div cho ngữ nghĩa HTML tốt hơn */}
            <header className="container-banner">
                <section className="banner-slide active" aria-label="Fashion banner">
                    <div className="banner">
                        <div className="container">
                            <div className="banner-main">
                                <div className="banner-content">
                                    {/* Hiển thị tất cả các tiêu đề cho crawler, nhưng ẩn bằng CSS */}
                                    <div className="seo-titles" aria-hidden="true" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
                                        {bannerData.titles.map((title, index) => (
                                            <h2 key={index}>{title}</h2>
                                        ))}
                                    </div>

                                    {/* Tiêu đề hiển thị với hiệu ứng gõ cho người dùng */}
                                    <h1 className="typing-effect" aria-live="polite">
                                        {displayedTitle}
                                        {isTyping && <span className="typing-cursor" aria-hidden="true">|</span>}
                                    </h1>
                                </div>
                                <div className="banner-content-des">
                                    <p>{bannerData.description}</p>
                                </div>
                                <button className="banner-button" aria-label="Shop Now - Browse our collection">Shop Now</button>
                                <div className="banner-hightlights" role="list">
                                    {bannerData.stats.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <div className="banner-hightlights-item" role="listitem">
                                                <span className="hightlights-number">{item.number}</span>
                                                <p>{item.text}</p>
                                            </div>
                                            {index < bannerData.stats.length - 1 && <div className="line-banner" aria-hidden="true"></div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </header>
            <div className="banner-s"></div>
        </>
    );
};

export default Banner;