import Image from "next/image";

const BrandSection = () => {
    const brands = [
        "/assets/img/brand1.svg",
        "/assets/img/brand2.svg",
        "/assets/img/brand3.svg",
        "/assets/img/brand4.svg",
        "/assets/img/brand5.svg",
    ];

    return (
        <div className="bgr-brand">
            <div className="container">
                <div className="brand">
                    {brands.map((src, index) => (
                        <div className="brand-item" key={index}>
                            <Image src={src} alt={`Brand ${index + 1}`} width={150} height={80} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandSection;
