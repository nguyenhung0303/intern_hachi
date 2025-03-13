import Banner from "@/components/Banner"
import BrandSection from "@/components/BrandSection"
import ProductSection from "@/components/Product/ProductSection"
import ReviewSection from "@/components/ReviewSection"


export default function Home() {
  return (
    <div>
      <Banner />
      <BrandSection />
      <ProductSection />
      <ReviewSection />
    </div>
  );
}
