import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const AboutUsSectionmore = ({ carouselData, aboutUsHomepagemore }) => {
  const { image } = carouselData;
  const { title, description } = aboutUsHomepagemore;

  const scrollRefDesktop = useRef(null);
  const contentRef = useRef(null);
  const desktopIntervalRef = useRef(null);

  const mobileScrollRef = useRef(null);
  const mobileAnimationRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMobileOverflowing, setIsMobileOverflowing] = useState(false);
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const [isHoveredDesktop, setIsHoveredDesktop] = useState(false);

  const scrollSpeed = 0.5;

  useEffect(() => {
    const el = scrollRefDesktop.current;
    const checkOverflow = () => {
      if (el) setIsOverflowing(el.scrollHeight > el.clientHeight);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [description]);

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
    if (!isHoveredDesktop && isOverflowing) {
      startDesktopScroll();
    } else {
      clearInterval(desktopIntervalRef.current);
    }
    return () => clearInterval(desktopIntervalRef.current);
  }, [isHoveredDesktop, isOverflowing]);

  useEffect(() => {
    const el = mobileScrollRef.current;
    if (el) {
      setIsMobileOverflowing(el.scrollHeight > el.clientHeight);
    }
    const handleResize = () => {
      if (el) {
        setIsMobileOverflowing(el.scrollHeight > el.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [description]);

  const scrollMobile = () => {
    const el = mobileScrollRef.current;
    if (!el || isMobilePaused) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      el.scrollTop = 0;
    } else {
      el.scrollTop += scrollSpeed;
    }
  };

  useEffect(() => {
    const loop = () => {
      scrollMobile();
      mobileAnimationRef.current = requestAnimationFrame(loop);
    };
    mobileAnimationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(mobileAnimationRef.current);
  }, []);

  const handleMobilePause = () => {
    setIsMobilePaused(true);
    clearTimeout(resumeTimeoutRef.current);
  };

  const handleMobileResume = () => {
    resumeTimeoutRef.current = setTimeout(() => {
      setIsMobilePaused(false);
    }, 3000);
  };

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

          <div className="relative">
            <div
              ref={mobileScrollRef}
              onTouchStart={handleMobilePause}
              onTouchEnd={handleMobileResume}
              onScroll={handleMobilePause}
              style={{
                height: "200px",
                overflowY: "auto",
                paddingRight: "10px",
                whiteSpace: "pre-wrap",
              }}
              className="text-sm text-gray-700 scroll-smooth no-scrollbar"
            >
              <span>
                {description}
                {!isMobileOverflowing && (
                  <>
                    {" "}
                    <Link
                      to="/about"
                      className="text-green-700 hover:underline font-medium text-sm"
                    >
                      Read more →
                    </Link>
                  </>
                )}
              </span>
            </div>

            {/* ⬇️ Mobile Fade Effect */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/30 to-transparent pointer-events-none z-10" />
          </div>

          {isMobileOverflowing && (
            <div className="mt-4 text-center">
              <Link to="/about" className="text-green-700 hover:underline font-medium text-sm">
                Read more →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Desktop View */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-16 py-20">
        <h3 className="text-center text-4xl font-semibold text-black uppercase mb-8 tracking-wide">
          About Us
        </h3>

        <div className="flex items-stretch justify-between gap-8 h-full">
          {/* Left Column */}
          <div className="w-1/2 flex flex-col justify-start h-full">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>

            <div className="relative">
              <div
                ref={scrollRefDesktop}
                onMouseEnter={() => setIsHoveredDesktop(true)}
                onMouseLeave={() => setIsHoveredDesktop(false)}
                className="text-gray-700 text-base scroll-smooth no-scrollbar"
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  paddingRight: "10px",
                  fontSize: "18px"
                }}
              >
                <div
                  ref={contentRef}
                  style={{ whiteSpace: "pre-wrap", display: "inline" }}
                >
                  {description}
                  {!isOverflowing && (
                    <>
                      {" "}
                      <Link
                        to="/about"
                        className="text-green-700 hover:underline font-medium text-sm"
                      >
                        Read more →
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* ⬇️ Desktop Fade Effect */}
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/80 to-transparent pointer-events-none z-10" />
            </div>

            {isOverflowing && (
              <div className="mt-4 text-center">
                <Link
                  to="/about"
                  className="text-green-700 hover:underline font-medium text-sm"
                >
                  Read more →
                </Link>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="w-1/2">
            <div className="h-full min-h-[280px] max-h-[400px] overflow-hidden rounded-xl">
              <img
                src={image}
                alt="About us"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSectionmore;
