import React from "react";
import { Link } from "react-router-dom";

const AboutUsSection = ({ carouselData, aboutUsHomepage }) => {
  const { image } = carouselData;
  const { title, description } = aboutUsHomepage;

  return (
    <div className="w-full">
      {/* ✅ Mobile View */}
      <div
        className="relative block md:hidden bg-cover bg-center px-4 py-20"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/70" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-xl mx-auto p-4">
          <h3 className="text-2xl font-bold text-green-800 uppercase mb-2">About Us</h3>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-700 mb-4">
            {description}
            <Link
              to="/about"
              className="text-green-700 hover:underline font-medium text-sm ml-1"
            >
              Read more →
            </Link>
          </p>
        </div>
      </div>

      {/* ✅ Desktop View */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-16 py-20">
        {/* Centered heading */}
        <h3 className="text-center text-4xl font-semibold text-black uppercase mb-8 tracking-wide">
          About Us
        </h3>

        {/* Content with image */}
        <div className="flex items-stretch justify-between gap-8">
          {/* Text content */}
          <div className="w-1/2 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4">
              {description}
              <Link
                to="/about"
                className="text-green-700 hover:underline font-medium text-sm ml-1"
              >
                Read more →
              </Link>
            </p>
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

export default AboutUsSection;
