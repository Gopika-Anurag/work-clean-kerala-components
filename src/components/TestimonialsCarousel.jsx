import React, { useCallback, useEffect, useRef, useState } from "react";

// --- Helper Component for Logos ---
const CompanyLogo = ({ logo }) => {
  if (logo.type === "text") return <span style={logo.style}>{logo.content}</span>;
  if (logo.type === "svg") return logo.content;
  return null;
};

// --- Individual Slide ---
const Slide = ({
  item,
  dimensions,
  isPlaying,
  onPlayToggle,
  isCurrentlyHovered,
  isAnotherCardHovered,
  onHoverStart,
  onHoverEnd
}) => {
  const videoRef = useRef(null);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      if (!wasPlayingRef.current) {
        video.currentTime = 0;
        video.muted = false;
      }
      video.play().catch((e) => console.error("Video play failed:", e));
    } else {
      video.pause();
    }
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlayToggle();
  };

  const isButtonVisible = isCurrentlyHovered || (isPlaying && !isAnotherCardHovered);

  const playPauseButtonContainerStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.3s ease-in-out",
    opacity: isButtonVisible ? 1 : 0
  };

  const playPauseButtonStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(4px)",
    color: "black",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.5rem 1.25rem 0.5rem 1rem",
    fontWeight: 600,
    fontSize: "0.875rem"
  };

  return (
    <div
      style={{ position: "relative", cursor: "pointer" }}
      onClick={handlePlayClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <div
        style={{
          width: `${dimensions.cardWidth}px`,
          height: `${dimensions.cardHeight}px`,
          borderRadius: `${16 * dimensions.fontScale}px`,
          transform: isCurrentlyHovered ? "scale(1.03)" : "scale(1)",
          position: "relative",
          flexShrink: 0,
          overflow: "hidden",
          transition: "transform 0.3s ease-in-out",
          backgroundColor: "#ffffff",
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)"
        }}
      >
        <video
          ref={videoRef}
          src={item.videoUrl}
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            borderRadius: `${16 * dimensions.fontScale}px`
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)"
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: `${24 * dimensions.fontScale}px`,
            color: "white"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <span
              style={{
                fontSize: `${12 * dimensions.fontScale}px`,
                fontWeight: "bold",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
                padding: `${4 * dimensions.fontScale}px ${12 * dimensions.fontScale}px`,
                borderRadius: "9999px"
              }}
            >
              {item.tag}
            </span>
            <div style={{ color: "white" }}>
              <CompanyLogo logo={item.logo} />
            </div>
          </div>

          <div style={{ position: "relative", minHeight: "120px" }}>
            <div
              style={{
                opacity: isButtonVisible ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
                position: "absolute",
                bottom: 0,
                width: "100%"
              }}
            >
              <p
                style={{
                  fontSize: `${28 * dimensions.fontScale}px`,
                  fontWeight: 500,
                  lineHeight: 1.2,
                  marginBottom: `${16 * dimensions.fontScale}px`
                }}
              >
                {item.quote}
              </p>
              <div>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: `${16 * dimensions.fontScale}px`
                  }}
                >
                  {item.authorName}
                </p>
                <p style={{ fontSize: `${14 * dimensions.fontScale}px`, color: "#d1d5db" }}>
                  {item.authorTitle}
                </p>
              </div>
            </div>

            <div style={playPauseButtonContainerStyle}>
              <div style={playPauseButtonStyle}>
                {isPlaying ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                    <span>Play story</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Testimonials Carousel Component ---
export default function TestimonialsCarousel({ attributes, useEditor }) {
  const { slides = [], slideGap, dimensions } = attributes;
  const scrollRef = useRef(null);
  const scrollEndTimeout = useRef(null);
  const [extendedSlides, setExtendedSlides] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [listPadding, setListPadding] = useState(0);
  const [slideVisibilities, setSlideVisibilities] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const cardWidth = dimensions.cardWidth;

  useEffect(() => {
    const calculatePadding = () => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;
        const containerWidth = scrollContainer.offsetWidth;
        const contentWidth = (3 * cardWidth) + (2 * slideGap);
        const padding = (containerWidth - contentWidth) / 2;
        setListPadding(Math.max(0, padding));
    };

    const debouncedHandler = () => {
        clearTimeout(scrollEndTimeout.current);
        scrollEndTimeout.current = setTimeout(calculatePadding, 100);
    };
    calculatePadding();
    window.addEventListener('resize', debouncedHandler);
    return () => window.removeEventListener('resize', debouncedHandler);
  }, [cardWidth, slideGap]);
  
  useEffect(() => {
    if (slides.length > 0) setExtendedSlides([...slides, ...slides, ...slides]);
  }, [slides]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (extendedSlides.length > 0 && scrollContainer) {
        const initialScrollLeft = (cardWidth + slideGap) * slides.length;
        scrollContainer.scrollLeft = initialScrollLeft;
    }
  }, [extendedSlides, slides.length, slideGap, cardWidth]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || extendedSlides.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            const newVisibilities = {};
            entries.forEach((entry) => {
                const id = entry.target.dataset.id;
                if (id) {
                   newVisibilities[id] = entry.intersectionRatio >= 0.95;
                }
            });
            setSlideVisibilities(prev => ({ ...prev, ...newVisibilities }));
        },
        { root: scrollContainer, threshold: [0.95] }
    );

    const listItems = scrollContainer.querySelectorAll('li');
    listItems.forEach((item) => {
        if (item.dataset.id) observer.observe(item);
    });

    return () => listItems.forEach((item) => {
        if (item.dataset.id) observer.unobserve(item);
    });
  }, [extendedSlides]);

  const handleInfiniteScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const totalWidth = (cardWidth + slideGap) * slides.length;

    const nearEnd = scrollContainer.scrollLeft >= totalWidth * 2 - cardWidth;
    const nearStart = scrollContainer.scrollLeft <= cardWidth;

    if (nearEnd) {
      scrollContainer.style.scrollSnapType = "none";
      scrollContainer.scrollLeft = scrollContainer.scrollLeft - totalWidth;
      setTimeout(() => { scrollContainer.style.scrollSnapType = "x mandatory"; }, 50);
    } else if (nearStart) {
      scrollContainer.style.scrollSnapType = "none";
      scrollContainer.scrollLeft = scrollContainer.scrollLeft + totalWidth;
      setTimeout(() => { scrollContainer.style.scrollSnapType = "x mandatory"; }, 50);
    }
  }, [cardWidth, slideGap, slides.length]);

  const handleScroll = useCallback(() => {
    if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current);
    scrollEndTimeout.current = setTimeout(handleInfiniteScroll, 150);
  }, [handleInfiniteScroll]);

  const scrollBy = (direction) => {
    setCurrentlyPlaying(null);
    if (!scrollRef.current) return;
    const scrollAmount = cardWidth + slideGap;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handlePlayToggle = (slideId) => {
    setCurrentlyPlaying((prev) => (prev === slideId ? null : slideId));
  };

  const navButtonStyle = {
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
    position: 'absolute',
    top: '50%',
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: '9999px',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div
      style={{width: '100%', position: 'relative'}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <button 
            onClick={() => scrollBy('left')} 
            aria-label="Previous Slide" 
            style={{ ...navButtonStyle, left: `${listPadding}px`, transform: 'translate(-50%, -50%)' }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <ul
            ref={scrollRef}
            style={{
            display: "flex",
            gap: `${slideGap}px`,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: `${listPadding}px`,
            paddingRight: `${listPadding}px`,
            scrollbarWidth: "none"
            }}
            onScroll={handleScroll}
        >
            <style>{`ul::-webkit-scrollbar { display: none; }`}</style>
            {extendedSlides.map((slide, index) => {
                const uniqueId = `${slide.id}-${index}`;
                const isVisible = slideVisibilities[uniqueId] === undefined ? true : slideVisibilities[uniqueId];
                return (
                    <li 
                        key={uniqueId}
                        data-id={uniqueId}
                        style={{
                            listStyle: 'none',
                            padding: '40px 0',
                            scrollSnapAlign: 'center',
                            opacity: isVisible ? 1: 0.4,
                            transition: 'opacity 0.4s ease-in-out'
                        }}
                    >
                        <Slide
                            item={slide}
                            dimensions={dimensions}
                            isPlaying={currentlyPlaying === slide.id}
                            onPlayToggle={() => handlePlayToggle(slide.id)}
                            isCurrentlyHovered={hoveredId === slide.id}
                            isAnotherCardHovered={hoveredId && hoveredId !== slide.id}
                            onHoverStart={() => setHoveredId(slide.id)}
                            onHoverEnd={() => setHoveredId(null)}
                        />
                    </li>
                );
            })}
        </ul>
        <button 
            onClick={() => scrollBy('right')} 
            aria-label="Next Slide" 
            style={{ ...navButtonStyle, right: `${listPadding}px`, transform: 'translate(50%, -50%)' }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
    </div>
  );
}

