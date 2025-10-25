import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clientTestimonials } from "../data/clientTestimonialsData";
import "../styles/clienttestimonials.css";

const ClientTestimonialCard = ({ logoText, logoBg, quote, clientName, company }) => (
  <div
    className="
      relative group overflow-hidden
      p-6 md:p-10
      bg-purple-900/70 border border-purple-800/50
      rounded-xl shadow-2xl transition duration-300
      flex flex-col space-y-6
      hover:border-purple-600/80 hover:scale-[1.01]
      min-w-[300px] sm:min-w-[350px] md:min-w-[380px]
      h-[420px]
    "
  >
    {/* 🌈 Animated Gradient Overlay — FULL HEIGHT */}
    <span
      className="
        absolute top-0 left-0 w-full h-full 
        rounded-xl animated-gradient
        bg-gradient-to-br from-blue-400/40 via-pink-500/40 to-purple-600/40
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500 ease-out
        pointer-events-none
        z-0
      "
    ></span>

    {/* 🧱 Foreground Content */}
    <div className="relative z-10 flex flex-col space-y-6">
      <div
        className={`w-20 h-20 rounded-full ${logoBg}
          flex items-center justify-center text-white text-[9px] font-semibold text-center leading-tight
          shadow-lg ring-4 ring-purple-700/50`}
      >
        <span className="p-1">{logoText.toUpperCase()}</span>
      </div>

      <p className="text-gray-200 text-base leading-relaxed grow min-h-[120px] lg:min-h-[140px]">
        {quote}
      </p>

      <div>
        <p className="text-fuchsia-400 font-semibold text-lg mb-1">{clientName}</p>
        <p className="text-fuchsia-400 text-sm font-medium hover:text-fuchsia-300 transition cursor-pointer">
          @{company}
        </p>
      </div>
    </div>
  </div>
);


const ClientTestimonials = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const cardWidth = container.firstChild?.offsetWidth || 380;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // 🖱️ Click & Drag Scroll
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let isDown = false;
    let startX, scrollLeft;

    const startDrag = (e) => {
      isDown = true;
      el.classList.add("dragging");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const stopDrag = () => {
      isDown = false;
      el.classList.remove("dragging");
    };

    const moveDrag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", startDrag);
    el.addEventListener("mouseleave", stopDrag);
    el.addEventListener("mouseup", stopDrag);
    el.addEventListener("mousemove", moveDrag);

    const preventSelection = (e) => {
      if (isDown) e.preventDefault();
    };
    document.addEventListener("selectstart", preventSelection);

    return () => {
      el.removeEventListener("mousedown", startDrag);
      el.removeEventListener("mouseleave", stopDrag);
      el.removeEventListener("mouseup", stopDrag);
      el.removeEventListener("mousemove", moveDrag);
      document.removeEventListener("selectstart", preventSelection);
    };
  }, []);

  // ⌨️ Keyboard Navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") scroll("right");
      if (e.key === "ArrowLeft") scroll("left");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 🧭 Mouse Wheel Scroll
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let touchpadDetected = false;
    let lastTime = 0;

    const handleWheel = (e) => {
      const now = Date.now();
      const delta = Math.abs(e.deltaX) + Math.abs(e.deltaY);
      if (delta < 10) return;
      if (now - lastTime < 50 && delta < 100) touchpadDetected = true;
      lastTime = now;

      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const direction = e.deltaY > 0 || e.deltaX > 0 ? "right" : "left";
      const canScrollLeft = el.scrollLeft > 0;
      const canScrollRight = el.scrollLeft < maxScrollLeft;
      const canScroll =
        (direction === "left" && canScrollLeft) ||
        (direction === "right" && canScrollRight);

      if (canScroll) {
        e.preventDefault();
        if (touchpadDetected) {
          el.scrollLeft += e.deltaY * 1.5 + e.deltaX * 1.5;
        } else {
          const cardWidth = el.firstChild?.offsetWidth || 380;
          const gap = 24;
          const scrollAmount = cardWidth + gap;
          el.scrollBy({
            left: direction === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
          });
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    
    <div
      className="
        min-h-screen
        bg-indigo-950
        font-sans
        relative
        p-8 md:p-16
        overflow-hidden
        flex flex-col items-center justify-center
      "
    >
      {/* 🚫 Removed Gradient Band */}

      {/* Navigation Arrows */}
      <div className="flex justify-between w-full max-w-7xl mb-6 relative z-20">
        <button
          onClick={() => scroll("left")}
          className="p-3 bg-purple-800/50 rounded-full hover:bg-purple-700/70 transition"
        >
          <ChevronLeft className="text-white" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="p-3 bg-purple-800/50 rounded-full hover:bg-purple-700/70 transition"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="
          flex gap-6 overflow-x-auto scroll-smooth 
          max-w-7xl mx-auto pb-6 
          no-scrollbar relative z-20
        "
      >
        {clientTestimonials.map((t) => (
          <div key={t.id}>
            <ClientTestimonialCard {...t} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientTestimonials;
