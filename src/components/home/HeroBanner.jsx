"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Button } from "@heroui/react";
import { ArrowRight, Magnifier } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Travel Bangladesh in Comfort",
    subtitle: "Book bus, train, launch & flight tickets — all in one place.",
    bg: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600",
  },
  {
    title: "Fast. Easy. Reliable.",
    subtitle: "Skip the queue. Book your seat online in minutes.",
    bg: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600",
  },
  {
    title: "Explore Every Corner",
    subtitle: "Hundreds of routes across Bangladesh at your fingertips.",
    bg: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1600",
  },
];

export default function HeroBanner() {
  const router = useRouter();
  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[88vh]"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative h-full w-full bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              {/* Layered overlay for readable contrast in both themes */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <span className="inline-flex items-center gap-2 mb-5 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-sm text-white border border-white/20">
                  <span className="w-2 h-2 rounded-full brand-gradient" />
                  Bangladesh&apos;s online ticket marketplace
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-2xl leading-tight">
                  {slide.title}
                </h1>
                <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onPress={() => router.push("/tickets")}
                    variant="primary"
                    size="lg"
                    className="brand-gradient text-white font-semibold px-8"
                  >
                    Browse Tickets <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    onPress={() => router.push("/tickets")}
                    variant="outline"
                    size="lg"
                    className="bg-white/10 backdrop-blur text-white border-white/30 px-6"
                  >
                    <Magnifier className="w-4 h-4" /> Search routes
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
