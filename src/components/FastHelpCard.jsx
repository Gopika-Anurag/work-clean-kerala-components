import React from "react";
import fastHelpData from "../data/fastHelpData";

const CheckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#CDF1FF" />
    <path
      d="M16 9L10.5 14.5L8 12"
      stroke="#1DA1F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FastHelpCard = () => {
  const {
    iconUrl,
    heading,
    subheading,
    description,
    items,
    buttonText,
    width,
    height,
  } = fastHelpData;

  return (
    <div className="flex items-center justify-center py-24 px-4 bg-gray-100">
      <div
        className="bg-blue-50 border border-blue-100 shadow-sm rounded-2xl p-6 flex flex-col w-full max-w-[600px] sm:max-w-[500px] md:max-w-[650px]"
  style={{ maxWidth: `${width}px`, height: `${height}px` }}
      >
        {/* Grouped content */}
        <div className="flex flex-col md:ml-6 mt-3">
          {/* Icon + Headings */}
          <div className="flex flex-col items-start text-left mb-4">
            <img
              src={iconUrl}
              alt="Help Icon"
              className="w-14 h-14 mb-3 object-contain sm:w-16 sm:h-16"
            />
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
              {heading}
            </h3>
            <p className="text-gray-700 text-base sm:text-lg font-semibold mt-1">
              {subheading}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
            {description}
          </p>

          {/* Checklist */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 text-sm text-gray-800 ${
                  idx === 2 ? "col-start-2 row-start-1 self-start" : ""
                }`}
              >
                <CheckIcon />
                {item}
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="w-full flex justify-start mt-3">
            <button className="bg-cyan-500 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-cyan-600 transition">
              {buttonText.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastHelpCard;
