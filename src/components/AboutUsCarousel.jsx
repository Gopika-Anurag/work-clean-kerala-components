import React, { useEffect, useRef } from "react";
import { aboutUsData } from "../data/Carouseldata";

const AboutUsCarousel = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const accumulatedRef = useRef(0);

  const scrollSpeed = 0.6; // Slow and smooth

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
          container.scrollTop -= halfHeight; // Reset at midpoint
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
  const duplicatedLines = [...lines, ...lines]; // Required for infinite loop illusion

  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-12 flex justify-center py-16 sm:py-20">
      <div className="w-full max-w-[1400px] font-serif leading-7 text-black">
        <h2
          className="font-semibold mb-6 text-center"
          style={{
            fontSize: "clamp(20px, 4vw, 32px)",
            lineHeight: "1.3",
          }}
        >
          {aboutUsData.title}
        </h2>

        <div className="relative h-[400px] overflow-hidden mx-auto w-full max-w-[1100px] px-6 sm:px-10 lg:px-20">
          <div
            ref={scrollRef}
            className="h-full overflow-y-scroll no-scrollbar pr-2"
          >
            <div className="max-w-6xl mx-auto text-justify space-y-4">
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

          <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </div>
  );
};

export default AboutUsCarousel;
