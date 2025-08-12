import React, { useState, useEffect, useRef } from "react";
import projectsData, { projectCardConfig } from "../data/projectsData";
import "../styles/projectssection.css";

const ProjectsSection = () => {
  const scrollRef = useRef(null);

  const presetSlideWidth = projectCardConfig.width;
  const presetSlideHeight = projectCardConfig.height;
  const minSlidesToShow = 3;
  const slideGap = 24;

  const [dimensions, setDimensions] = useState({
    cardWidth: presetSlideWidth,
    cardHeight: presetSlideHeight,
    fontScale: 1,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const [hoverStates, setHoverStates] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth = scrollRef.current?.offsetWidth || 0;
      const fullSlideWidth = presetSlideWidth;

      const baseRequiredWidth =
        fullSlideWidth * minSlidesToShow + (minSlidesToShow - 1) * slideGap;

      if (containerWidth < baseRequiredWidth && containerWidth > 0) {
        const roughAdjustedWidth = containerWidth / minSlidesToShow;
        const fontScale = roughAdjustedWidth / presetSlideWidth;

        const scaledGap = slideGap * fontScale;
        const totalGap = (minSlidesToShow - 1) * scaledGap;
        const adjustedWidth = (containerWidth - totalGap) / minSlidesToShow;

        setDimensions({
          cardWidth: adjustedWidth,
          cardHeight: (adjustedWidth * presetSlideHeight) / presetSlideWidth,
          fontScale,
        });
      } else {
        setDimensions({
          cardWidth: fullSlideWidth,
          cardHeight: presetSlideHeight,
          fontScale: 1,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [presetSlideWidth, presetSlideHeight]);

  const slidesToRender =
    projectsData.length < minSlidesToShow
      ? [
          ...projectsData,
          ...Array(minSlidesToShow - projectsData.length).fill({
            title: "Coming Soon",
            color: "#444",
            image: "https://via.placeholder.com/400x500?text=Coming+Soon",
            hoverImage: "https://via.placeholder.com/400x500?text=Stay+Tuned",
          }),
        ]
      : projectsData;

  const HOVER_ANIM_SPEED = 400;

  useEffect(() => {
    const intervals = [];

    Object.entries(hoverStates).forEach(([index, state]) => {
      const idx = Number(index);
      if (state.isHovered) {
        const hoverImages = slidesToRender[idx]?.hoverImage;
        if (Array.isArray(hoverImages) && hoverImages.length > 1) {
          const intervalId = setInterval(() => {
            setHoverStates((prev) => {
              const currentHoverIndex = prev[idx]?.hoverIndex ?? 0;
              const nextIndex = (currentHoverIndex + 1) % hoverImages.length;
              return {
                ...prev,
                [idx]: { isHovered: true, hoverIndex: nextIndex },
              };
            });
          }, HOVER_ANIM_SPEED);
          intervals.push(intervalId);
        }
      }
    });

    return () => intervals.forEach(clearInterval);
  }, [hoverStates, slidesToRender]);

  const handleMouseEnter = (index) => {
    setHoverStates((prev) => ({
      ...prev,
      [index]: { isHovered: true, hoverIndex: 0 },
    }));
  };

  const handleMouseLeave = (index) => {
    setHoverStates((prev) => ({
      ...prev,
      [index]: { isHovered: false, hoverIndex: 0 },
    }));
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = startX - x;
    scrollRef.current.scrollLeft = scrollLeftPos + walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeaveContainer = () => {
    setIsDragging(false);
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    const scrollDistance = dimensions.cardWidth + slideGap * dimensions.fontScale;
    scrollRef.current.scrollBy({ left: -scrollDistance, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    const scrollDistance = dimensions.cardWidth + slideGap * dimensions.fontScale;
    scrollRef.current.scrollBy({ left: scrollDistance, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    updateScrollButtons();
    scrollRef.current.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      scrollRef.current?.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isHovered) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollRight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered, dimensions, slideGap]);

  const handleWheel = (e) => {
    if (!scrollRef.current) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      return;
    }

    if (
      (scrollRef.current.scrollLeft > 0 && e.deltaY < 0) ||
      (scrollRef.current.scrollLeft + scrollRef.current.clientWidth <
        scrollRef.current.scrollWidth &&
        e.deltaY > 0)
    ) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section
      className={`${projectCardConfig.background} ${projectCardConfig.textColor}`}
      style={{
        padding: `${5 * dimensions.fontScale}rem ${1.5 * dimensions.fontScale}rem`,
        userSelect: isDragging ? "none" : "auto",
        cursor: isDragging ? "grabbing" : "grab",
        position: "relative",
      }}
    >
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: `${2 * dimensions.fontScale}rem` }}
      >
        <h2
          className="font-bold leading-tight ml-2 sm:ml-2 md:ml-4 lg:ml-4"
          style={{ fontSize: `${2.5 * dimensions.fontScale}rem` }}
        >
          LATEST PROJECTS
        </h2>

        <button
          className={`${projectCardConfig.buttonBg} ${projectCardConfig.buttonHoverBg} ${projectCardConfig.buttonTextColor} rounded-md`}
          style={{
            fontSize: `${1.25 * dimensions.fontScale}rem`,
            padding: `${0.5 * dimensions.fontScale}rem ${2 * dimensions.fontScale}rem`,
          }}
        >
          View More
        </button>
      </div>

      {canScrollLeft && (
        <button
          aria-label="Scroll Left"
          onClick={scrollLeft}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 rounded-full p-2 shadow-lg bg-pink-500 text-white hover:bg-pink-600 cursor-pointer transition"
          style={{ fontSize: `${1.5 * dimensions.fontScale}rem` }}
        >
          &#8592;
        </button>
      )}

      {canScrollRight && (
        <button
          aria-label="Scroll Right"
          onClick={scrollRight}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 rounded-full p-2 shadow-lg bg-pink-500 text-white hover:bg-pink-600 cursor-pointer transition"
          style={{ fontSize: `${1.5 * dimensions.fontScale}rem` }}
        >
          &#8594;
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          gap: `${slideGap * dimensions.fontScale}px`,
          paddingLeft: `${1 * dimensions.fontScale}rem`,
          paddingRight: `${1 * dimensions.fontScale}rem`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseLeaveContainer();
          setIsHovered(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onWheel={handleWheel}
      >
        {slidesToRender.map((project, index) => {
          const hoverState = hoverStates[index] || {
            isHovered: false,
            hoverIndex: 0,
          };

          const hoverImages = Array.isArray(project.hoverImage)
            ? project.hoverImage
            : [project.hoverImage];

          const currentHoverImage =
            hoverImages[hoverState.hoverIndex] || hoverImages[0];

          return (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden cursor-pointer group/card flex-shrink-0"
              style={{
                width: dimensions.cardWidth,
                height: dimensions.cardHeight,
                backgroundColor: project.color || undefined,
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onFocus={() => handleMouseEnter(index)}
              onBlur={() => handleMouseLeave(index)}
              tabIndex={0}
            >
              <img
                src={project.image}
                alt={project.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  hoverState.isHovered ? "opacity-0" : "opacity-100"
                }`}
              />

              <img
                src={currentHoverImage}
                alt={`${project.title} hover`}
                className={`absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ${
                  hoverState.isHovered ? "opacity-90 hover-image-glitch" : ""
                }`}
              />

              <div
                className={`absolute font-bold leading-tight transition-colors duration-300 text-white group-hover/card:text-pink-400`}
                style={{
                  bottom: `${1 * dimensions.fontScale}rem`,
                  left: `${1 * dimensions.fontScale}rem`,
                  fontSize: `${1.9 * dimensions.fontScale}rem`,
                  maxWidth: "85%",
                  wordWrap: "break-word",
                }}
              >
                {project.title}
              </div>

              {/* Arrow inside pink circle */}
              <div
  className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 
             rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
             flex items-center justify-center bg-pink-500 text-white cursor-pointer
             group/arrow"
  tabIndex={0}
  aria-label="Arrow action"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transform rotate-310 transition-transform duration-300 group-hover/arrow:rotate-[130deg]"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
</div>
</div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection;
