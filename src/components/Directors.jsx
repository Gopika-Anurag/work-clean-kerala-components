import React, { useState, useEffect } from 'react';

const Directors = ({ attributes }) => {
  const {
    slides = [],
    slideGap,
    backgroundColor,
    title,
    titleColor,
    slideWidth,
    slideHeight,
  } = attributes;

  const [active, setActive] = useState(2);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Use a resize event listener to keep track of the window width for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setActive((prevActive) => (prevActive + 1) % slides.length);
  };

  const handlePrev = () => {
    setActive((prevActive) => (prevActive - 1 + slides.length) % slides.length);
  };

  // Helper function to determine the width and gap based on the view
  const isMobile = windowWidth < 768;
  const itemWidth = isMobile ? windowWidth * 0.5 : slideWidth;
  const gap = isMobile ? 12 : slideGap;

  const calculateTransform = (index) => {
  let position = index - active;

  // Wrap-around fix
  if (position > slides.length / 2) {
    position -= slides.length;
  } else if (position < -slides.length / 2) {
    position += slides.length;
  }

  const extraCenterGap = 30; // px

  let transformX = position * (itemWidth + gap);

  if (!isMobile) {
    // PC view → center two images with gap
    const centerOffset = -((itemWidth + gap + extraCenterGap) / 2);
    transformX += centerOffset;

    if (index === (active + 1) % slides.length) {
      transformX += extraCenterGap / 2;
    }
    if (index === active) {
      transformX -= extraCenterGap / 2;
    }
  } else {
    // Mobile view → single center image, push side cards apart
    if (index === (active - 1 + slides.length) % slides.length) {
      // left neighbor
      transformX -= extraCenterGap / 2;
    }
    if (index === (active + 1) % slides.length) {
      // right neighbor
      transformX += extraCenterGap / 2;
    }
  }

  return `translateX(${transformX}px)`;
};

  const calculateScale = (index) => {
    // This scales the images, making the center ones larger.
    const isCenterPair = !isMobile && (index === active || index === (active + 1) % slides.length);
    const isMobileCenter = isMobile && index === active;
    
    return isCenterPair || isMobileCenter ? 'scale(1.15)' : 'scale(1)';
  };

  return (
    <div className="bg-gray min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl  p-4 sm:p-8" style={{ backgroundColor: backgroundColor }}>
        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-center mb-8 sm:mb-12" style={{ color: titleColor }}>
          {title}
        </h2>

        {/* Carousel Container */}
        <div className="relative h-[490px] sm:h-[600px] flex items-center justify-center">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-20 p-3 bg-gray-200 text-gray-800 rounded-full  hover:bg-gray-300 transition-colors duration-300"
            style={{ width: `${attributes.buttonSize}px`, height: `${attributes.buttonSize}px` }}
          >
            {/* Replaced ChevronLeft with an inline SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-20 p-3 bg-gray-200 text-gray-800 rounded-full  hover:bg-gray-300 transition-colors duration-300"
            style={{ width: `${attributes.buttonSize}px`, height: `${attributes.buttonSize}px` }}
          >
            {/* Replaced ChevronRight with an inline SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          {/* The images wrapper */}
          <div className="flex w-full h-full justify-center items-center">
            {slides.map((director, index) => {
              const isCenterPair = !isMobile && (index === active || index === (active + 1) % slides.length);
              const isMobileCenter = isMobile && index === active;

              // Determine opacity based on visibility for both mobile and desktop
              let opacity = 0;
              if (!isMobile) {
                const prev = (active - 1 + slides.length) % slides.length;
                const next = (active + 2) % slides.length;
                if (index === prev || index === active || index === (active + 1) % slides.length || index === next) {
                  opacity = 1;
                }
              } else {
                const prev = (active - 1 + slides.length) % slides.length;
                const next = (active + 1) % slides.length;
                if (index === prev || index === active || index === next) {
                  opacity = 1;
                }
              }

              return (
                <div
                  key={index}
                  className="absolute transition-all duration-500 ease-in-out"
                  style={{
                    transform: `${calculateTransform(index)} ${calculateScale(index)}`,
                    zIndex: isCenterPair || isMobileCenter ? 10 : 5,
                    opacity: opacity,
                    width: `${itemWidth}px`,
                    height: `${slideHeight}px`,
                  }}
                >
                  <div className={`relative w-full h-full rounded-xl overflow-hidden  transition-all duration-500 `}>
                    <img
                      src={director.image}
                      alt={director.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay for text */}
                    <div className={`absolute bottom-0 left-0 right-0 p-4 bg-white transition-opacity duration-500 opacity-100`}>
                      <h3 className="text-xl sm:text-2xl font-bold text-black">{director.name}</h3>
                      <p className="text-sm text-gray-700">{director.position}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Directors