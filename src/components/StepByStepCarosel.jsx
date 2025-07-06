import { useRef, useEffect, useState, useCallback } from "react";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";

/**
 * Step‑by‑Step Carousel – *fully responsive*
 * -------------------------------------------------------
 * • Mouse wheel, arrows, keyboard, drag = smooth scroll
 * • Two‑finger track‑pad scroll = FAST (configurable)
 * • Dynamic **gap** & **font‑scale** based on viewport
 * -------------------------------------------------------
 */
const StepByStepCarousel = ({ steps, carouselSettings, title }) => {
  const carouselRef = useRef(null);

  /* ─── Interaction State ─────────────────────────── */
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  /* ─── Visual State (dimension + gap) ─────────────── */
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dimensions, setDimensions] = useState({
    slideWidth: carouselSettings.slideWidth,
    slideHeight: carouselSettings.slideHeight,
    fontScale: 1,
  });
  const [slideGap, setSlideGap] = useState(16); // px – responsive gap between slides

  /* ────────────────────────────────────────────────── */
  /** Keep hover ref in sync so wheel/keys know state */
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  /* ────────────────────────────────────────────────── */
  /** Responsive width / height **AND** gap calculation */
  useEffect(() => {
    const updateDimensions = () => {
      const fullWidth = carouselSettings.slideWidth;
      const container = carouselRef.current;
      const outerWidth = container?.offsetWidth || window.innerWidth;
      const minSlides = carouselSettings.minimumSlidesToShow;
      const required = fullWidth * minSlides;

      // 🔹 1) slide size / font‑scale
      if (outerWidth < required) {
        const newW = outerWidth / minSlides;
        const scale = newW / fullWidth;
        setDimensions({
          slideWidth: newW,
          slideHeight: (newW * carouselSettings.slideHeight) / fullWidth,
          fontScale: scale,
        });
      } else {
        setDimensions({
          slideWidth: fullWidth,
          slideHeight: carouselSettings.slideHeight,
          fontScale: 1.2,
        });
      }

      // 🔹 2) responsive GAP between slides
      let dynamicGap = 24; // default for mobile (<640)
      if (outerWidth >= 640 && outerWidth < 768) dynamicGap = 32; // sm
      else if (outerWidth >= 768 && outerWidth < 1024) dynamicGap = 40; // md
      else if (outerWidth >= 1024) dynamicGap = 50; // lg+
      setSlideGap(dynamicGap);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [carouselSettings]);

  /* ────────────────────────────────────────────────── */
  /** Mouse‑drag support */
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX);
    setScrollLeftPos(carouselRef.current.scrollLeft);
    document.body.style.userSelect = "none";
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 5) setDragged(true);
    carouselRef.current.scrollLeft = scrollLeftPos - dx * carouselSettings.dragSpeed;
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = "auto";
    setTimeout(() => setDragged(false), 100);
  };

  /* ────────────────────────────────────────────────── */
  /** Wheel / track‑pad scrolling */
  useEffect(() => {
    const slider = carouselRef.current;
    if (!slider) return;

    const onWheel = (e) => {
      if (!isHoveredRef.current) return;
      const delta = e.deltaY || e.deltaX;
      const isTrackpad = Math.abs(delta) < 50;
      const speed = isTrackpad
        ? carouselSettings.touchpadScrollSpeed ?? 6
        : carouselSettings.wheelScrollSpeed ?? 1;
      if (!isTrackpad) e.preventDefault();
      slider.scrollBy({ left: delta * speed, behavior: isTrackpad ? "auto" : "smooth" });
    };

    slider.addEventListener("wheel", onWheel, { passive: false });
    return () => slider.removeEventListener("wheel", onWheel);
  }, [carouselSettings.touchpadScrollSpeed, carouselSettings.wheelScrollSpeed]);

  /* ────────────────────────────────────────────────── */
  /** Arrow‑key navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (!isHoveredRef.current) return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
      const amt = dimensions.slideWidth;
      if (e.key === "ArrowLeft") carouselRef.current.scrollBy({ left: -amt, behavior: "smooth" });
      if (e.key === "ArrowRight") carouselRef.current.scrollBy({ left: amt, behavior: "smooth" });
    };
    document.addEventListener("keydown", onKey, { capture: true });
    return () => document.removeEventListener("keydown", onKey, { capture: true });
  }, [dimensions.slideWidth]);

  /* ────────────────────────────────────────────────── */
  /** Progress‑bar tracking */
  useEffect(() => {
    const slider = carouselRef.current;
    if (!slider) return;
    const update = () => {
      const max = slider.scrollWidth - slider.clientWidth;
      setScrollProgress(max > 0 ? (slider.scrollLeft / max) * 100 : 0);
    };
    slider.addEventListener("scroll", update);
    return () => slider.removeEventListener("scroll", update);
  }, []);

  /* Convenience arrow buttons */
  const scrollLeft = useCallback(() => carouselRef.current.scrollBy({ left: -dimensions.slideWidth, behavior: "smooth" }), [dimensions.slideWidth]);
  const scrollRight = useCallback(() => carouselRef.current.scrollBy({ left: dimensions.slideWidth, behavior: "smooth" }), [dimensions.slideWidth]);

  /* ────────────────────────────────────────────────── */
  /** JSX */
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
      style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}
    >
      {title && (
        <h2 style={{ textAlign: "center", fontSize: `${1.1 * dimensions.fontScale}rem`, margin: 0 }}>{title}</h2>
      )}

      {/* Heading block */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <p style={{ textTransform: "uppercase", fontSize: `${0.8 * dimensions.fontScale}rem`, color: "#2563eb", fontWeight: 600 }}>
          SAUDI PCC ONLINE PROCESS
        </p>
        <h2 style={{ fontSize: `${1.5 * dimensions.fontScale}rem`, fontWeight: "bold", color: "#1e293b", marginTop: 4 }}>
          Step‑by‑Step Process
        </h2>
      </div>

      {/* Arrow buttons */}
      <button onClick={scrollLeft} aria-label="Scroll Left" style={{ position: "absolute", left: 5, top: "60%", fontSize: "3rem", border: 0, background: "transparent", cursor: "pointer", zIndex: 10 }}>‹</button>
      <button onClick={scrollRight} aria-label="Scroll Right" style={{ position: "absolute", right: 0, top: "60%", fontSize: "3rem", border: 0, background: "transparent", cursor: "pointer", zIndex: 10 }}>›</button>

      {/* Slider */}
      <div
        ref={carouselRef}
        className="no-scrollbar"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: `${slideGap}px`, // ⭐ responsive gap
          paddingBottom: "0.5rem",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 auto",
              width: dimensions.slideWidth,
              height: dimensions.slideHeight,
              background: step.slideBackgroundColor,
              padding: `${1 * dimensions.fontScale}rem`,
              borderRadius: "1rem",
              boxShadow: "0 0 8px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: `${0.75 * dimensions.fontScale}rem`,
              justifyContent: "flex-start",
            }}
          >
            {/* Badge */}
            <div
              style={{
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
                gap: `${0.4 * dimensions.fontScale}rem`,
                background: "#eef4ff",
                padding: `${0.35 * dimensions.fontScale}rem ${0.6 * dimensions.fontScale}rem`,
                borderRadius: "1rem",
                fontSize: `${0.75 * dimensions.fontScale}rem`,
                fontWeight: 600,
                color: "#2563eb",
              }}
            >
              <FaFileAlt /> STEP {step.step.toString().padStart(2, "0")}
            </div>

            {/* Image + text row */}
            <div style={{ display: "flex", gap: `${0.75 * dimensions.fontScale}rem`, flexGrow: 1 }}>
              <img
                src={step.image}
                alt={`Step ${step.step}`}
                draggable={false}
                style={{ width: "40%", height: "100%", objectFit: "cover", borderRadius: "0.5rem" }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <h3 style={{ fontSize: `${1.1 * dimensions.fontScale}rem`, fontWeight: "bold", color: step.titleColor, marginBottom: `${0.4 * dimensions.fontScale}rem` }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: `${0.9 * dimensions.fontScale}rem`, color: step.descriptionColor, marginBottom: `${0.4 * dimensions.fontScale}rem` }}>
                  {step.description}
                </p>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {step.checklist.map((it, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: `${0.85 * dimensions.fontScale}rem`,
                        color: step.checklistColor,
                        display: "flex",
                        alignItems: "center",
                        marginBottom: `${0.25 * dimensions.fontScale}rem`,
                      }}
                    >
                      <FaCheckCircle style={{ marginRight: `${0.5 * dimensions.fontScale}rem` }} /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: `${700 * dimensions.fontScale}px`, margin: "1rem auto 0" }}>
        <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 4 }}>
          <div style={{ width: `${scrollProgress}%`, height: "100%", background: "#2563eb", transition: "width 0.3s ease" }} />
        </div>
      </div>
    </div>
  );
};

export default StepByStepCarousel;
