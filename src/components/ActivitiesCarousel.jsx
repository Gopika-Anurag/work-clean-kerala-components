import React, { useRef, useEffect, useState, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AnimatedNumber from "./AnimatedNumber";

const ActivitiesCarousel = ({ items, settings = {} }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const yearListRef = useRef(null);
  const observers = useRef([]); // To keep track of IntersectionObservers for cleanup

  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [carouselPadding, setCarouselPadding] = useState(0);
  const [currentSlideGap, setCurrentSlideGap] = useState(0);
  const [currentProgressBarHeight, setCurrentProgressBarHeight] = useState(0);
  const [slideScaleFactor, setSlideScaleFactor] = useState(1);
  const [itemActive, setItemActive] = useState({});

  // State to control when a pie chart should re-animate
  const [pieChartShouldAnimate, setPieChartShouldAnimate] = useState({});


  const BASE_SLIDE_WIDTH = settings.slideWidth ?? 500;
  const BASE_SLIDE_HEIGHT = settings.slideHeight ?? 250;
  const BASE_SLIDE_GAP = 50;
  const BASE_CORNER_RADIUS = 20;
  const BASE_TEXT_PADDING = 25;
  const BASE_PROGRESS_BAR_HEIGHT = 6;

  // Handles vertical scrolling for the year list (if present)
  const handleYearListWheel = useCallback((e) => {
    if (!yearListRef.current) return;
    e.preventDefault(); // Prevent default page scroll
    yearListRef.current.scrollBy({
      top: e.deltaY,
      behavior: "smooth",
    });
  }, []); // Empty dependency array means this function is created once

  // Scrolls the main carousel left or right
  const scroll = useCallback(
    (dir) => {
      if (!scrollRef.current) return;
      const pixelSpeed = settings.pixelScroll ?? 100;
      const scrollAmount = dir === "left" ? -pixelSpeed : pixelSpeed;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    },
    [settings.pixelScroll]
  );

  // Effect to update carousel dimensions on resize and initial load
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const windowWidth = window.innerWidth;

      const slidesToDisplay =
        settings.minimumSlidesToShow ??
        (windowWidth >= 1280 ? 2.8 : windowWidth >= 1024 ? 2.5 : windowWidth >= 768 ? 1.8 : 1.5);

      let dynamicBaseGap = BASE_SLIDE_GAP;
      if (windowWidth < 640) dynamicBaseGap = 24;
      else if (windowWidth < 768) dynamicBaseGap = 32;
      else if (windowWidth < 1024) dynamicBaseGap = 40;

      const assumedGapRatio = dynamicBaseGap / BASE_SLIDE_WIDTH;
      let calcSlideWidth =
        containerWidth / (slidesToDisplay + (slidesToDisplay - 1) * assumedGapRatio);
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

  // Effect to update scroll progress bar
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    const handleScroll = () => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      setProgress(maxScroll > 0 ? (slider.scrollLeft / maxScroll) * 100 : 0);
    };
    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse drag functionality
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDragging = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      isDragging = false;
      slider.style.cursor = "grab";
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
  }, [settings.dragSpeed]);

  // Mouse wheel scroll functionality
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
        slider.scrollBy({ left: delta * touchpadSpeed * wheelMultiplier, behavior: "auto" });
      } else {
        e.preventDefault();
        const direction = delta > 0 ? 1 : -1;
        const scrollAmount = (slideWidth + currentSlideGap) * direction * (settings.scrollSpeed ?? 1);
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };

    slider.addEventListener("wheel", handleWheel, { passive: false });
    return () => slider.removeEventListener("wheel", handleWheel);
  }, [isHovered, slideWidth, currentSlideGap, settings.touchpadScrollSpeed, settings.wheelScrollMultiplier, settings.scrollSpeed]);

  // Keyboard navigation (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKey = (e) => {
      if (!isHovered) return;

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        scroll(e.key === "ArrowLeft" ? "left" : "right");
      }
    };

    document.addEventListener("keydown", handleKey, { passive: false });
    return () => document.removeEventListener("keydown", handleKey);
  }, [isHovered, scroll]);

  // Initialize visibility for the first few slides on load
  useEffect(() => {
    const initialActive = {};
    const initialPieChartAnimate = {};
    items.forEach((_, i) => {
      if (i < 2) { // Consider the first 2 items as initially "active"
        initialActive[i] = true;
        // For charts, if initially active, mark them to animate
        if (items[i].type === "chart") {
          initialPieChartAnimate[i] = Date.now(); // Set an initial timestamp
        }
      }
    });
    setItemActive(initialActive);
    setPieChartShouldAnimate(initialPieChartAnimate); // Set initial state
  }, [items]);

  // Intersection Observer for triggering active state and Pie Chart animation
  useEffect(() => {
    observers.current.forEach((observer) => observer.disconnect());
    observers.current = [];

    items.forEach((item, i) => {
      const targetElement = document.getElementById(`observe-target-${i}`);
      if (!targetElement) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setItemActive((prev) => ({ ...prev, [i]: entry.isIntersecting }));

            // If item is a chart AND it's entering the viewport
            if (item.type === "chart" && entry.isIntersecting) {
              // Trigger the Pie Chart to animate by changing its key.
              // A small timeout helps ensure React's render cycle processes
              // `itemActive[i] = true` before the key change.
              setTimeout(() => {
                  setPieChartShouldAnimate((prev) => ({ ...prev, [i]: Date.now() }));
              }, 100); // Adjust delay if necessary
            } else if (item.type === "chart" && !entry.isIntersecting) {
              // If item is a chart AND it's leaving the viewport, reset its animation state
              // This allows it to re-animate next time it enters
              setPieChartShouldAnimate((prev) => ({ ...prev, [i]: undefined })); // Reset key
            }
          });
        },
        // Adjust threshold based on how much of the chart needs to be visible
        // for the animation to trigger. 0.5 (50%) is a good starting point.
        { threshold: 0.5 }
      );

      observer.observe(targetElement);
      observers.current.push(observer);
    });

    return () => {
      observers.current.forEach((observer) => observer.disconnect());
    };
  }, [items]); // Dependencies: only items, as pieChartShouldAnimate is updated inside the observer callback

  // Custom Tooltip for Recharts Pie Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      const borderColor = data.color || "#4CAF50";

      return (
        <div
          className="bg-white border-l-4 rounded-md shadow px-1.5 py-1 sm:px-3 sm:py-2 max-w-[90px] sm:max-w-[200px] z-50 text-left"
          style={{ borderColor, pointerEvents: "none" }}
        >
          <p className="text-[6px] sm:text-[10px] font-semibold text-gray-700 mb-0.5 leading-tight">
            {data.year}
          </p>
          <p className="text-[8px] sm:text-base font-bold text-gray-900 leading-tight">
            {data.unit || "$"}{data.value?.toLocaleString()}
          </p>
          <p className="text-[6px] sm:text-xs text-gray-500 mt-0.5 leading-tight">
            {data.label || ""}
          </p>
        </div>
      );
    }
    return null;
  };


  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <section
        ref={containerRef}
        className="w-full max-w-[100vw] relative bg-[#f0fdf4] py-6 overflow-hidden transition-all duration-300 z-10"
        style={{ pointerEvents: "auto" }}
      >
        <div className="px-4 sm:px-6 lg:px-12">
          <h2 className="text-center font-bold text-gray-800 text-3xl md:text-5xl mb-5">
            Activities at a Glance
          </h2>

          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-black"
            onClick={() => scroll("left")}
          >
            &lt;
          </div>
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-black"
            onClick={() => scroll("right")}
          >
            &gt;
          </div>

          <div
            ref={scrollRef}
            tabIndex={0}
            className="cursor-grab active:cursor-grabbing overflow-x-auto no-scrollbar scroll-smooth focus:outline-none"
            style={{ scrollSnapType: "x mandatory", padding: `0 ${carouselPadding}px` }}
          >
            <div className="flex w-max select-none" style={{ gap: `${currentSlideGap}px` }}>
              {items.map((item, i) => {
                const MIN_VISIBLE_YEARS = 7;
                const yearCount = item?.items?.length || 0;
                const shrinkFactor = yearCount > MIN_VISIBLE_YEARS ? MIN_VISIBLE_YEARS / yearCount : 1;

                const yearFontScale = shrinkFactor;
                const yearDotScale = shrinkFactor;
                const yearGapScale = shrinkFactor;

                return (
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
                    <div
                      id={`observe-target-${i}`}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
                    />

                    {item.type === "chart" ? (
                      <div className="relative flex w-full items-center justify-between">
                        <div className="w-1/2 h-full flex items-center justify-center">
                          <div className="w-full" style={{ height: `${180 * slideScaleFactor}px` }}>
                            <ResponsiveContainer width="100%" height="100%">
                              {/* Set key to force remount and re-animation when `pieChartShouldAnimate` changes */}
                              <PieChart key={pieChartShouldAnimate[i] || `pie-chart-${i}`}>
                                {(() => {
                                  const chartData = item.items?.filter((entry) => entry.value > 0) || [];
                                  return (
                                    <Pie
                                      data={chartData}
                                      dataKey="value"
                                      nameKey="year"
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={50 * slideScaleFactor}
                                      outerRadius={90 * slideScaleFactor}
                                      // isAnimationActive only when `itemActive[i]` is true
                                      isAnimationActive={itemActive[i]} // Simplified control
                                      animationDuration={600}
                                      paddingAngle={0}
                                      cornerRadius={0}
                                      startAngle={90}
                                      endAngle={450}
                                    >
                                      {chartData.map((entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={entry.color || "#8884d8"}
                                          stroke="none"
                                        />
                                      ))}
                                    </Pie>
                                  );
                                })()}
                                <Tooltip content={<CustomTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div
                          ref={yearListRef}
                          onWheel={handleYearListWheel}
                          className="absolute top-0 right-4 z-10 overflow-y-auto pr-1 no-scrollbar"
                          style={{
                            maxHeight: `${slideHeight * 0.92}px`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            gap: `${4 * yearGapScale * slideScaleFactor}px`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: `${22 * slideScaleFactor}px`,
                              fontWeight: "600",
                              marginTop: `${-8 * slideScaleFactor}px`,
                              marginBottom: `${2 * slideScaleFactor}px`,
                              color: item.topRightTextColor ?? "#374151",
                            }}
                          >
                            {item.topRightText}
                          </div>

                          {item.items?.map((entry, idx) => (
                            <div
                              key={idx}
                              className="flex items-center"
                              style={{
                                gap: `${8 * yearGapScale * slideScaleFactor}px`,
                                marginBottom: `${4 * yearGapScale * slideScaleFactor}px`,
                              }}
                            >
                              <div
                                style={{
                                  width: `${13 * yearDotScale * slideScaleFactor}px`,
                                  height: `${13 * yearDotScale * slideScaleFactor}px`,
                                  backgroundColor: entry.color || "#2563EB",
                                  borderRadius: "9999px",
                                  flexShrink: 0,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: `${13 * yearFontScale * slideScaleFactor}px`,
                                  fontWeight: 700,
                                  color: item.topRightTextColor ?? "#374151",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {entry.year}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-1/2 h-full flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image}
                            alt=""
                            className="object-cover w-full h-full pointer-events-none"
                            style={{ borderRadius: `${BASE_CORNER_RADIUS * slideScaleFactor}px` }}
                          />
                        </div>

                        <div className="w-1/2 h-full flex flex-col justify-between items-start">
                          <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
                            {item.topRightText && (
                              <span
                                style={{
                                  fontSize: `${16 * slideScaleFactor}px`,
                                  fontWeight: "bold",
                                  color: item.topRightTextColor ?? "#374151",
                                  marginBottom: `${8 * slideScaleFactor}px`,
                                }}
                              >
                                {item.topRightText}
                              </span>
                            )}
                            {item.value && (
                              <AnimatedNumber
                                targetValue={parseFloat(item.value.replace(/[^0-9.-]+/g, ""))}
                                format={item.value}
                                isActive={itemActive[i]}
                                delay={900}
                                duration={2000}
                                style={{
                                  fontSize: `${38 * slideScaleFactor}px`,
                                  fontWeight: "bold",
                                  color: item.valueColor,
                                }}
                              />
                            )}
                            <p
                              style={{
                                fontSize: `${20 * slideScaleFactor}px`,
                                color: item.labelColor,
                                lineHeight: 1.8,
                                whiteSpace: "pre-line",
                              }}
                            >
                              {item.label}
                            </p>
                          </div>
                          {item.showKnowMoreButton && (
                            <div className="w-full flex justify-center mt-4">
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
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="bg-gray-200 rounded mt-6"
            style={{ height: `${currentProgressBarHeight}px` }}
          >
            <div className="bg-green-700 rounded" style={{ width: `${progress}%`, height: "100%" }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivitiesCarousel;