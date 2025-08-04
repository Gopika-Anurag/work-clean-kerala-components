import React, { useRef, useState, useEffect } from "react";
import teamData from "../data/teamData";
import '../styles/teamsection.css'

const TeamSection = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const scrollByAmount = 300;

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      handleScroll(); // initialize state on load
    }
    return () => el && el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-black py-20 px-2 sm:px-4 lg:px-6 text-white relative">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10">OUR TEAM</h1>

      {/* Arrows */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full"
        >
          {/* Left Arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full"
        >
          {/* Right Arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Scrollable team cards */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth"
      >
        {teamData.map((member, index) => (
          <div
            key={index}
            className="min-w-[240px] sm:min-w-[280px] h-[460px] sm:h-[520px] rounded-2xl overflow-hidden relative bg-purple-900 group"
          >
            {/* Image */}
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover absolute top-0 left-0 transform group-hover:scale-110 transition-transform duration-1000 mt-15"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#7b2cbf]/60 via-[#9d4edd]/20 to-transparent"></div>

            {/* Name */}
            <div className="absolute bottom-5 w-full text-center px-2">
              <h3 className="text-white text-base sm:text-xl font-semibold">{member.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
