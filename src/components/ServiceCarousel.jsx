import React, { useState, useEffect } from "react";
import { services } from "../data/servicesData";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

const ServiceCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const currentService = services[activeIndex];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      x: "0%",
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
    }),
  };

  const transition = {
    duration: 0.8,
    ease: "easeInOut",
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900 p-0 lg:p-20">
      {/* Carousel Container with overflow hidden */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
        
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
  key={activeIndex}
  custom={direction}
  variants={slideVariants}
  initial="enter"
  animate="center"
  exit="exit"
  transition={transition}
  className="absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center justify-between"
  style={{
    backgroundImage: `url(${currentService.bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    clipPath: "polygon(0 4%, 100% 0, 100% 100%, 0 97%)"
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/30"></div>

  {/* Content Left */}
  <div className="relative z-10 w-full lg:w-1/2 p-6 lg:p-12 flex justify-center">
    <div className="bg-black/60 backdrop-blur-lg p-8 lg:p-12 rounded-3xl shadow-2xl w-full max-w-3xl text-center lg:text-left">
      <h2 className="text-4xl lg:text-6xl font-extrabold mb-6 text-white">
        {currentService.title}
      </h2>
      <p className="mb-8 text-base lg:text-xl text-gray-200 leading-relaxed">
        {currentService.description}
      </p>
      <a
        href={currentService.buttonLink}
        className="px-6 lg:px-8 py-3 lg:py-4 bg-pink-500 hover:bg-pink-600 
                   rounded-lg font-semibold text-white text-base lg:text-lg transition"
      >
        {currentService.buttonText}
      </a>
    </div>
  </div>

  {/* Right Image */}
  <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center lg:justify-end p-6 lg:pr-8 mt-6 lg:mt-0">
    <motion.img
      key={activeIndex}
      src={currentService.rightImage}
      alt={currentService.title}
      className="max-h-[400px] sm:max-h-[450px] md:max-h-[500px] lg:max-h-full object-contain drop-shadow-2xl"
      animate={{ x: [0, 50, 0] }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
</motion.div>

        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>

        {/* Optional: Slide Indicators */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition ${
                index === activeIndex ? 'bg-pink-500' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ServiceCarousel;
