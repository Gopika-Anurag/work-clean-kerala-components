import React, { useRef, useState, useEffect } from "react";
import healthServicesData from "../data/healthServicesData";

function HealthServices() {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setScrollProgress(progress);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector(".snap-center").offsetWidth;
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector(".snap-center").offsetWidth;
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    checkScroll();
    carousel.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      carousel.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
<div className="relative flex flex-col items-center py-20 px-6 md:px-60 bg-gray-100">      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-indigo-500 hover:text-white transition"
        >
          {/* Left Arrow SVG (Triangle shape) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-indigo-500 hover:text-white transition"
        >
          {/* Right Arrow SVG (Triangle shape) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto w-full scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {/* Map over the slides array */}
        {healthServicesData.map((slide, index) => (
          <div
            key={index}
    className="flex-shrink-0 w-full md:w-1/3 snap-center px-2"
            style={{ height: "600px" }}
          >
            {slide.type === 'dualCard' ? (
              // Dual Card Layout: 2-row grid
              <div className="grid grid-rows-2 gap-4 w-full h-full">
                {slide.cards.map((card, cardIndex) => (
                  <div
                    key={card.id || cardIndex}
                    className="rounded-lg overflow-hidden shadow-lg"
                    style={{ backgroundColor: card.type === "text" ? card.backgroundColor : undefined }}
                  >
                    {card.type === "text" ? (
                      <div className="p-6 h-full flex flex-col justify-between text-white">
                        <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                        <p className="text-sm">{card.description}</p>
                        <button className="mt-4 px-4 py-2 bg-white text-black rounded font-semibold self-start">
                          {card.buttonText}
                        </button>
                      </div>
                    ) : (
                      <img
                        src={card.imageUrl}
                        alt={`Image for ${card.title || "service"}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Full Image Layout
              <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
                <img
                  src={slide.cards[0].imageUrl}
                  alt="Full service image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar (unchanged) */}
      <div className="w-full max-w-7xl h-2 bg-gray-300 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default HealthServices;