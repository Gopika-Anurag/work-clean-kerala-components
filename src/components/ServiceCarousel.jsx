import React, { useState, useEffect } from "react";
import { services } from "../data/servicesData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

const ServiceCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

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

  // Background animation setup (LEFT direction)
  const bgX = useMotionValue(0);
  const bgPosition = useTransform(bgX, (v) => `${v}% center`);
  const rightX = useMotionValue(0);


  useEffect(() => {
  const controls = animate(rightX, [0, 100, 0], {
    duration: 10, // speed (lower = faster)
    repeat: Infinity,
    ease: "easeInOut",
  });
  return () => controls.stop();
}, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900 p-0 lg:p-20">
      <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">

        <AnimatePresence initial={true} custom={direction} mode="wait">
  <motion.div
    key={activeIndex}
    custom={direction}
    initial={{ x: direction === 1 ? "100%" : "-100%" }}
    animate={{ x: "0%" }}
    exit={{ x: direction === 1 ? "-100%" : "100%" }}
    transition={{ x: { duration: 0.8, ease: "easeInOut" } }}
    className="absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center justify-between"
    style={{
      backgroundImage: `url(${currentService.bgImage})`,
      backgroundSize: "200% auto",
      backgroundPosition: bgPosition,
      clipPath: "polygon(0 4%, 100% 0, 100% 100%, 0 97%)",
    }}
  >
    <div className="absolute inset-0 bg-black/30"></div>

    {/* Left Content Animation */}
    <motion.div
      className="relative z-10 w-full lg:w-1/2 p-6 lg:p-12 flex justify-center"
      animate={{ x: [0, -30, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    >
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
    </motion.div>

    {/* Right Image Animation */}
    <motion.div
      className="relative z-10 w-full lg:w-1/2 flex items-center justify-center lg:justify-end p-6 lg:pr-8 mt-6 lg:mt-0"
      animate={{ x: [0, 30, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.img
        key={activeIndex}
        src={currentService.rightImage}
        alt={currentService.title}
        className="max-h-[400px] sm:max-h-[450px] md:max-h-[500px] lg:max-h-full object-contain drop-shadow-2xl"
      />
    </motion.div>
  </motion.div>
</AnimatePresence>


        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition"
        >
          <ChevronLeft className="text-white w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition"
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ServiceCarousel;
