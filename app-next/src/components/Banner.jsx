"use client";

import React, { useState, useEffect, useRef } from "react";

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
        <div className="container-banner">
            <div className="banner-slide active">
                <div className="banner">
                    <div className="container">
                        <div className="banner-main">
                            <div className="banner-content">
                                <h2 className="typing-effect">
                                    {displayedTitle}
                                    {isTyping && <span className="typing-cursor">|</span>}
                                </h2>
                            </div>
                            <div className="banner-content-des">
                                <p>{bannerData.description}</p>
                            </div>
                            <button className="banner-button">Shop Now</button>
                            <div className="banner-hightlights">
                                {bannerData.stats.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <div className="banner-hightlights-item">
                                            <span className="hightlights-number">{item.number}</span>
                                            <p>{item.text}</p>
                                        </div>
                                        {index < bannerData.stats.length - 1 && <div className="line-banner"></div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;