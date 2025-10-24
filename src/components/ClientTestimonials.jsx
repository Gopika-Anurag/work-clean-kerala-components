import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clientTestimonials } from "../data/clientTestimonialsData";
import '../styles/clienttestimonials.css'

{/* --- Global Style for Keyframes --- */}

// Reusable Card component
const ClientTestimonialCard = ({ logoText, logoBg, quote, clientName, company }) => (

    
  <div
    className="
      p-6 md:p-10
      bg-purple-900/70 border border-purple-800/50
      rounded-xl shadow-2xl transition duration-300
      flex flex-col space-y-6
      hover:border-purple-600/80 hover:scale-[1.01]
      min-w-[300px] sm:min-w-[350px] md:min-w-[380px]
      h-[420px]
    "
  >
    {/* Circular Logo */}
    <div
      className={`
        w-20 h-20 rounded-full ${logoBg}
        flex items-center justify-center text-white text-[9px] font-semibold text-center leading-tight
        shadow-lg ring-4 ring-purple-700/50
      `}
    >
      <span className="p-1">{logoText.toUpperCase()}</span>
    </div>

    {/* Quote */}
    <p className="text-gray-200 text-base leading-relaxed grow min-h-[120px] lg:min-h-[140px]">
      {quote}
    </p>

    {/* Client Info */}
    <div>
      <p className="text-fuchsia-400 font-semibold text-lg mb-1">{clientName}</p>
      <p className="text-fuchsia-400 text-sm font-medium hover:text-fuchsia-300 transition cursor-pointer">
        @{company}
      </p>
    </div>
  </div>
);

// Main Carousel Component
const ClientTestimonials = () => {
  const carouselRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const cardWidth = container.firstChild?.offsetWidth || 380;
    const gap = 24; // Tailwind gap
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  

  // Mouse drag support
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let isDown = false;
    let startX, scrollLeft;

    const startDrag = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const stopDrag = () => (isDown = false);
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
    return () => {
      el.removeEventListener("mousedown", startDrag);
      el.removeEventListener("mouseleave", stopDrag);
      el.removeEventListener("mouseup", stopDrag);
      el.removeEventListener("mousemove", moveDrag);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") scroll("right");
      if (e.key === "ArrowLeft") scroll("left");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
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
      {/* Violet transparent glow band */}
{/* Violet transparent glow band */}
<div className="gradient-slide-animated bg-gradient-to-t from-transparent via-[#5e1af9]/40 to-transparent"></div>


      {/* Arrows */}
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