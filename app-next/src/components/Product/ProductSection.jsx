// ProductSection.js - Server Component
import Image from "next/image";
import Link from "next/link";
import ProductSwiper from "@/components/Product/ProductSwiper";
import { fetchProducts } from "@/util/api";

// Thêm metadata để cải thiện SEO
export const metadata = {
    title: "New Arrivals - Shop Our Latest Products",
    description: "Discover our newest collection of products. High quality items with great prices and fast shipping.",
    openGraph: {
        title: "New Arrivals - Shop Our Latest Products",
        description: "Discover our newest collection of products. High quality items with great prices and fast shipping.",
        type: "website"
    }
};

async function ProductSection() {
    const productData = await fetchProducts();
    const products = productData.data || [];

    // Schema markup cho danh sách sản phẩm (JSON-LD)
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": product.name,
                "image": typeof product.images === "string"
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.images.split(',')[0].replace(/^\/+/, '')}`
                    : Array.isArray(product.images) && product.images.length > 0
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.images[0].replace(/^\/+/, '')}`
                        : "/assets/img/placeholder.jpg",
                "offers": {
                    "@type": "Offer",
                    "price": product.newPrice,
                    "priceCurrency": "USD"
                }
            }
        }))
    };

    if (products.length === 0) {
        return <p className="text-center py-8">Không tìm thấy sản phẩm.</p>;
    }

    return (
        <div className="container">
            <div className="product-box-ok product-box">
                <h2 className="product-title">NEW ARRIVALS</h2>
                {/* Thêm semantic HTML để cải thiện SEO */}
                <section aria-label="New arrivals product collection">
                    <ProductSwiper products={products} />
                </section>
                {/* Thêm Schema markup (JSON-LD) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />
            </div>
            <Link href="/ProductP" className="product-button banner-button">
                View All
            </Link>
        </div>
    );
}

export default ProductSection;