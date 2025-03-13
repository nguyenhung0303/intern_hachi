"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const reviews = [
    {
        name: "Sarah M.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
        name: "Sarah M.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
        name: "Sarah M.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
        name: "Michael R.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "The customer service at Shop.co is exceptional. They were quick to resolve my issue and made sure I was completely satisfied with my purchase.",
    },
    {
        name: "Emily L.",
        avatar: "/assets/img/start.svg",
        check: "/assets/img/check.svg",
        text: "Fast shipping and the clothes fit perfectly! I'll definitely be shopping here again. Love the selection and quality.",
    },
];

const ReviewSection = () => {
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="review-header ">
                <h2 className="review-title">OUR HAPPY CUSTOMERS</h2>
                <div className="swiper-nav-buttons ">
                    <button className="swiper-button-prev-custom">
                        <Image src="/assets/img/ar-l.svg" alt="Left Arrow" width={24} height={24} />
                    </button>
                    <button className="swiper-button-next-custom">
                        <Image src="/assets/img/ar-r.svg" alt="Right Arrow" width={24} height={24} />
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
                                <div className="review-item bg-white p-6 rounded-lg shadow-md h-full">
                                    <div className="item-wrap flex flex-col h-full">
                                        <span className="review-start flex mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Image key={i} src={review.avatar} alt="Star" width={16} height={16} />
                                            ))}
                                        </span>
                                        <div className="review-name flex items-center mb-3">
                                            <p className="name font-semibold">{review.name}</p>
                                            <p className="check ml-2">
                                                <Image src={review.check} alt="Check" width={16} height={16} />
                                            </p>
                                        </div>
                                        <p className="review-des text-gray-600 italic flex-grow">"{review.text}"</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;