import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const AboutUsSectionmore = ({ carouselData, aboutUsHomepagemore }) => {
  const { image } = carouselData;
  const { title, description } = aboutUsHomepagemore;

  const scrollRefMobile = useRef(null);
  const scrollRefDesktop = useRef(null);

  const mobileAnimationRef = useRef(null);
  const desktopIntervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const [isHoveredDesktop, setIsHoveredDesktop] = useState(false);

  const scrollSpeed = 0.5;

  // ✅ Single scroll function with stable ref
const scrollMobile = () => {
  const el = scrollRefMobile.current;
  if (!el || isMobilePaused) return;

  if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
    el.scrollTop = 0;
  } else {
    el.scrollTop += scrollSpeed;
  }
};


  // 📱 Start/stop mobile scroll
  // ✅ Start continuous loop on mount (once)
useEffect(() => {
  const loop = () => {
    scrollMobile();
    mobileAnimationRef.current = requestAnimationFrame(loop);
  };

  mobileAnimationRef.current = requestAnimationFrame(loop);

  return () => cancelAnimationFrame(mobileAnimationRef.current);
}, []);


  // 📱 Pause on touch or scroll, then resume after delay
 const handleMobileTouchStart = () => {
  setIsMobilePaused(true);
  clearTimeout(resumeTimeoutRef.current);
};

const handleMobileTouchEnd = () => {
  resumeTimeoutRef.current = setTimeout(() => {
    setIsMobilePaused(false);
  }, 3000);
};



  // 🖥️ Desktop scroll via setInterval
  const startDesktopScroll = () => {
    const el = scrollRefDesktop.current;
    if (!el) return;

    desktopIntervalRef.current = setInterval(() => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        el.scrollTop = 0;
      } else {
        el.scrollTop += scrollSpeed;
      }
    }, 30);
  };

  useEffect(() => {
    if (!isHoveredDesktop) {
      startDesktopScroll();
    } else {
      clearInterval(desktopIntervalRef.current);
    }

    return () => clearInterval(desktopIntervalRef.current);
  }, [isHoveredDesktop]);

  return (
    <div className="w-full">
      {/* ✅ Mobile View */}
      <div
        className="relative block md:hidden bg-cover bg-center px-4 py-20"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/70" />
        <div className="relative z-10 text-center max-w-xl mx-auto p-4">
          <h3 className="text-2xl font-bold text-green-800 uppercase mb-2">About Us</h3>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

          <div
  ref={scrollRefMobile}
  onTouchStart={handleMobileTouchStart}
  onTouchEnd={handleMobileTouchEnd}
  onScroll={handleMobileTouchStart}
  style={{
    height: "200px",
    overflowY: "auto",
    paddingRight: "10px",
  }}
  className="text-sm text-gray-700 mb-4 scroll-smooth no-scrollbar"
>
  <div style={{ whiteSpace: "pre-wrap" }}>{description}</div>
</div>

          <div className="text-center">
            <Link to="/about" className="text-green-700 hover:underline font-medium text-sm">
              Read more →
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Desktop View */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-16 py-20">
        <h3 className="text-center text-4xl font-semibold text-black uppercase mb-8 tracking-wide">
          About Us
        </h3>

        <div className="flex items-stretch justify-between gap-8">
          <div className="w-1/2 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </h2>

            <div
              ref={scrollRefDesktop}
              onMouseEnter={() => setIsHoveredDesktop(true)}
              onMouseLeave={() => setIsHoveredDesktop(false)}
              style={{
                height: "250px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
              className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 scroll-smooth no-scrollbar"
            >
              <div style={{ whiteSpace: "pre-wrap" }}>{description}</div>
            </div>

            <div className="text-center">
              <Link to="/about" className="text-green-700 hover:underline font-medium text-sm">
                Read more →
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="w-1/2">
            <div className="h-full min-h-[280px] max-h-[400px] overflow-hidden rounded-xl">
              <img src={image} alt="About us" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSectionmore;
