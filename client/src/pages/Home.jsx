import HeroBanner from "../components/HeroBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import BestSelling from "../components/BestSelling";
//import NewArrivals from "../components/NewArrivals";
//import CustomerReviews from "../components/CustomerReviews";
//import VisitStore from "../components/VisitStore";

function Home() {
  return (
    <>
  <HeroBanner />

  <Categories />

  <BestSelling />

  <FeaturedProducts />

  <WhyChooseUs />
</>
  );
}

export default Home;