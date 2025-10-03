import React, { useEffect, useRef, useState, useCallback } from "react";
import "../styles/VideoCarousel.css";

const VideoCarousel = ({ attributes }) => {
  const {
    slides = [],
    slideGap = 20,
    backgroundColor = "#000",
    title,
    titleColor = "#fff",
    minSlidesToShow,
    progressbarColor,
    progressbar,
  } = attributes;

  const presetSlideWidth = 350;
  const scrollRef = useRef(null);
  const videoRefs = useRef([]);

  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [dimensions, setDimensions] = useState({
    cardWidth: presetSlideWidth,
    cardHeight: presetSlideWidth, // start as square
    fontScale: 1,
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Responsive sizing logic
  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth = scrollRef.current?.offsetWidth || 0;

      // On mobile (<=768px) show 3.3 cards; else 6.5 cards
const slidesToShow = window.innerWidth <= 768 ? 1.5 : 6.5;

      const fullSlideWidth = presetSlideWidth;
      const baseRequiredWidth =
        fullSlideWidth * slidesToShow + (slidesToShow - 1) * slideGap;

      if (containerWidth < baseRequiredWidth) {
        const roughAdjustedWidth = containerWidth / slidesToShow;
        const fontScale = roughAdjustedWidth / presetSlideWidth;

        const scaledGap = slideGap * fontScale;
        const totalGap = (slidesToShow - 1) * scaledGap;
        const adjustedWidth = (containerWidth - totalGap) / slidesToShow;

        // Use a custom aspect ratio to make it taller (e.g. 4:5 ratio)
        const aspectRatio = 1.3; // height = width * 1.3
        const computedHeight = adjustedWidth * aspectRatio;

        setDimensions({
          cardWidth: adjustedWidth,
          cardHeight: computedHeight,
          fontScale,
        });
      } else {
        // fallback to default dimensions
        const aspectRatio = 1.3;
        setDimensions({
          cardWidth: fullSlideWidth,
          cardHeight: fullSlideWidth * aspectRatio,
          fontScale: 1,
        });
      }
    };

    requestAnimationFrame(updateDimensions);
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [presetSlideWidth, slideGap, minSlidesToShow]);

  // Autoplay logic via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoEl = entry.target;
          if (entry.isIntersecting) {
            videoEl.play().catch((err) => {
              // silence autoplay errors
            });
          } else {
            videoEl.pause();
            videoEl.currentTime = 0;
          }
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.7,
      }
    );

    videoRefs.current.forEach((videoEl) => {
      if (videoEl) observer.observe(videoEl);
    });

    return () => {
      videoRefs.current.forEach((videoEl) => {
        if (videoEl) observer.unobserve(videoEl);
      });
    };
  }, [slides, dimensions]);

  // Scroll dragging logic...
  const getScrollDistance = () => dimensions.cardWidth + dimensions.fontScale * slideGap;

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -getScrollDistance(), behavior: "smooth" });
  }, [dimensions, slideGap]);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: getScrollDistance(), behavior: "smooth" });
  }, [dimensions, slideGap]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollPosition(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollPosition - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scrollability indicators
  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const update = () => {
      setCanScrollLeft(sc.scrollLeft > 0);
      setCanScrollRight(sc.scrollLeft < sc.scrollWidth - sc.offsetWidth - 1);
    };
    sc.addEventListener("scroll", update);
    update();
    return () => sc.removeEventListener("scroll", update);
  }, [dimensions, slides]);

  // Progress bar
  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const onScroll = () => {
      const maxScroll = sc.scrollWidth - sc.clientWidth;
      setProgress(maxScroll > 0 ? (sc.scrollLeft / maxScroll) * 100 : 0);
    };
    sc.addEventListener("scroll", onScroll);
    return () => sc.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard arrow navigation
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


  return (
    <div
      className="relative select-none carousel-section"
      style={{
        background: backgroundColor,
        paddingTop: `${60 * dimensions.fontScale}px`,
        paddingBottom: `${40 * dimensions.fontScale}px`,
      }}
    >

      <div className="relative w-full" style={{ overflow: "visible" }}>
        {canScrollLeft && (
          <button className="carousel-button carousel-button-left" onClick={scrollLeft}>
            ‹
          </button>
        )}

        <div
          ref={scrollRef}
          className={`flex overflow-x-auto no-scrollbar ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            gap: `${dimensions.fontScale * slideGap}px`,
            padding: `0 ${20 * dimensions.fontScale}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {slides.map((item, index) => (
            <div
              key={index}
              className="story-item"
              style={{
                width: `${dimensions.cardWidth}px`,
                height: `${dimensions.cardHeight}px`,
                position: "relative",
                flexShrink: 0,
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={item.video}
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <div className="overlay-content">
  {/* --- TOP: Title + Subtitle --- */}
  <div className="overlay-top">
    {item.title && <h3 className="overlay-title">{item.title}</h3>}
    {item.subtitle && <p className="overlay-subtitle">{item.subtitle}</p>}
  </div>

  {/* --- BOTTOM: Button --- */}
  {item.buttonText && item.buttonLink && (
    <div className="overlay-bottom">
      <a href={item.buttonLink} className="overlay-btn">
        {item.buttonText}
      </a>
    </div>
  )}
</div>

            </div>
          ))}
        </div>

        {canScrollRight && (
          <button className="carousel-button carousel-button-right" onClick={scrollRight}>
            ›
          </button>
        )}
      </div>

      {progressbar && (
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              background: progressbarColor,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
