import React, { useRef, useEffect, useState, useCallback } from "react";

const ActivitiesCarousel = ({ items, settings = {} }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [carouselPadding, setCarouselPadding] = useState(0);
  const [currentSlideGap, setCurrentSlideGap] = useState(0);
  const [carouselBottomGap, setCarouselBottomGap] = useState(0);
  const [currentProgressBarHeight, setCurrentProgressBarHeight] = useState(0);
  const [slideScaleFactor, setSlideScaleFactor] = useState(1);

  const BASE_SLIDE_WIDTH = settings.slideWidth ?? 500;
  const BASE_SLIDE_HEIGHT = settings.slideHeight ?? 250;
  const BASE_SLIDE_GAP = 50;
  const BASE_CORNER_RADIUS = 20;
  const BASE_TEXT_PADDING = 25;
  const BASE_CAROUSEL_BOTTOM_GAP = 50;
  const BASE_PROGRESS_BAR_HEIGHT = 6;

  const scroll = useCallback(
    (dir) => {
      if (!scrollRef.current) return;
      const scrollAmount = (slideWidth + currentSlideGap) * (settings.scrollSpeed ?? 1);
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    },
    [slideWidth, currentSlideGap, settings.scrollSpeed]
  );

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const windowWidth = window.innerWidth;
      const slidesToDisplay = settings.minimumSlidesToShow ?? (windowWidth >= 1280 ? 2.8 : windowWidth >= 1024 ? 2.5 : windowWidth >= 768 ? 1.8 : 1.5);

      let dynamicBaseGap = BASE_SLIDE_GAP;
      if (windowWidth < 640) dynamicBaseGap = 24;
      else if (windowWidth < 768) dynamicBaseGap = 32;
      else if (windowWidth < 1024) dynamicBaseGap = 40;

      const assumedGapRatio = dynamicBaseGap / BASE_SLIDE_WIDTH;
      let calcSlideWidth = containerWidth / (slidesToDisplay + (slidesToDisplay - 1) * assumedGapRatio);
      let calcSlideGap = calcSlideWidth * assumedGapRatio;

      const MIN_WIDTH = 200;
      if (calcSlideWidth < MIN_WIDTH) {
        calcSlideWidth = MIN_WIDTH;
        calcSlideGap = MIN_WIDTH * assumedGapRatio;
      }

      const slideRatio = calcSlideWidth / BASE_SLIDE_WIDTH;
      setSlideWidth(calcSlideWidth);
      setSlideHeight(calcSlideWidth * (BASE_SLIDE_HEIGHT / BASE_SLIDE_WIDTH));
      setCurrentSlideGap(calcSlideGap);
      setCarouselPadding(calcSlideGap);
      setCarouselBottomGap(BASE_CAROUSEL_BOTTOM_GAP * slideRatio);
      setCurrentProgressBarHeight(BASE_PROGRESS_BAR_HEIGHT * slideRatio);
      setSlideScaleFactor(slideRatio);
    };

    updateDimensions();
    const debounce = (fn, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };
    const handleResize = debounce(updateDimensions, 100);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [settings.minimumSlidesToShow]);

  useEffect(() => {
    const handleScroll = () => {
      const slider = scrollRef.current;
      if (!slider) return;
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      setProgress(maxScroll > 0 ? (slider.scrollLeft / maxScroll) * 100 : 0);
    };

    const slider = scrollRef.current;
    slider?.addEventListener("scroll", handleScroll);
    return () => slider?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - slider.offsetLeft);
      setScrollLeft(slider.scrollLeft);
      slider.classList.add("select-none");
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      slider.classList.remove("select-none");
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * (settings.dragSpeed ?? 2);
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseUp);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseUp);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, startX, scrollLeft, settings.dragSpeed]);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleWheel = (e) => {
      if (!isHovered) return;

      const delta = e.deltaY || e.deltaX;
      const isTouchpad = Math.abs(delta) < 50;

      if (isTouchpad) {
        const touchpadSpeed = settings.touchpadScrollSpeed ?? 1.2;
        const wheelMultiplier = settings.wheelScrollMultiplier ?? 1;
        slider.scrollBy({
          left: delta * touchpadSpeed * wheelMultiplier,
          behavior: "auto",
        });
      } else {
        e.preventDefault();
        const direction = delta > 0 ? 1 : -1;
        const scrollAmount = (slideWidth + currentSlideGap) * direction * (settings.scrollSpeed ?? 1);
        slider.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    slider.addEventListener("wheel", handleWheel, { passive: false });
    return () => slider.removeEventListener("wheel", handleWheel);
  }, [isHovered, settings, slideWidth, currentSlideGap]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isHovered) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scroll("left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scroll("right");
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isHovered, scroll]);

  return (
    <section
      ref={containerRef}
      className="w-full relative bg-[#f0fdf4] py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="px-4 sm:px-6 lg:px-12">
        <h2 className="text-center font-bold text-gray-800 text-3xl md:text-5xl mb-5">
          Activities at a Glance
        </h2>

        <div className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-black" onClick={() => scroll("left")}>
          &lt;
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-black" onClick={() => scroll("right")}>
          &gt;
        </div>

        <div
          ref={scrollRef}
          className="cursor-grab active:cursor-grabbing overflow-x-auto no-scrollbar scroll-smooth"
          style={{ scrollSnapType: "x mandatory", padding: `0 ${carouselPadding}px` }}
        >
          <div className="flex w-max select-none" style={{ gap: `${currentSlideGap}px` }}>
            {items.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-row"
                style={{
                  width: `${slideWidth}px`,
                  height: `${slideHeight}px`,
                  padding: `${BASE_TEXT_PADDING * slideScaleFactor}px`,
                  borderRadius: `${BASE_CORNER_RADIUS * slideScaleFactor}px`,
                  background: item.bgColor ?? "#E6F4EA",
                  gap: `${currentSlideGap / 2}px`,
                }}
              >
                {/* Left Half: Image */}
                <div className="w-1/2 h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    // Ensure image fills its container height if that's the goal for alignment
                    // Changed h-[90%] to h-full
                    className="object-cover w-full h-full pointer-events-none"
                    style={{ borderRadius: `${BASE_CORNER_RADIUS * slideScaleFactor}px` }}
                  />
                </div>

                {/* Right Half: Text and Button */}
                <div className="w-1/2 flex flex-col justify-between items-start h-full">
                  {/* Top Text Content */}
                  <div>
                    {item.topRightText && (
                      <span
                        style={{
                          fontSize: `${16 * slideScaleFactor}px`,
                          fontWeight: "bold",
                          color: item.topRightTextColor ?? "#374151",
                          display: "block",
                          marginBottom: `${8 * slideScaleFactor}px`,
                        }}
                      >
                        {item.topRightText}
                      </span>
                    )}
                    <p
                      style={{
                        font: `bold ${30 * slideScaleFactor}px/1 sans-serif`,
                        color: item.valueColor,
                        marginBottom: `${4 * slideScaleFactor}px`,
                      }}
                    >
                      {item.value}
                    </p>
                    <p
                      style={{
                        font: `${15 * slideScaleFactor}px/1.2 sans-serif`,
                        color: item.labelColor,
                      }}
                    >
                      {item.label}
                    </p>
                  </div>

                  {/* Button Content */}
                  {item.showKnowMoreButton && (
                    <button
                      className="bg-green-600 text-white hover:bg-green-700 transition font-semibold"
                      style={{
                        width: `${120 * slideScaleFactor}px`,
                        height: `${40 * slideScaleFactor}px`,
                        borderRadius: `${10 * slideScaleFactor}px`,
                        fontSize: `${16 * slideScaleFactor}px`,
                      }}
                    >
                      Know More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-200 rounded mt-6" style={{ height: `${currentProgressBarHeight}px` }}>
          <div className="bg-green-700 rounded" style={{ width: `${progress}%`, height: "100%" }} />
        </div>
      </div>
    </section>
  );
};

export default ActivitiesCarousel;
