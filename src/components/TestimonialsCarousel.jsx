import React, { useCallback, useEffect, useRef, useState } from "react";

// --- Helper: A hook to calculate responsive dimensions ---
const useResponsiveDimensions = (originalDimensions) => {
  const [dimensions, setDimensions] = useState(originalDimensions);

  useEffect(() => {
    // A function to calculate the dimensions based on screen size.
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;

      // Fallback to default dimensions if original ones are not provided.
      if (!originalDimensions?.cardWidth) {
        setDimensions({ cardWidth: 360, cardHeight: 520, fontScale: 1 });
        return;
      }

      // For mobile screens (less than 768px wide).
      if (screenWidth < 768) {
        // We want the card to take up 80% of the screen width to show previews.
        const desiredCardWidth = screenWidth * 0.80;
        const scaleFactor = desiredCardWidth / originalDimensions.cardWidth;
        
        // Apply the scale factor to all dimensions.
        setDimensions({
          cardWidth: desiredCardWidth,
          cardHeight: originalDimensions.cardHeight * scaleFactor,
          fontScale: originalDimensions.fontScale * scaleFactor,
        });
      } else {
        // For larger screens, use the original dimensions.
        setDimensions(originalDimensions);
      }
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, [originalDimensions]);

  return dimensions;
};


// --- Helper Component for Logos ---
const CompanyLogo = ({ logo }) => {
  if (!logo) return null;
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
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      // If the video is just starting to play, reset its time to the beginning.
      if (!wasPlayingRef.current) {
        video.currentTime = 0;
      }
      video.play().catch((e) => console.error("Video play failed:", e));
    } else {
      video.pause();
    }
    // Track the current playing state for the next check.
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if(video) {
        video.muted = isMuted;
    }
  }, [isMuted]);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlayToggle();
  };

  const handleMuteToggle = (e) => {
  e.stopPropagation(); // Prevents the click from also triggering the play/pause on the card
  setIsMuted(prev => !prev);
}

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
    fontSize: "0.875rem",
    cursor: "pointer",
  };

   const muteButtonStyle = {
    backgroundColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(4px)",
    borderRadius: '9999px',
    width: `${32 * dimensions.fontScale}px`,
    height: `${32 * dimensions.fontScale}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    opacity: isPlaying ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
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
          {/* --- Mute Button --- */}
          {/* You can position this div to place the button in any corner. */}
          {/* For top-left: use 'top' and 'left' */}
          {/* For top-right: use 'top' and 'right' */}
          {/* For bottom-left: use 'bottom' and 'left' */}
          {/* For bottom-right: use 'bottom' and 'right' */}
          <div
  style={{
    position: 'absolute',
    bottom: `${20 * dimensions.fontScale}px`,
    right: `${20 * dimensions.fontScale}px`,
    zIndex: 10,
  }}
>
  <button onClick={handleMuteToggle} style={muteButtonStyle}>
    {isMuted ? (
      // --- Muted Icon (speaker with X) ---
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
      </svg>
    ) : (
      // --- Unmuted Icon (speaker) ---
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.482 5.482 0 0 1 11.025 8a5.482 5.482 0 0 1-1.61 3.89l.706.706z" />
        <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
      </svg>
    )}
  </button>
</div>

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

          <div style={{ position: "relative", minHeight: `${120 * dimensions.fontScale}px` }}>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
export default function TestimonialsCarousel({ attributes }) {
  const { slides = [], slideGap = 16 } = attributes;
  // Use original dimensions from props for the hook, with a fallback.
  const originalDimensions = attributes.dimensions || { cardWidth: 360, cardHeight: 520, fontScale: 1 };

  // Get responsive dimensions.
  const effectiveDimensions = useResponsiveDimensions(originalDimensions);
  const cardWidth = effectiveDimensions.cardWidth;

  const scrollRef = useRef(null);
  const scrollEndTimeout = useRef(null);
  const [extendedSlides, setExtendedSlides] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [listPadding, setListPadding] = useState(0);
  const [slideVisibilities, setSlideVisibilities] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const calculatePadding = () => {
      const scrollContainer = scrollRef.current;
      if (!scrollContainer) return;
      const containerWidth = scrollContainer.offsetWidth;
      // Calculate padding to center one card.
      const paddingForCentering = (containerWidth - cardWidth) / 2;
      // Limit the padding so adjacent cards remain visible on wider screens.
      const maxPadding = cardWidth / 4;
      const padding = Math.min(paddingForCentering, maxPadding);

      // Ensure a minimum padding.
      setListPadding(Math.max(16, padding));
    };

    calculatePadding();
    // Use a timeout to avoid excessive recalculations on resize.
    const debouncedHandler = () => {
      clearTimeout(scrollEndTimeout.current);
      scrollEndTimeout.current = setTimeout(calculatePadding, 100);
    };
    window.addEventListener('resize', debouncedHandler);
    return () => window.removeEventListener('resize', debouncedHandler);
  }, [cardWidth]); // Recalculate padding when responsive cardWidth changes.
  
  // Extend slides for infinite loop effect
  useEffect(() => {
    if (slides.length > 0) setExtendedSlides([...slides, ...slides, ...slides]);
  }, [slides]);

  // Set initial scroll position to the start of the "middle" set of slides
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (extendedSlides.length > 0 && scrollContainer) {
        const initialScrollLeft = (cardWidth + slideGap) * slides.length;
        scrollContainer.scrollLeft = initialScrollLeft;
    }
  }, [extendedSlides, slides.length, slideGap, cardWidth]);

  // Use IntersectionObserver to fade out non-centered cards
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

  // --- MOUSE WHEEL SCROLL EFFECT ---
useEffect(() => {
  const scrollContainer = scrollRef.current;
  if (!scrollContainer) return;

  const handleWheelScroll = (e) => {
    // Don't interfere with native horizontal scrolling (e.g., trackpads)
    if (e.deltaX !== 0) return;
    
    e.preventDefault();
    
    // Temporarily disable snap for smooth programmatic scroll
    scrollContainer.style.scrollSnapType = 'none';
    scrollContainer.scrollLeft += e.deltaY;

    // Clear any existing timeout
    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current);
    }

    // Set a timeout to re-enable snap scrolling after the user stops scrolling
    wheelTimeout.current = setTimeout(() => {
      scrollContainer.style.scrollSnapType = 'x mandatory';
    }, 150);
  };

  scrollContainer.addEventListener('wheel', handleWheelScroll, { passive: false });
  return () => scrollContainer.removeEventListener('wheel', handleWheelScroll);
}, []); // Runs once on mount

  // Handle the infinite scroll logic by repositioning the scroll silently
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

  // --- KEYBOARD ARROW KEY SCROLL ---
useEffect(() => {
  const handleKeyDown = (e) => {
    if (!scrollRef.current) return;

    // Only respond when the carousel is in view
    const rect = scrollRef.current.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;

    // Left Arrow (←)
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollRef.current.scrollBy({
        left: -(effectiveDimensions.cardWidth + slideGap),
        behavior: "smooth",
      });
    }
    // Right Arrow (→)
    else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollRef.current.scrollBy({
        left: effectiveDimensions.cardWidth + slideGap,
        behavior: "smooth",
      });
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [effectiveDimensions.cardWidth, slideGap]);


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
    opacity: isHovered || isMobile ? 1 : 0,
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
                // Default to visible on first render before observer runs.
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
                            dimensions={effectiveDimensions}
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

