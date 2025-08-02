import React from "react";
import ctaData from "../data/ctaData";

const MicroConversionCTA = () => {
  return (
<section className="flex items-center justify-center py-25 px-4 bg-gray-100">
      <div
        className="relative w-full max-w-[1140px] rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `url(${ctaData.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002F4B] via-[#005C97] to-[#0072ff] opacity-40 z-0 rounded-2xl" />

        {/* Content */}
        <div className="relative z-10 px-6 py-10 text-white text-center space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            {ctaData.heading}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-light">
            {ctaData.subheading}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {ctaData.buttons.map((btn, index) => (
              <a
                key={index}
                href={btn.link}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition font-medium text-sm sm:text-base
                  ${
                    btn.variant === "filled"
                      ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                      : "border border-white text-white hover:bg-white hover:text-cyan-700"
                  }`}
              >
                <span>{btn.icon}</span>
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MicroConversionCTA;
