import React, { useEffect, useRef } from "react";
import { aboutUsData } from "../data/Carouseldata";

const AboutUsCarousel = () => {
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollSpeed = 1;

    const scroll = () => {
      if (!container) return;
      container.scrollTop += scrollSpeed;
      if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
        container.scrollTop = 0;
      }
    };

    intervalRef.current = setInterval(scroll, 16);

    const stopScroll = () => {
      clearInterval(intervalRef.current);
    };

    container.addEventListener("wheel", stopScroll, { passive: true });
    container.addEventListener("touchstart", stopScroll, { passive: true });

    return () => {
      clearInterval(intervalRef.current);
      container.removeEventListener("wheel", stopScroll);
      container.removeEventListener("touchstart", stopScroll);
    };
  }, []);

  const lines = aboutUsData.description.trim().split("\n");

  return (
    <div className="w-full bg-white p-0 px-4 sm:px-6 lg:px-12 flex justify-center">


      <div className="w-full max-w-[1400px] font-serif leading-7 text-black">
        <h2
          className="font-semibold mb-6 text-center"
          style={{
            fontSize: "clamp(20px, 4vw, 32px)", // Responsive H2 size
            lineHeight: "1.3",
          }}
        >
          {aboutUsData.title}
        </h2>

        <div className="relative h-[400px] overflow-hidden mx-auto w-full max-w-[1100px] px-6 sm:px-10 lg:px-20">
          {/* Scrolling container */}
          <div
            ref={scrollRef}
            className="h-full overflow-y-scroll no-scrollbar scroll-smooth pr-2"
          >
            <div className="max-w-6xl mx-auto text-justify space-y-4 ">
              {[...lines, ...lines].map((line, index) => (
                <p
                  key={index}
                  style={{
                    fontSize: "clamp(14px, 2vw, 17px)", // Responsive paragraph
                    lineHeight: "1.75",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Bottom Fade Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </div>
  );
};

export default AboutUsCarousel;
