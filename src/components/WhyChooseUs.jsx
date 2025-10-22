import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { features } from "../data/whyChooseUsData";

const Card = ({ item, isActive }) => (
  <div
    className={`relative flex flex-col h-[530px] w-full shadow-2xl rounded-2xl overflow-visible transform transition-all duration-500 ${
      isActive ? "scale-105 opacity-100" : "scale-95 opacity-60"
    } hover:scale-105 bg-white`}
  >
    <div className="absolute bottom-4 left-0 transform -rotate-90 origin-bottom-left pointer-events-none">
      <span className="text-lg font-extrabold uppercase tracking-widest text-blue-800 drop-shadow-md whitespace-nowrap">
        {item.label}
      </span>
    </div>

    <div className="h-[70%] overflow-hidden relative rounded-t-2xl">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="object-cover w-full h-full transition-transform duration-500 transform hover:scale-110"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/400x600/cccccc/333333?text=Image+Load+Error";
        }}
      />
    </div>

    <div
      className={`p-8 h-[40%] text-white ${item.color} flex flex-col justify-center rounded-b-2xl transition-opacity duration-500`}
    >
      <p className="text-lg leading-relaxed">{item.description}</p>
    </div>
  </div>
);

const WhyChooseUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const totalItems = features.length;

  const scrollToIndex = (index) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.children[0].offsetWidth + 16; // spacing
    carouselRef.current.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });
  };

  const nextSlide = () => {
    const nextIndex = Math.min(currentIndex + 1, totalItems - 1);
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  // Arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

// Mouse wheel / trackpad horizontal scroll
useEffect(() => {
  const carousel = carouselRef.current;
  if (!carousel) return;

  const handleWheel = (e) => {
    // Only horizontal scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // Multiply delta for smoother trackpad scroll
      carousel.scrollBy({
        left: e.deltaY * 1.5, // adjust multiplier for speed
        behavior: "smooth",
      });
      e.preventDefault(); // prevent vertical page scroll
    }
  };

  carousel.addEventListener("wheel", handleWheel, { passive: false });
  return () => carousel.removeEventListener("wheel", handleWheel);
}, []);


  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mx-auto py-12 pl-16 pr-12 w-full max-w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-1">
            Working with us
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900">Why Choose Us</h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 p-4 bg-white text-gray-700 rounded-full shadow-lg hover:bg-blue-100 transition duration-300 z-10"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 p-4 bg-white text-gray-700 rounded-full shadow-lg hover:bg-blue-100 transition duration-300 z-10"
          >
            <ChevronRight size={28} />
          </button>

         {/* Carousel container */}
<div
  ref={carouselRef}
  className="flex overflow-x-auto scroll-smooth scrollbar-hide space-x-10 py-6 pl-16"
>
  {features.map((feature, index) => (
    <div
  key={index}
  className="flex-shrink-0 w-[300px] relative cursor-pointer"
  onClick={() => {
    setCurrentIndex(index);

    // Center the clicked card
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0].offsetWidth + 16; // include gap
      const containerWidth = carouselRef.current.offsetWidth;
      const scrollLeft = cardWidth * index - (containerWidth / 2 - cardWidth / 2);

      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }}
>
  <Card item={feature} isActive={index === currentIndex} />
</div>

  ))}
</div>

        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
