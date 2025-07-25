import React, { useRef, useEffect, useState, useCallback } from "react";

const Ourprojectsdescription = ({ projects, settings = {} }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [slideWidthRatio, setSlideWidthRatio] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlideGap, setCurrentSlideGap] = useState(0);
  const [carouselBottomGap, setCarouselBottomGap] = useState(0);
  const [currentProgressBarHeight, setCurrentProgressBarHeight] = useState(0);
  const [dynamicTextMargin, setDynamicTextMargin] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  const BASE_SLIDE_WIDTH = 400;
  const BASE_SLIDE_HEIGHT = 600;
  const BASE_SLIDE_GAP = 50;
  const BASE_CORNER_RADIUS = 20;
  const BASE_TEXT_PADDING = 60;
  const BASE_CAROUSEL_BOTTOM_GAP = 50;
  const BASE_PROGRESS_BAR_HEIGHT = 4;
  const BASE_TEXT_MARGIN = 16;

  const scroll = useCallback((dir) => {
    if (scrollRef.current) {
      const scrollAmount = slideWidth + currentSlideGap;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, [slideWidth, currentSlideGap]);

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const windowWidth = window.innerWidth;
      const containerWidth = containerRef.current.offsetWidth;

      const slidesToDisplay = settings.minimumSlidesToShow ?? (
        windowWidth >= 1280 ? 3.8 :
        windowWidth >= 1024 ? 3.2 :
        windowWidth >= 768 ? 2.4 : 2.4
      );

      let dynamicBaseGap = BASE_SLIDE_GAP;
      if (windowWidth < 640) dynamicBaseGap = 24;
      else if (windowWidth < 768) dynamicBaseGap = 32;
      else if (windowWidth < 1024) dynamicBaseGap = 40;

      const gapRatio = dynamicBaseGap / BASE_SLIDE_WIDTH;
      const totalGapCount = slidesToDisplay - 1;
      const slideAndGapFactor = slidesToDisplay + totalGapCount * gapRatio;

      let calcSlideWidth = containerWidth / slideAndGapFactor;
      let calcSlideGap = calcSlideWidth * gapRatio;

      const MIN_WIDTH = 200;
      if (calcSlideWidth < MIN_WIDTH) {
        calcSlideWidth = MIN_WIDTH;
        calcSlideGap = MIN_WIDTH * gapRatio;
      }

      const ratio = Math.max(0.7, calcSlideWidth / BASE_SLIDE_WIDTH);
      setSlideWidth(calcSlideWidth);
      setSlideHeight(calcSlideWidth * (BASE_SLIDE_HEIGHT / BASE_SLIDE_WIDTH));
      setSlideWidthRatio(ratio);
      setCurrentSlideGap(calcSlideGap);
      setCarouselBottomGap(BASE_CAROUSEL_BOTTOM_GAP * ratio);
      setCurrentProgressBarHeight(BASE_PROGRESS_BAR_HEIGHT * ratio);
      setDynamicTextMargin(BASE_TEXT_MARGIN * ratio);
    };

    const debounce = (fn, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };

    const debouncedUpdate = debounce(updateDimensions, 100);
    updateDimensions();
    window.addEventListener("resize", debouncedUpdate);
    return () => window.removeEventListener("resize", debouncedUpdate);
  }, []);

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;
    const handleScroll = () => {
      const maxScroll = ref.scrollWidth - ref.clientWidth;
      const percent = maxScroll > 0 ? (ref.scrollLeft / maxScroll) * 100 : 0;
      setProgress(percent);
    };
    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
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
      e.stopPropagation();
      const x = e.pageX - slider.offsetLeft;
      const dragSpeed = settings.dragSpeed ?? 1.5;
      const walk = (x - startX) * dragSpeed;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mouseleave", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mouseleave", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, startX, scrollLeft]);

 useEffect(() => {
  const slider = scrollRef.current;
  if (!slider) return;

  const handleWheel = (e) => {
    if (!isHovered) return;

    // Prevent vertical scroll on body
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY || e.deltaX;
    if (Math.abs(delta) < 5) return;

    const dir = delta > 0 ? "right" : "left";
    const dist = slideWidth + currentSlideGap;

    slider.scrollBy({
      left: dir === "right" ? dist : -dist,
      behavior: "smooth",
    });
  };

  // Attach to window so body scrolling is controlled
  window.addEventListener("wheel", handleWheel, { passive: false });

  return () => {
    window.removeEventListener("wheel", handleWheel);
  };
}, [isHovered, slideWidth, currentSlideGap]);


  useEffect(() => {
    const handleKey = (e) => {
      if (!isHovered) return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
  e.preventDefault();
  if (e.key === "ArrowLeft") scroll("left");
  else if (e.key === "ArrowRight") scroll("right");
}

    };
    if (isHovered) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isHovered, scroll]);

  return (
    <section
  ref={containerRef}
  className="w-full min-h-fit md:min-h-screen max-w-[100vw] relative z-[10] bg-[#f0fdf4] overflow-hidden"


  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => {
    setIsHovered(false);
    setActiveIndex(null);
  }}
>



      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <h2 className="font-bold text-gray-800 mb-8 text-center text-xl sm:text-3xl md:text-4xl lg:text-5xl">
          OUR PROJECTS
        </h2>

        {/* Arrows */}
        <div onClick={() => scroll("left")} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black cursor-pointer select-none text-2xl font-bold">
          &lt;
        </div>
        <div onClick={() => scroll("right")} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black cursor-pointer select-none text-2xl font-bold">
          &gt;
        </div>

        {/* Carousel Scroll */}
        <div ref={scrollRef} tabIndex={0} className="cursor-grab active:cursor-grabbing overflow-x-auto scroll-smooth no-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
          <div className="flex w-max select-none" style={{
            gap: `${currentSlideGap}px`,
            paddingLeft: `${BASE_TEXT_PADDING * 0.5 * slideWidthRatio}px`,
            paddingRight: `${BASE_TEXT_PADDING * 0.5 * slideWidthRatio}px`,
            transition: "gap 0.3s ease-out, padding 0.3s ease-out",
          }}>
            {projects.map((project, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={index}
                  onTouchStart={() => setActiveIndex(index)}
                  className="relative group flex-shrink-0 overflow-hidden select-none"
                  style={{
                    width: `${slideWidth}px`,
                    height: `${slideHeight}px`,
                    scrollSnapAlign: "start",
                    backgroundColor: project.bgColor || "#f0f0f0",
                    borderRadius: `${BASE_CORNER_RADIUS * slideWidthRatio}px`,
                    transition: "all 0.3s",
                  }}
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover pointer-events-none" onError={(e) => (e.target.style.opacity = 0.1)} />

                  {/* Gradient */}
                  {project.textPosition === "top" ? (
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 to-transparent z-30" />
                  ) : (
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent z-30" />
                  )}

                  {/* Title */}
                  <div
                    className={`absolute w-full px-4 text-center font-semibold text-white transition-all duration-300 ${
                      project.textPosition === "top"
                        ? (isActive ? "top-2" : "top-4 group-hover:top-2")
                        : (isActive ? "top-2" : "bottom-4 group-hover:top-2")
                    }`}
                    style={{
                      fontSize: `${24 * slideWidthRatio}px`,
                      zIndex: 40,
                      marginTop: `${dynamicTextMargin}px`,
                      marginBottom: `${dynamicTextMargin}px`,
                    }}
                  >
                    {project.title}
                  </div>

                  {/* Conditional Animated Description */}
                  {project.useAnimation && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center text-white text-center px-4 transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      style={{ fontSize: `${15 * slideWidthRatio}px`, lineHeight: 1.4, zIndex: 40 }}
                    >
                      {project.animationType === "wordByWord" ? (
                        <div className="leading-snug">
                          {project.description.split(" ").map((word, i) => (
                            <span
                              key={i}
                              className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ transitionDelay: `${i * 80}ms` }}
                            >
                              {word}&nbsp;
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="leading-snug transition-opacity duration-500">
                          {project.description}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`} style={{ zIndex: 20 }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded mx-auto mt-6" style={{
          width: "100%",
          marginTop: `${carouselBottomGap}px`,
          height: `${currentProgressBarHeight}px`,
        }}>
          <div className="bg-green-700 rounded" style={{
            width: `${progress}%`,
            height: "100%",
            transition: "width 0.3s ease",
          }}></div>
        </div>
      </div>
    </section>
  );
};

export default Ourprojectsdescription;
