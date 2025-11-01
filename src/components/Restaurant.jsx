import React, { useState, useEffect, useRef } from "react";
import { ChevronsDown, ChevronLeft, ChevronRight } from "lucide-react";
import { restaurantData } from "../data/restaurantData";
import "../styles/restaurant.css";

const Restaurant = () => {
  const totalSlides = restaurantData.length;
  const slides = [...restaurantData, restaurantData[0]]; // clone first for seamless looping
  const autoscrollInterval = 5000;
  const transitionDuration = 2000;

  const [translateXIndex, setTranslateXIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  // Auto-scroll setup
  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(nextSlide, autoscrollInterval);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Handle looping
  useEffect(() => {
    if (translateXIndex === totalSlides) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setTranslateXIndex(0);
        setCurrentSlide(0);
        requestAnimationFrame(() =>
          setTimeout(() => setIsTransitioning(true), 50)
        );
      }, transitionDuration);
      return () => clearTimeout(resetTimer);
    } else {
      setCurrentSlide(translateXIndex % totalSlides);
    }
  }, [translateXIndex]);

  // Navigation controls
  const nextSlide = () => {
    stopAutoScroll();
    setIsTransitioning(true);
    setTranslateXIndex((prev) => prev + 1);
    startAutoScroll();
  };

  const prevSlide = () => {
    stopAutoScroll();
    if (translateXIndex === 0) {
      setIsTransitioning(false);
      setTranslateXIndex(totalSlides - 1);
      setCurrentSlide(totalSlides - 1);
      requestAnimationFrame(() =>
        setTimeout(() => setIsTransitioning(true), 50)
      );
    } else {
      setTranslateXIndex((prev) => prev - 1);
    }
    startAutoScroll();
  };

  const goTo = (index) => {
    stopAutoScroll();
    setTranslateXIndex(index);
    startAutoScroll();
  };

  const handleScrollToDiscover = () => {
    console.log("Scroll down to discover section...");
  };

  return (
    <div className="min-h-screen w-full bg-black font-sans relative overflow-hidden">
      <main className="relative h-screen w-full flex items-center justify-center">
        {/* Slides */}
 <div
    className="absolute inset-0 flex"
    style={{
      width: `${(totalSlides + 1) * 100}vw`,
      transform: `translateX(-${translateXIndex * 100}vw)`,
      transition: isTransitioning
        ? `transform ${transitionDuration}ms ease-in-out`
        : "none",
    }}
  >
    {slides.map((slide, index) => (
      <div
        key={index}
        className="relative h-full w-screen flex-shrink-0 flex flex-col items-center justify-center text-center px-6"
        style={{
          backgroundImage: `url(${slide.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Text Content */}
        <div className="relative z-10 max-w-4xl text-center">
          <h2
  className="font-extrabold mb-4 leading-tight text-center"
  style={{
    color: "#ffb300",
    fontSize: "clamp(2rem, 5vw, 4rem)", // min 2rem, max 4rem, scales with viewport
  }}
>
  {slide.title}
</h2>

<p
  className="text-white mb-12 font-medium tracking-wide text-center max-w-2xl mx-auto"
  style={{
    fontSize: "clamp(1rem, 2.5vw, 1.5rem)", // min 1rem, max 1.5rem, scales with viewport
  }}
>
  {slide.subtitle}
</p>


          <button
            onClick={handleScrollToDiscover}
            className="group inline-flex items-center justify-center px-6 py-3 border-2 border-amber-500 text-base font-semibold text-amber-500 
                        bg-transparent rounded-full tracking-wider transition-all duration-300 hover:bg-amber-500 hover:text-black shadow-lg"
          >
            Scroll down to Discover
            <ChevronsDown className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* 🔹 Desktop Navigation Arrows */}
  <div className="hidden md:flex absolute inset-0 items-center justify-between px-8 z-20">
    <button
      onClick={prevSlide}
      className="group bg-black/30 hover:bg-black/70 text-white p-5 rounded-full transition-all duration-300 backdrop-blur-sm"
    >
      <ChevronLeft size={36} className="group-hover:scale-110 transition-transform" />
    </button>
    <button
      onClick={nextSlide}
      className="group bg-black/30 hover:bg-black/70 text-white p-5 rounded-full transition-all duration-300 backdrop-blur-sm"
    >
      <ChevronRight size={36} className="group-hover:scale-110 transition-transform" />
    </button>
  </div>

  {/* 🔸 Desktop Dots (Centered Below Slides) */}
  <div className="hidden md:flex absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 space-x-3">
    {Array.from({ length: totalSlides }).map((_, index) => (
      <div
        key={index}
        onClick={() => goTo(index)}
        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
          index === currentSlide ? "bg-amber-500 w-6" : "bg-white opacity-50"
        }`}
      />
    ))}
  </div>

{/* 🔹 Mobile Arrows + Dots in One Row */}
<div className="md:hidden absolute bottom-8 left-0 w-full flex items-center justify-between px-4 z-30">
  {/* Left Arrow */}
  <button
    onClick={prevSlide}
    className="bg-black/50 hover:bg-amber-500 text-white p-3 rounded-full transition-all duration-300"
  >
    <ChevronLeft size={22} />
  </button>

  {/* Dots */}
  <div className="flex space-x-2">
    {Array.from({ length: totalSlides }).map((_, index) => (
      <div
        key={index}
        onClick={() => goTo(index)}
        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
          index === currentSlide ? "bg-amber-500 w-6" : "bg-white opacity-50"
        }`}
      />
    ))}
  </div>

  {/* Right Arrow */}
  <button
    onClick={nextSlide}
    className="bg-black/50 hover:bg-amber-500 text-white p-3 rounded-full transition-all duration-300"
  >
    <ChevronRight size={22} />
  </button>
</div>

      </main>
    </div>
  );
};

export default Restaurant;
