import React, { useEffect, useRef } from "react";
import { aboutUsDatabg } from "../data/Carouseldata";

const AboutUsCarouselBG = () => {
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollSpeed = 1.2;

    const scroll = () => {
      if (!container) return;
      container.scrollTop += scrollSpeed;
      if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
        container.scrollTop = 0;
      }
    };

    intervalRef.current = setInterval(scroll, 16);

    const stopScroll = () => clearInterval(intervalRef.current);

    container.addEventListener("wheel", stopScroll, { passive: true });
    container.addEventListener("touchstart", stopScroll, { passive: true });

    return () => {
      clearInterval(intervalRef.current);
      container.removeEventListener("wheel", stopScroll);
      container.removeEventListener("touchstart", stopScroll);
    };
  }, []);

  const lines = aboutUsDatabg.description.trim().split("\n");

  return (
    <div
      className="w-full bg-cover bg-center bg-no-repeat relative px-4 sm:px-6 lg:px-12 flex justify-center py-16 sm:py-20"
      style={{ backgroundImage: `url(${aboutUsDatabg.image})` }}
    >
      {/* ⬜ White transparent overlay */}
      <div className="absolute inset-0 bg-white/70 z-0" />

      {/* ⬆️ Actual content over the overlay */}
      <div className="w-full max-w-[1400px] font-serif leading-7 text-black relative z-10">
        <h2
          className="font-semibold mb-6 text-center text-green-800 uppercase"
          style={{
            fontSize: "clamp(20px, 4vw, 32px)",
            lineHeight: "1.3",
          }}
        >
          {aboutUsDatabg.title}
        </h2>

        

        <div className="relative h-[400px] overflow-hidden mx-auto w-full max-w-[1100px] px-6 sm:px-10 lg:px-20">
          <div
            ref={scrollRef}
            className="h-full overflow-y-scroll no-scrollbar scroll-smooth pr-2"
          >
            <div className="max-w-6xl mx-auto text-justify space-y-4">
              {[...lines, ...lines].map((line, index) => (
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

          {/* Bottom fade overlay */}
          <div className="absolute bottom-0 left-0 w-full h-26 bg-gradient-to-t from-[#e4f0e4cc]/70 to-transparent pointer-events-none z-20" />

        </div>

        
      </div>
    </div>
  );
};

export default AboutUsCarouselBG;
