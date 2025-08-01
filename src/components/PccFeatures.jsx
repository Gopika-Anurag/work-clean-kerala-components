import React, { useRef, useEffect, useState } from "react";
import pccFeatureData from "../data/pccFeatureData";

const PccFeatures = () => {
  const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollSpeed = 0.5;

  // ✅ Scroll check (NO resetting scrollLeft)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const needsScroll = el.scrollWidth > el.clientWidth + 1;
      setIsScrollable(needsScroll);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // ✅ Infinite auto-scroll only if needed
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isScrollable) return;

    let animationFrameId;

    const scroll = () => {
      el.scrollLeft += scrollSpeed;
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isScrollable]);

  // ✅ Only duplicate items when scrolling
  const itemsToShow = isScrollable
    ? [...pccFeatureData, ...pccFeatureData]
    : pccFeatureData;

  return (
    <div className="w-full py-8 bg-white pt-20">
      <div
        ref={scrollRef}
        className={`
          flex transition-all duration-300 px-4 gap-x-4 sm:gap-x-6 md:gap-x-10 whitespace-nowrap
          ${isScrollable ? "justify-start" : "justify-center"}
          pointer-events-none select-none
        `}
        style={{ overflowX: "hidden" }}
      >
        {itemsToShow.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-shrink-0 items-center gap-2 sm:gap-3 min-w-[150px] sm:min-w-[200px]"
          >
            <img
              src={item.icon}
              alt={item.title}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
              loading="lazy"
            />
            <div className="text-left">
              <div className="text-sm sm:text-base md:text-lg font-semibold">
                {item.title}
              </div>
              <div className="text-xs sm:text-sm md:text-base font-semibold">
                {item.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PccFeatures;
