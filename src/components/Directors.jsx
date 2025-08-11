import React, { useState, useEffect, useRef, useCallback } from "react";

const Directors = ({ attributes }) => {
  const {
    slides = [],
    slideGap,
    backgroundColor,
    title,
    titleColor,
    slideWidth,
    slideHeight,
    buttonSize,
    autoScrolling,
  } = attributes;

  const [active, setActive] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isMobile = windowWidth < 768;
  const gap = isMobile ? 12 : slideGap;
  const extraCenterGap = 20;

  // Responsive width and height calculation
  const getSlideDimensions = () => {
    if (windowWidth < 480) {
      // small mobile
      return { width: windowWidth * 0.5, height: slideHeight * 0.7 };
    } else if (windowWidth < 768) {
      // larger mobile/tablet
      return { width: windowWidth * 0.4, height: slideHeight * 0.7 };
    } else if (windowWidth < 1024) {
      // small desktop
      return { width: slideWidth * 0.8, height: slideHeight * 0.8 };
    }
    // desktop and above
    return { width: slideWidth, height: slideHeight };
  };

  const { width: itemWidth, height: itemHeight } = getSlideDimensions();

  // Track window width for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate transform for the card to position it correctly
  const calculateTransform = (index) => {
    let position = index - active;

    if (position > slides.length / 2) {
      position -= slides.length;
    } else if (position < -slides.length / 2) {
      position += slides.length;
    }

    let transformX = position * (itemWidth + gap);

    if (!isMobile) {
      const centerOffset = -((itemWidth + gap + extraCenterGap) / 2);
      transformX += centerOffset;

      if (index === (active + 1) % slides.length) {
        transformX += extraCenterGap / 2;
      }
      if (index === active) {
        transformX -= extraCenterGap / 2;
      }
    } else {
      if (index === (active - 1 + slides.length) % slides.length) {
        transformX -= extraCenterGap / 2;
      }
      if (index === (active + 1) % slides.length) {
        transformX += extraCenterGap / 2;
      }
    }
    return `translateX(${transformX}px)`;
  };

  const calculateScale = (index) => {
    if (!isMobile) {
      return index === active || index === (active + 1) % slides.length
        ? "scale(1.15)"
        : "scale(1)";
    } else {
      return index === active ? "scale(1.15)" : "scale(1)";
    }
  };

  // Add navigation logic
  const scrollLeft = useCallback(() => {
    setActive((prevActive) => (prevActive - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const scrollRight = useCallback(() => {
    setActive((prevActive) => (prevActive + 1) % slides.length);
  }, [slides.length]);

  // Dragging and touch event handlers
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollPosition(scrollRef.current.scrollLeft);
    e.preventDefault();
  }, []);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollPosition(scrollRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const walk = e.pageX - startX;
      scrollRef.current.scrollLeft = scrollPosition - walk;
    },
    [isDragging, startX, scrollPosition]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const walk = e.touches[0].pageX - startX;
      scrollRef.current.scrollLeft = scrollPosition - walk;
    },
    [isDragging, startX, scrollPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard arrow scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        scrollLeft();
      } else if (e.key === "ArrowRight") {
        scrollRight();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollLeft, scrollRight]);

  // Auto-scrolling
  useEffect(() => {
    if (!autoScrolling || slides.length <= 1 || isHovered || isDragging) return;

    const interval = setInterval(() => {
      scrollRight();
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScrolling, slides.length, isHovered, isDragging, scrollRight]);

  return (
    <div
      className="bg-gray min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: backgroundColor }}
    >
      <div
        className="relative w-full max-w-7xl mx-auto rounded-xl p-4 sm:p-8 py-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h2
          className="text-3xl sm:text-5xl font-extrabold text-center mb-1 sm:mb-6 mt-0 sm:mt-4"
          style={{ color: titleColor }}
        >
          {title}
        </h2>

        <div className="relative h-[490px] sm:h-[600px] flex items-center justify-center">
          {/* Slides */}
          <div
            ref={scrollRef}
            className={`flex w-full h-full justify-center items-center overflow-x-hidden no-scrollbar ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ gap: `${gap}px` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {slides.map((director, index) => {
              const isCenterPair =
                !isMobile &&
                (index === active || index === (active + 1) % slides.length);
              const isMobileCenter = isMobile && index === active;

              let opacity = 0;
              if (!isMobile) {
                const prev = (active - 1 + slides.length) % slides.length;
                const next = (active + 2) % slides.length;
                if (
                  index === prev ||
                  index === active ||
                  index === (active + 1) % slides.length ||
                  index === next
                ) {
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
                    height: `${itemHeight}px`,
                    transitionProperty: "width, height, transform",
                    transitionDuration: "0.5s",
                    transitionTimingFunction: "ease-in-out",
                  }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-500">
                    <img
                      src={director.image}
                      alt={director.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />

                    {(() => {
                      let overlayStyle = null;
                      if (!isMobile) {
                        const prev = (active - 1 + slides.length) % slides.length;
                        const next = (active + 2) % slides.length;
                        if (index === prev) {
                          overlayStyle = {
                            background:
                              "linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                          };
                        }
                        if (index === next) {
                          overlayStyle = {
                            background:
                              "linear-gradient(to left, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                          };
                        }
                      } else {
                        const prev = (active - 1 + slides.length) % slides.length;
                        const next = (active + 1) % slides.length;
                        if (index === prev) {
                          overlayStyle = {
                            background:
                              "linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                          };
                        }
                        if (index === next) {
                          overlayStyle = {
                            background:
                              "linear-gradient(to left, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                          };
                        }
                      }
                      return overlayStyle ? (
                        <div className="absolute inset-0" style={overlayStyle}></div>
                      ) : null;
                    })()}

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white transition-opacity duration-500 opacity-100">
                      <h3 className="text-xl sm:text-2xl font-bold text-black">
                        {director.name}
                      </h3>
                      <p className="text-sm text-gray-700">{director.position}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-white/50 rounded-full z-20"
            aria-label="Previous slide"
            style={{ marginLeft: '-180px' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-white/50 rounded-full z-20"
            aria-label="Next slide"
            style={{ marginRight: '-180px' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Directors;
