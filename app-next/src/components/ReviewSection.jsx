"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Head from "next/head";
import Script from "next/script";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const reviews = [
    {
        name: "Sarah M.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
        rating: 5,
        date: "2025-02-15"
    },
    {
        name: "Michael R.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "The customer service at Shop.co is exceptional. They were quick to resolve my issue and made sure I was completely satisfied with my purchase.",
        rating: 5,
        date: "2025-02-10"
    },
    {
        name: "Emily L.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "Fast shipping and the clothes fit perfectly! I'll definitely be shopping here again. Love the selection and quality.",
        rating: 5,
        date: "2025-01-28"
    },
    {
        name: "David K.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "The quality of the clothing from Shop.co is exceptional. The materials are durable and the designs are stylish. Highly recommend!",
        rating: 5,
        date: "2025-01-15"
    },
    {
        name: "Jennifer T.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "Great selection of clothes and excellent prices. The delivery was faster than expected and everything fits perfectly.",
        rating: 5,
        date: "2025-01-05"
    },
];

// Calculate average rating for structured data
const calculateAverageRating = () => {
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
};

const ReviewSection = () => {
    const [domLoaded, setDomLoaded] = useState(false);
    const averageRating = calculateAverageRating();

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    // Structured data for reviews
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Shop.co Clothing",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": averageRating,
            "reviewCount": reviews.length
        },
        "review": reviews.map(review => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": review.name
            },
            "datePublished": review.date,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating
            },
            "reviewBody": review.text
        }))
    };

    return (
        <>
            <Head>
                <title>Customer Reviews for Shop.co - Quality Clothing and Exceptional Service</title>
                <meta name="description" content="Read authentic customer reviews about Shop.co clothing. Our customers love our quality, style, and exceptional customer service." />
                <meta property="og:title" content="Customer Reviews - Shop.co" />
                <meta property="og:description" content="See what our happy customers have to say about Shop.co's quality clothing and exceptional service." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Customer Reviews - Shop.co" />
                <meta name="twitter:description" content="See what our happy customers have to say about Shop.co's quality clothing and exceptional service." />
            </Head>

            <Script
                id="review-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <section
                className="container mx-auto px-4 py-8"
                aria-label="Customer Reviews"
                itemScope
                itemType="https://schema.org/Review"
            >
                <div className="review-header flex justify-between items-center mb-6">
                    <h2 className="review-title text-2xl font-bold">OUR HAPPY CUSTOMERS</h2>
                    <div className="swiper-nav-buttons flex space-x-4">
                        <button
                            className="swiper-button-prev-custom"
                            aria-label="Previous review"
                        >
                            <Image
                                src="/assets/img/ar-l.svg"
                                alt="Previous review"
                                width={24}
                                height={24}
                                priority
                            />
                        </button>
                        <button
                            className="swiper-button-next-custom"
                            aria-label="Next review"
                        >
                            <Image
                                src="/assets/img/ar-r.svg"
                                alt="Next review"
                                width={24}
                                height={24}
                                priority
                            />
                        </button>
                    </div>
                </div>

                {domLoaded && (
                    <div className="review-main">
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation={{
                                prevEl: '.swiper-button-prev-custom',
                                nextEl: '.swiper-button-next-custom',
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                            className="review-swiper"
                        >
                            {reviews.map((review, index) => (
                                <SwiperSlide key={index}>
                                    <article
                                        className="review-item bg-white p-6 rounded-lg shadow-md h-full"
                                        itemProp="review"
                                        itemScope
                                        itemType="https://schema.org/Review"
                                    >
                                        <div className="item-wrap flex flex-col h-full">
                                            <span className="review-start flex mb-2" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Image
                                                        key={i}
                                                        src={review.avatar}
                                                        alt={i < review.rating ? "Filled star" : "Empty star"}
                                                        width={16}
                                                        height={16}
                                                        loading="lazy"
                                                    />
                                                ))}
                                            </span>
                                            <div className="review-name flex items-center mb-3">
                                                <p className="name font-semibold" itemProp="author">{review.name}</p>
                                                <span className="check ml-2">
                                                    <Image
                                                        src={review.check}
                                                        alt="Verified purchase"
                                                        width={16}
                                                        height={16}
                                                        loading="lazy"
                                                    />
                                                </span>
                                            </div>
                                            <p className="review-des text-gray-600 italic flex-grow" itemProp="reviewBody">"{review.text}"</p>
                                            <meta itemProp="datePublished" content={review.date} />
                                        </div>
                                    </article>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </section>
        </>
    );
};

export default ReviewSection;