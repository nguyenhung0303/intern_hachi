import Image from "next/image";

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
];

const ReviewSection = () => {
    return (
        <div className="container">
            <div className="review-header">
                <h2 className="review-title">OUR HAPPY CUSTOMERS</h2>
                <div className="arow">
                    <Image src="/assets/img/ar-l.svg" alt="Left Arrow" width={24} height={24} />
                    <Image src="/assets/img/ar-r.svg" alt="Right Arrow" width={24} height={24} />
                </div>
            </div>
            <div className="review-main">
                {reviews.map((review, index) => (
                    <div className="review-item" key={index}>
                        <div className="item-wrap">
                            <span className="review-start">
                                <Image src={review.avatar} alt="Star" width={16} height={16} />
                            </span>
                            <div className="review-name">
                                <p className="name">{review.name}</p>
                                <p className="check">
                                    <Image src={review.check} alt="Check" width={16} height={16} />
                                </p>
                            </div>
                            <p className="review-des">"{review.text}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;
