import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const AboutUsSectionmore = ({ carouselData, aboutUsHomepagemore }) => {
  const { image } = carouselData;
  const { title, description } = aboutUsHomepagemore;

  const scrollRefDesktop = useRef(null);
  const scrollRefMobile = useRef(null);

  const [isHoveredDesktop, setIsHoveredDesktop] = useState(false);
  const [isHoveredMobile, setIsHoveredMobile] = useState(false);

  const intervalDesktop = useRef(null);
  const intervalMobile = useRef(null);

  const scrollSpeed = 1;
  const delay = 50;

  const setupAutoScroll = (ref, isPaused, intervalRef) => {
    const container = ref.current;
    if (!container) return;

    const startScrolling = () => {
      intervalRef.current = setInterval(() => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0;
        } else {
          container.scrollTop += scrollSpeed;
        }
      }, delay);
    };

    if (!isPaused) {
      startScrolling();
    }

    return () => clearInterval(intervalRef.current);
  };

  // 🖥️ Desktop scroll
  useEffect(() => {
    const cleanup = setupAutoScroll(scrollRefDesktop, isHoveredDesktop, intervalDesktop);
    return cleanup;
  }, [isHoveredDesktop]);

  // 📱 Mobile scroll
  useEffect(() => {
    const cleanup = setupAutoScroll(scrollRefMobile, isHoveredMobile, intervalMobile);
    return cleanup;
  }, [isHoveredMobile]);

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

          {/* ✅ Scrollable mobile text */}
          <div
            ref={scrollRefMobile}
            onTouchStart={() => setIsHoveredMobile(true)}
            onTouchEnd={() => setIsHoveredMobile(false)}
            style={{
              height: "180px",
              overflow: "hidden",
              position: "relative",
              paddingRight: "10px",
            }}
            className="text-sm text-gray-700 mb-2"
          >
            <div style={{ whiteSpace: "pre-wrap" }}>{description}</div>
          </div>

          {/* ✅ Read more */}
          <div className="text-center">
            <Link
              to="/about"
              className="text-green-700 hover:underline font-medium text-sm"
            >
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
          {/* Text Content */}
          <div className="w-1/2 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </h2>

            {/* ✅ Scrollable desktop text */}
            <div
              ref={scrollRefDesktop}
              onMouseEnter={() => setIsHoveredDesktop(true)}
              onMouseLeave={() => setIsHoveredDesktop(false)}
              style={{
                height: "250px",
                overflow: "hidden",
                position: "relative",
                paddingRight: "10px",
              }}
              className="text-sm sm:text-base md:text-lg text-gray-700 mb-2"
            >
              <div style={{ whiteSpace: "pre-wrap" }}>{description}</div>
            </div>

            {/* ✅ Read more */}
            <div className="text-center">
              <Link
                to="/about"
                className="text-green-700 hover:underline font-medium text-sm"
              >
                Read more →
              </Link>
            </div>
          </div>

          {/* Image */}
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
