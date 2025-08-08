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

    // New state: track hover + current hover image index per card
    const [hoverStates, setHoverStates] = useState({}); // { [index]: { isHovered: bool, hoverIndex: number } }

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

    // Fill empty slots if needed
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

    // Hover image cycling speed (ms)
    const HOVER_ANIM_SPEED = 400;

    // Effect to handle cycling hover images per card
    useEffect(() => {
        const intervals = [];

        Object.entries(hoverStates).forEach(([index, state]) => {
            const idx = Number(index);
            if (state.isHovered) {
                const hoverImages = slidesToRender[idx]?.hoverImage;
                if (Array.isArray(hoverImages) && hoverImages.length > 1) {
                    // setInterval to cycle hover images for this card
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

        // cleanup intervals on re-run/unmount
        return () => intervals.forEach(clearInterval);
    }, [hoverStates, slidesToRender]);

    // Handlers for hover enter/leave
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

    return (
        <section
            className={`${projectCardConfig.background} ${projectCardConfig.textColor}`}
            style={{
                padding: `${5 * dimensions.fontScale}rem ${1.5 * dimensions.fontScale}rem`,
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

            <div
                ref={scrollRef}
                className="flex overflow-x-auto scrollbar-hide"
                style={{
                    gap: `${slideGap * dimensions.fontScale}px`,
                    paddingLeft: `${1 * dimensions.fontScale}rem`,
                    paddingRight: `${1 * dimensions.fontScale}rem`,
                }}
            >
                {slidesToRender.map((project, index) => {
  const hoverState = hoverStates[index] || { isHovered: false, hoverIndex: 0 };

  // Determine hover images array (normalize to array)
  const hoverImages = Array.isArray(project.hoverImage)
      ? project.hoverImage
      : [project.hoverImage];

  const currentHoverImage = hoverImages[hoverState.hoverIndex] || hoverImages[0];

  return (
      <div
          key={index}
          className="relative rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
          style={{
              width: dimensions.cardWidth,
              height: dimensions.cardHeight,
              backgroundColor: project.color || undefined,
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onFocus={() => handleMouseEnter(index)}
          onBlur={() => handleMouseLeave(index)}
          tabIndex={0} // make div focusable for accessibility
      >
          {/* Base image */}
          <img
              src={project.image}
              alt={project.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hoverState.isHovered ? "opacity-0" : "opacity-100"
                  }`}
          />

          {/* Hover image with glitch animation */}
          <img
              src={currentHoverImage}
              alt={`${project.title} hover`}
              className={`absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ${hoverState.isHovered ? "opacity-90 hover-image-glitch" : ""
                  }`}
          />

          {/* Title */}
          <div
              className={`absolute font-bold leading-tight transition-colors duration-300 text-white group-hover:text-pink-400`}
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
  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full w-10 h-10 flex items-center justify-center bg-pink-500 text-white cursor-pointer"
  tabIndex={0}
  aria-label="Arrow action"
>
  <span
    className="text-2xl font-bold transition-transform duration-300 select-none"
    onMouseEnter={(e) => {
      e.currentTarget.textContent = '←';   // left arrow on hover
      e.currentTarget.parentElement.style.backgroundColor = '#0e0d0dff'; // darker pink on hover
    }}
    onMouseLeave={(e) => {
      e.currentTarget.textContent = '↗';  // back to top-right arrow on leave
      e.currentTarget.parentElement.style.backgroundColor = '#ec4899'; // original pink bg
    }}
  >
    ↗  {/* initial arrow is top-right */}
  </span>
</div>


      </div>
  );
})}
</div>
        </section>
    );
};

export default ProjectsSection;
