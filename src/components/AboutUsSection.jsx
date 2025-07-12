import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const AboutUsSection = ({ carouselData, aboutUsHomepage }) => {
  const { image } = carouselData;
  const { mainTitle, title, description } = aboutUsHomepage;

  const scrollRefDesktop = useRef(null);
  const mobileScrollRef = useRef(null);

  const [isHoveredDesktop, setIsHoveredDesktop] = useState(false);
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMobileOverflowing, setIsMobileOverflowing] = useState(false);
  const resumeTimeoutRef = useRef(null);

  const scrollSpeed = 0.8;

  // ─── Overflow Check ───
  useEffect(() => {
    const checkOverflow = () => {
      const desktop = scrollRefDesktop.current;
      const mobile = mobileScrollRef.current;

      if (desktop) setIsOverflowing(desktop.scrollHeight > desktop.clientHeight);
      if (mobile) setIsMobileOverflowing(mobile.scrollHeight > mobile.clientHeight);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [description]);

  // ─── Desktop Auto-Scroll ───
  useEffect(() => {
    const el = scrollRefDesktop.current;
    if (!el || !isOverflowing) return;

    let frame;
    let accumulated = 0;

    const step = () => {
      if (!isHoveredDesktop) {
        accumulated += scrollSpeed;
        if (accumulated >= 1) {
          el.scrollTop += Math.floor(accumulated);
          accumulated = 0;
          if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
            el.scrollTop = 0;
          }
        }
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isOverflowing, isHoveredDesktop]);

  // ─── Hover Pause for Desktop ───
  useEffect(() => {
    const el = scrollRefDesktop.current;
    if (!el) return;
    const enter = () => setIsHoveredDesktop(true);
    const leave = () => setIsHoveredDesktop(false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  // ─── Mobile Auto-Scroll ───
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el || !isMobileOverflowing) return;

    let frame;
    let accumulated = 0;

    const step = () => {
      if (!isMobilePaused) {
        accumulated += scrollSpeed;
        if (accumulated >= 1) {
          el.scrollTop += Math.floor(accumulated);
          accumulated = 0;
          if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
            el.scrollTop = 0;
          }
        }
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isMobilePaused, isMobileOverflowing]);

  const pauseMobileScroll = () => {
    setIsMobilePaused(true);
    clearTimeout(resumeTimeoutRef.current);
  };
  const debounceMobileResume = () => {
    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsMobilePaused(false);
    }, 3000);
  };

  return (
    <div className="w-full">
      {/* ─── Mobile ─── */}
      <div
        className="relative block md:hidden bg-cover bg-center px-4 py-5"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative z-10 text-center max-w-xl mx-auto p-4">
          <h3 className="text-2xl font-bold text-green-800 uppercase mb-4">{mainTitle}</h3>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>

          <div className="relative">
            <div
              ref={mobileScrollRef}
              onTouchStart={pauseMobileScroll}
              onTouchMove={debounceMobileResume}
              onScroll={debounceMobileResume}
              className="text-sm text-gray-700 no-scrollbar overflow-y-auto"
              style={{
                height: "200px",
                paddingRight: "10px",
                whiteSpace: "pre-wrap",
              }}
            >
              {description}
              {!isMobileOverflowing && (
                <Link to="/about" className="text-green-700 hover:underline font-medium text-sm ml-1">
                  Read more →
                </Link>
              )}
            </div>

            {isMobileOverflowing && (
              <div className="absolute bottom-0 left-0 w-full text-center bg-gradient-to-t from-white/30 to-transparent pt-4 pb-2 z-10">
                <Link to="/about" className="text-green-700 hover:underline font-medium text-sm">
                  Read more →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Desktop ─── */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-16 py-12">
        <h3 className="text-center text-4xl font-semibold text-black uppercase mb-8">{mainTitle}</h3>
        <div className="flex items-stretch justify-between gap-8">
          <div className="w-1/2 flex flex-col justify-start h-full">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">{title}</h2>

            <div className="relative" style={{ maxHeight: "400px" }}>
              <div
                ref={scrollRefDesktop}
                className="text-gray-700 text-base no-scrollbar overflow-y-auto"
                style={{
                  height: "300px",
                  paddingRight: "10px",
                  fontSize: "18px",
                }}
              >
                {description}
                {!isOverflowing && (
                  <Link to="/about" className="text-green-700 hover:underline font-medium text-sm ml-1">
                    Read more →
                  </Link>
                )}
              </div>

              {isOverflowing && (
                <div className="absolute bottom-0 left-0 w-full h-20 text-center bg-gradient-to-t from-white/80 to-transparent pt-10 pb-2 z-10">
                  <Link to="/about" className="text-green-700 hover:underline font-medium text-sm">
                    Read more →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="w-1/2">
            <div className="rounded-xl overflow-hidden h-full max-h-[400px]">
              <img src={image} alt="About us" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
