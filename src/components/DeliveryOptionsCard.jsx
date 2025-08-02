import React from "react";

const DeliveryOptionsCard = ({ data }) => {
  return (
    <section className="w-full flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 md:py-16">
      <div
        className="w-full max-w-[512px] h-auto md:h-[451px] rounded-2xl relative overflow-hidden p-6 md:p-8 text-white shadow-lg"
        style={{
          backgroundImage: `url(${data.bgImage || data.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-0 rounded-2xl"
          style={{
            background: `linear-gradient(to bottom right, ${data.gradientFrom}, ${data.gradientTo})`,
            opacity: 0.2,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-center gap-6 items-start">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
            {data.heading}
          </h2>

          <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg">
            {data.options.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-[#00b3ff]">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <button className="mt-4 bg-white/20 border border-white text-white font-semibold px-5 py-2 text-sm sm:text-base rounded-md shadow hover:bg-white/30 transition">
            {data.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeliveryOptionsCard;
