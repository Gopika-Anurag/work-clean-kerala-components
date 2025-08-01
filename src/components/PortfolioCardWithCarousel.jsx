import React, { useState } from "react";

const PortfolioCardWithCarousel = ({ data }) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <section className="w-full py-7 px-4 bg-white">
      {/* MAIN CARD WRAPPER WITH GROUP */}
      <div
        className="group mx-auto w-full max-w-[500px] rounded-2xl p-6 relative overflow-hidden"
        style={{ backgroundColor: data.bgColor, color: data.textColor }}
      >
        {/* Content */}
        <div className="relative z-10 pb-20">
          <h2
            className="text-[32px] font-extrabold leading-tight mb-4"
            style={{ color: data.accentColor }}
          >
            {data.title}
          </h2>
          <p className="text-white text-[16px] leading-[1.8] max-w-[330px] mt-2">
            {data.description}
          </p>

          {/* Button hover effects */}
          <button
            className="px-5 py-1 rounded-lg text-white font-semibold text-[16px] transition duration-300 ease-in-out hover:brightness-90 cursor-pointer mt-6"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              backgroundColor: isButtonHovered ? data.bgColor : data.accentColor,
              color: isButtonHovered ? data.textColor : "white",
              border: `1px solid ${data.accentColor}`,
            }}
          >
            {data.buttonText}
          </button>
        </div>

        {/* Carousel */}
        <div className="absolute bottom-[-40px] right-[-120px] rotate-[-40deg] z-0 cursor-pointer">
          <div className="w-fit h-fit">
            <div className="flex flex-col gap-6">

              {/* Row 1 - animates right on hover of main card */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar px-2 transition-transform duration-1000 group-hover:translate-x-6">
                {data.images.map((item) => (
                  <img
                    key={item.id}
                    src={item.src}
                    alt=""
                    className="w-[140px] h-[80px] rounded-[16px] object-cover shrink-0"
                  />
                ))}
              </div>

              {/* Row 2 - animates left on hover of main card */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar px-2 transition-transform duration-1000 group-hover:-translate-x-6">
                {data.images.map((item) => (
                  <img
                    key={`2-${item.id}`}
                    src={item.src}
                    alt=""
                    className="w-[140px] h-[80px] rounded-[16px] object-cover shrink-0"
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioCardWithCarousel;
