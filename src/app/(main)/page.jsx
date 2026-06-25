import HeroBanner from "@/components/home/HeroBanner";
import AdvertisedTickets from "@/components/home/AdvertisedTickets";
// import LatestTickets from "@/components/home/LatestTickets";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PopularRoutes from "@/components/home/PopularRoutes";
import LatestTickets from "@/components/home/LatestTickets";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <AdvertisedTickets />
      <LatestTickets />
      <WhyChooseUs />
      <PopularRoutes />
    </div>
  );
}