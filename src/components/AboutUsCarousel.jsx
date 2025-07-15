import React, { useEffect, useRef } from "react";
import { aboutUsData } from "../data/Carouseldata";

const AboutUsCarousel = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const accumulatedRef = useRef(0);

  const scrollSpeed = 0.6; // Smooth scroll

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scroll = () => {
      if (!container) return;

      accumulatedRef.current += scrollSpeed;

      if (accumulatedRef.current >= 1) {
        const pixels = Math.floor(accumulatedRef.current);
        container.scrollTop += pixels;
        accumulatedRef.current -= pixels;

        const halfHeight = container.scrollHeight / 2;
        if (container.scrollTop >= halfHeight) {
          container.scrollTop -= halfHeight; // Loop from midpoint
        }
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    const stopScroll = () => cancelAnimationFrame(animationRef.current);
    container.addEventListener("wheel", stopScroll, { passive: true });
    container.addEventListener("touchstart", stopScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationRef.current);
      container.removeEventListener("wheel", stopScroll);
      container.removeEventListener("touchstart", stopScroll);
    };
  }, []);

  const lines = aboutUsData.description.trim().split("\n");
  const duplicatedLines = [...lines, ...lines]; // For infinite scroll

  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-12 flex justify-center py-16 sm:py-20">
      <div className="w-full max-w-[1400px] font-serif leading-7 text-black">
        <h2
          className="font-semibold mt-16 mb-11 text-center"
          style={{
            fontSize: "clamp(20px, 4vw, 32px)",
            lineHeight: "1.3",
          }}
        >
          {aboutUsData.title}
        </h2>

        <div className="relative h-[68vh] mx-auto w-full max-w-[1100px] px-6 sm:px-10 lg:px-20">
          {/* 80% height scroll area inside container */}
          <div className="relative h-[80%]">
            <div
              ref={scrollRef}
              className="h-full overflow-y-scroll no-scrollbar pr-2"
            >
              <div className="max-w-6xl mx-auto text-justify space-y-3">
                {duplicatedLines.map((line, index) => (
                  <p
                    key={index}
                    style={{
                      fontSize: "clamp(14px, 2vw, 17px)",
                      lineHeight: "1.75",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Gradient overlay using background-matching shade */}
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsCarousel;
