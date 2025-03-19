import Image from "next/image";

const BrandSection = () => {
    const brands = [
        {
            src: "/assets/img/brand1.svg",
            name: "Tên thương hiệu 1",
            description: "Mô tả ngắn về thương hiệu 1"
        },
        {
            src: "/assets/img/brand2.svg",
            name: "Tên thương hiệu 2",
            description: "Mô tả ngắn về thương hiệu 2"
        },
        {
            src: "/assets/img/brand3.svg",
            name: "Tên thương hiệu 3",
            description: "Mô tả ngắn về thương hiệu 3"
        },
        {
            src: "/assets/img/brand4.svg",
            name: "Tên thương hiệu 4",
            description: "Mô tả ngắn về thương hiệu 4"
        },
        {
            src: "/assets/img/brand5.svg",
            name: "Tên thương hiệu 5",
            description: "Mô tả ngắn về thương hiệu 5"
        }
    ];

    return (
        <section className="bgr-brand py-12" aria-label="Đối tác của chúng tôi">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">Đối Tác Tin Cậy Của Chúng Tôi</h2>
                <div className="brand flex flex-wrap justify-center items-center gap-8">
                    {brands.map((brand, index) => (
                        <div className="brand-item flex flex-col items-center" key={index}>
                            <Image
                                src={brand.src}
                                alt={brand.name}
                                width={150}
                                height={80}
                                loading="lazy"
                                className="transition-transform hover:scale-105"
                            />
                            <span className="sr-only">{brand.description}</span>
                        </div>
                    ))}
                </div>
                <p className="text-center mt-8">Hợp tác với các thương hiệu hàng đầu để mang lại giải pháp tốt nhất cho khách hàng.</p>
            </div>
        </section>
    );
};

export default BrandSection;