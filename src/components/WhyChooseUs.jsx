import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { features } from "../data/whyChooseUsData";

const Card = ({ item, isActive }) => (
  <div
    className={`relative flex flex-col h-[530px] w-full shadow-2xl rounded-2xl overflow-visible transform transition-all duration-500 
      ${isActive ? "scale-105 opacity-100" : "scale-95 opacity-60"}
      hover:scale-105 hover:opacity-100 bg-white`}
  >
    {/* Vertical Label - USE left-2 for safe mobile positioning */}
    <div className="absolute bottom-4 left-2 sm:left-0 transform -rotate-90 origin-bottom-left pointer-events-none">
      <span className="text-lg sm:text-xl font-extrabold uppercase tracking-widest text-blue-800 drop-shadow-md whitespace-nowrap">
        {item.label}
      </span>
    </div>


    {/* Image */}
    <div className="h-[70%] overflow-hidden relative rounded-t-2xl">
      <img
        src={item.imageUrl}
        alt={item.title}
          draggable={false} // <-- prevents default browser drag behavior

        className="object-cover w-full h-full transition-transform duration-500 transform hover:scale-110"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/400x600/cccccc/333333?text=Image+Load+Error";
        }}
      />
    </div>

    {/* Description */}
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

  // --- Drag scroll state ---
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scrollToIndex = (index) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.children[0].offsetWidth + 16;
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  // Mouse wheel / trackpad scroll
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        carousel.scrollBy({
          left: e.deltaY * 1.5,
          behavior: "smooth",
        });
        e.preventDefault();
      }
    };

    carousel.addEventListener("wheel", handleWheel, { passive: false });
    return () => carousel.removeEventListener("wheel", handleWheel);
  }, []);

  // --- Click & drag scroll for desktop ---
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      startX.current = e.pageX - carousel.offsetLeft;
      scrollLeft.current = carousel.scrollLeft;
      carousel.classList.add("cursor-grabbing");
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      carousel.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      carousel.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX.current) * 1.5; // speed multiplier
      carousel.scrollLeft = scrollLeft.current - walk;
    };

    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mouseleave", handleMouseLeave);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mousemove", handleMouseMove);

    return () => {
      carousel.removeEventListener("mousedown", handleMouseDown);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      carousel.removeEventListener("mouseup", handleMouseUp);
      carousel.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Detect center card on mobile
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
const containerWidth = carousel.offsetWidth;
if (containerWidth > 768) return;
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.children[0].offsetWidth + 16;
const center = scrollLeft + containerWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < totalItems; i++) {
        const cardCenter = i * cardWidth + cardWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      setCurrentIndex(closestIndex);
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [totalItems]);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mx-auto py-12 px-0 sm:pl-16 sm:pr-12 w-full max-w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-1">
            Working with us
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900">
            Why Choose Us
          </h2>
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

          {/* Cards */}
<div
  ref={carouselRef}
  className="
    flex overflow-x-auto scroll-smooth scrollbar-hide
    space-x-8 sm:space-x-10
    py-6 px-10 sm:px-16 /* <--- CHANGED px-4 TO px-10 */
    cursor-grab select-none
    snap-x snap-mandatory
  "
>
  {features.map((feature, index) => (
    <div
      key={index}
      className={`
        flex-shrink-0 w-[300px] relative cursor-pointer snap-center
        ${index === 0 ? "ml-[calc(50%-155px)] sm:ml-0" : ""}
        ${index === features.length - 1 ? "mr-[calc(50%-155px)] sm:mr-0" : ""}
      `}
      onClick={() => {
        setCurrentIndex(index);
        if (carouselRef.current) {
          const cardWidth = carouselRef.current.children[0].offsetWidth + 32; // slightly more gap
          const containerWidth = carouselRef.current.offsetWidth;
          const scrollLeft =
            cardWidth * index - (containerWidth / 2 - cardWidth / 2);
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
