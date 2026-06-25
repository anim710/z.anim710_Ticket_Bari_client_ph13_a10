"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Button } from "@heroui/react";
import Link from "next/link";

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
  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="h-[85vh]"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative h-full w-full bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-slate-950/70" />
              <div className="relative z-10 max-w-7xl mx-auto px-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-2xl">
                  {slide.title}
                </h1>
                <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-xl">
                  {slide.subtitle}
                </p>
                <Button
                  as={Link}
                  href="/tickets"
                  size="lg"
                  className="bg-blue-600 text-white font-semibold px-8"
                >
                  Browse Tickets
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}