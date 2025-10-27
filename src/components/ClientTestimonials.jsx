import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clientTestimonials } from "../data/clientTestimonialsData";
import "../styles/clienttestimonials.css";

// 🌟 Card Component (No changes needed here)
const ClientTestimonialCard = ({
  logoText,
  logoBg,
  quote,
  clientName,
  company,
  isActive,
  onClick,
  isTouched,
  onTouch,
}) => (
  <div
    onClick={onClick}
    onTouchStart={onTouch}
    className={`
      relative group overflow-hidden cursor-pointer
      p-6 md:p-10
      bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900
      border border-purple-800/50
      rounded-xl shadow-2xl transition duration-300
      flex flex-col space-y-6
      min-w-[300px] sm:min-w-[350px] md:min-w-[380px]
      h-[420px]
      ${isActive ? "scale-105 opacity-100 ring-2 ring-fuchsia-500/60"
      : "scale-95 opacity-70 hover:scale-[1.01] hover:opacity-100"}
      ${isTouched ? "touch-active" : ""}
    `}
  >

    {/* 🌈 Animated Overlay */}
    <span
      className="
        absolute top-0 left-0 w-full h-full rounded-xl
        animated-gradient
        bg-gradient-to-br from-blue-400/40 via-pink-500/40 to-purple-600/40
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500 ease-out
        pointer-events-none
        z-0
      "
    ></span>

    {/* ✨ Foreground Content */}
    <div className="relative z-10 flex flex-col space-y-6">
      <div
        className={`w-20 h-20 rounded-full ${logoBg}
          flex items-center justify-center text-white text-[9px] font-semibold text-center leading-tight
          shadow-lg ring-4 ring-purple-700/50`}
      >
        <span className="p-1">{logoText.toUpperCase()}</span>
      </div>

      <p className="text-gray-200 text-base leading-relaxed grow min-h-[120px] lg:min-h-[140px]">
        {quote}
      </p>

      <div>
        <p className="text-fuchsia-400 font-semibold text-lg mb-1">
          {clientName}
        </p>
        <p className="text-fuchsia-400 text-sm font-medium hover:text-fuchsia-300 transition cursor-pointer">
          @{company}
        </p>
      </div>
    </div>
  </div>
);

// 🌌 Stars Background (No changes needed here)
const StarsBackground = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${1 + Math.random() * 2}s`,
  }));

  return (
    <div className="stars-bg">
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
};

// 🌟 Main Component (Focus card logic omitted for brevity, it's unchanged)
const ClientTestimonials = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchedCard, setTouchedCard] = useState(null);

  

  // 🌠 Focus selected card (Unchanged)
  const focusCard = (index) => {
    const container = carouselRef.current;
    if (!container) return;

    // If you wrap each Card in a plain wrapper <div key={t.id}><Card/></div>
    const wrapper = container.children[index];
    const card = wrapper?.firstElementChild || wrapper;
    if (!card) return;

    // 1) Try native center (fast & usually correct)
    try {
      // Use native scrollIntoView center if available
      card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      setCurrentIndex(index);
      return;
    } catch (e) {
      // fallback if browser doesn't support options or fails
    }

    // 2) Precise viewport-based delta method (works even with CSS transforms/scale)
    // This method measures actual visuals on screen and shifts scrollLeft by the delta.
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    // Distance (in px) from container center to card center in viewport coordinates
    const containerCenter = containerRect.left + containerRect.width / 2;
    const cardCenter = cardRect.left + cardRect.width / 2;
    const delta = cardCenter - containerCenter;

    // target scroll = current scroll + delta
    let targetScroll = container.scrollLeft + delta;

    // 3) Correction: account for CSS gap on container (some browsers don't include gap in offsetLeft math)
    // and for left padding like pl-5
    const cs = window.getComputedStyle(container);
    const gapStr = cs.gap || cs.columnGap || cs.getPropertyValue("gap");
    const gap = gapStr ? parseFloat(gapStr) || 0 : 0;
    const paddingLeft = parseFloat(cs.paddingLeft) || 0;

    // If cards are wrapped, offsetLeft of wrapper is more reliable for raw internal position:
    const wrapperOffset = wrapper?.offsetLeft ?? card?.offsetLeft ?? 0;

    // Preferred precise target using offsetLeft method (less susceptible to fractional rounding)
    const containerInnerWidth = container.clientWidth; // excludes scrollbar
    const cardInnerWidth = card.offsetWidth;
    const offsetBasedTarget =
      wrapperOffset - (containerInnerWidth / 2 - cardInnerWidth / 2) - paddingLeft;

    // Choose best target: prefer offset-based if it produces finite number
    if (Number.isFinite(offsetBasedTarget)) targetScroll = offsetBasedTarget;

    // Clamp into valid scroll range
    targetScroll = Math.max(0, Math.min(targetScroll, container.scrollWidth - container.clientWidth));

    // Perform smooth scroll
    container.scrollTo({ left: Math.round(targetScroll), behavior: "smooth" });
    setCurrentIndex(index);

    // 4) Final micro-correction after scroll finishes (handles weird device rounding)
    // Listen once to scroll events and snap to the nearest center if still off by > 2px
    let lastTimeout = null;
    const onScrollEnd = () => {
      if (lastTimeout) clearTimeout(lastTimeout);
      lastTimeout = setTimeout(() => {
        const newContainerRect = container.getBoundingClientRect();
        const newCardRect = card.getBoundingClientRect();
        const newDelta =
          newCardRect.left + newCardRect.width / 2 - (newContainerRect.left + newContainerRect.width / 2);

        if (Math.abs(newDelta) > 2) {
          // small correction
          const correction = container.scrollLeft + newDelta;
          container.scrollTo({ left: Math.round(correction), behavior: "smooth" });
        }
        container.removeEventListener("scroll", onScrollEnd);
      }, 140); // short debounce
    };

    container.addEventListener("scroll", onScrollEnd);
  };

  // Auto-focus, drag, keyboard, and wheel effect hooks (Unchanged)
  useEffect(() => { focusCard(0); }, []);
  // ... (drag logic)
  // ... (keyboard logic)
  // ... (wheel logic)

  // 🖱️ Click & Drag Scroll
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let isDown = false;
    let startX, scrollLeft;

    const startDrag = (e) => {
      isDown = true;
      el.classList.add("dragging");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const stopDrag = () => {
      isDown = false;
      el.classList.remove("dragging");
    };

    const moveDrag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", startDrag);
    el.addEventListener("mouseleave", stopDrag);
    el.addEventListener("mouseup", stopDrag);
    el.addEventListener("mousemove", moveDrag);

    const preventSelection = (e) => {
      if (isDown) e.preventDefault();
    };
    document.addEventListener("selectstart", preventSelection);

    return () => {
      el.removeEventListener("mousedown", startDrag);
      el.removeEventListener("mouseleave", stopDrag);
      el.removeEventListener("mouseup", stopDrag);
      el.removeEventListener("mousemove", moveDrag);
      document.removeEventListener("selectstart", preventSelection);
    };
  }, []);

  // 🎹 Keyboard Navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        const next = Math.min(currentIndex + 1, clientTestimonials.length - 1);
        focusCard(next);
      }
      if (e.key === "ArrowLeft") {
        const prev = Math.max(currentIndex - 1, 0);
        focusCard(prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  // 🖱️ Mouse Wheel Scroll (auto focus)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let lastTime = 0;

    const handleWheel = (e) => {
      const now = Date.now();
      const delta = Math.abs(e.deltaX) + Math.abs(e.deltaY);
      if (delta < 10) return;
      // Removed touchpad check as it's not strictly necessary for the core logic
      lastTime = now;

      e.preventDefault();
      const direction = e.deltaY > 0 || e.deltaX > 0 ? "right" : "left";
      const newIndex =
        direction === "right"
          ? Math.min(currentIndex + 1, clientTestimonials.length - 1)
          : Math.max(currentIndex - 1, 0);
      focusCard(newIndex);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [currentIndex]);


  return (
    <div className="h-screen w-full relative main-bg overflow-hidden flex flex-col">
      <StarsBackground />

      {/* Carousel + Navigation */}
      <div className="flex flex-col h-full justify-center items-center relative z-20 px-4">
        
        {/*
          NEW STRUCTURE:
          - Added relative positioning to this wrapper.
          - Set max-w-7xl mx-auto to center it and contain the arrows.
        */}
        <div className="relative max-w-7xl w-full">
          
          {/* Navigation Arrows: Positioned absolutely over the carousel */}
          <div className="absolute inset-y-0 w-full flex justify-between items-center px-2 z-30 pointer-events-none">
            
            {/* Left Button */}
            <button
              onClick={() => focusCard(Math.max(currentIndex - 1, 0))}
              // Added pointer-events-auto to make the button clickable again
              className="p-3 bg-purple-800/70 rounded-full hover:bg-purple-600/90 transition shadow-lg pointer-events-auto disabled:opacity-30 disabled:hover:bg-purple-800/70"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="text-white w-6 h-6" />
            </button>
            
            {/* Right Button */}
            <button
              onClick={() => focusCard(Math.min(currentIndex + 1, clientTestimonials.length - 1))}
              // Added pointer-events-auto to make the button clickable again
              className="p-3 bg-purple-800/70 rounded-full hover:bg-purple-600/90 transition shadow-lg pointer-events-auto disabled:opacity-30 disabled:hover:bg-purple-800/70"
              disabled={currentIndex === clientTestimonials.length - 1}
            >
              <ChevronRight className="text-white w-6 h-6" />
            </button>
            
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            // Increased horizontal padding (px-5) to give space for the buttons to be visible next to the cards
            // The arrows are now on the sides, so the flow of the container no longer needs space between the arrows and the content.
className="flex gap-6 overflow-x-auto scroll-smooth mx-auto pb-6 no-scrollbar pl-10 sm:pl-6 pt-8"
          >
            {clientTestimonials.map((t, index) => (
  <div key={t.id}>
    <ClientTestimonialCard
      {...t}
      isActive={currentIndex === index}
      isTouched={touchedCard === index}
      onClick={() => focusCard(index)}
onTouch={() => {
  setTouchedCard(index);

  // Re-trigger class by forcing React to re-render on repeated taps
  setTimeout(() => setTouchedCard(null), 1500);

  // ⚡ Force reflow to make sure animation restarts on iOS
  const el = document.activeElement || document.body;
  el.offsetHeight; // force reflow
}}

    />
  </div>
))}

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ClientTestimonials;