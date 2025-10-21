// src/components/ServicesCarousel.jsx
import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, MoveRight } from "lucide-react";
import { coreServicesData } from "../data/coreServicesData";
import "../styles/ServicesCarousel.css";

const ServiceCard = ({ title, description, imageUrl, link, interaction }) => {
  const [isTextVisible, setIsTextVisible] = useState(interaction === "always");

  const handleAction = () => {
    if (interaction === "click") setIsTextVisible((prev) => !prev);
    else console.log(`Navigating to: ${link}`);
  };

  let contentVisibilityClass = "";
  if (interaction === "hover") {
    contentVisibilityClass =
      "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0";
  } else if (interaction === "always") {
    contentVisibilityClass = "opacity-100 translate-y-0";
  } else if (interaction === "click") {
    contentVisibilityClass = isTextVisible
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-4";
  }

  let gradientClass =
    "bg-gradient-to-t from-black/80 via-black/30 to-transparent";
  if (interaction === "hover") {
    gradientClass =
      "bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90";
  } else if (interaction === "click") {
    gradientClass = isTextVisible
      ? "bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      : "bg-gradient-to-t from-black/80 via-black/80 to-transparent";
  }

  return (
    <div
      onClick={handleAction}
      className="relative flex-shrink-0 w-[80vw] sm:w-[400px] md:w-[450px] lg:w-[500px] h-[400px] sm:h-[500px] group cursor-pointer overflow-hidden rounded-lg shadow-xl transition-all duration-300 hover:shadow-gray-700/50"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/1000x1200/374151/ffffff?text=Image+Error";
        }}
      />

      <div className={`absolute inset-0 ${gradientClass} transition-all duration-500`} />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide mb-4 uppercase">
          {title}
        </h2>

        <div className={`transition-all duration-500 ease-out ${contentVisibilityClass}`}>
          <p className="text-sm sm:text-base font-light leading-relaxed mb-6 line-clamp-3">
            {description}
          </p>

          {/* Transparent square full-width button */}
          <button
            className="w-full py-3 px-6 bg-transparent border border-white text-white uppercase text-sm font-semibold tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            READ MORE <MoveRight className="inline w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ServicesCarousel = () => {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const duringDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => setIsDragging(false);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!carouselRef.current) return;
      const scrollAmount = 400;
      if (e.key === "ArrowRight") {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // New function for Mouse Wheel/Scroll
  const handleWheelScroll = (e) => {
    if (carouselRef.current) {
      // Prevent vertical page scrolling when scrolling over the carousel
      e.preventDefault();
      // Scroll horizontally based on the deltaY (vertical scroll) of the mouse wheel
      // You might need to adjust the multiplier (e.g., 2 or 3) for comfortable speed
      carouselRef.current.scrollLeft += e.deltaY * 2; 
    }
  };

  // Manual arrow button control
  const scrollLeftFn = () => {
    carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };
  const scrollRightFn = () => {
    carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="relative bg-gray-900 text-white py-16 px-6 sm:px-12 font-inter overflow-hidden">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 tracking-tight">
        Our Core Services
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
        We specialize in high-impact design and build solutions across various sectors,
        delivering excellence from concept to completion.
      </p>

      {/* Left Arrow */}
      <button
        onClick={scrollLeftFn}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-10 transition"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollRightFn}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-10 transition"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="services-carousel-container"
        onMouseDown={startDrag}
        onMouseMove={duringDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onWheel={handleWheelScroll} 
      >
        {coreServicesData.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>

      <div className="text-gray-400 text-sm mt-12 text-center max-w-3xl mx-auto border-t border-gray-700/50 pt-6">
        <p>Scroll, drag, use arrows or keyboard →</p>
      </div>
    </div>
  );
};

export default ServicesCarousel;
