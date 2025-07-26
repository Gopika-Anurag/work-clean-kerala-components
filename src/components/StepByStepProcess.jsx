import React, { useCallback, useEffect, useRef, useState } from "react";
import stepByStepProcessDefaults from '../data/stepByStepProcessData'; 
import '../styles/stepByStepProcess.scss'; 

const StepByStepProcess = ({ attributes = {}, style = {} }) => { // Added style prop
    // Destructure props from 'attributes', applying default values from stepByStepProcessDefaults
    // if specific attributes are not provided.
    const {
        slides = stepByStepProcessDefaults.slides,
        slideGap = stepByStepProcessDefaults.slideGap,
        backgroundColor = stepByStepProcessDefaults.backgroundColor,
        title = stepByStepProcessDefaults.title,
        subtitle = stepByStepProcessDefaults.subtitle, // Destructure subtitle
        titleColor = stepByStepProcessDefaults.titleColor,
        subtitleColor = stepByStepProcessDefaults.subtitleColor, // Destructure subtitleColor
        minSlidesToShow = stepByStepProcessDefaults.minSlidesToShow,
        autoScrolling = stepByStepProcessDefaults.autoScrolling, // Corrected typo here
        buttonSize = stepByStepProcessDefaults.buttonSize,
        leftPadding = stepByStepProcessDefaults.leftPadding,
    } = attributes;

    // Preset dimensions for individual slides, used as a base for responsive scaling.
    // Updated to user's specified dimensions: Width 700px, Height 430px
    const presetSlideHeight = 430;
    const presetSlideWidth = 700;
    const presetImageWidth = 275; // New: Specific image width
    const presetContentWidth = presetSlideWidth - presetImageWidth; // New: Specific content width (700 - 275 = 425px)

    // Refs to directly access DOM elements for scrolling and other manipulations.
    const scrollRef = useRef(null);
    const autoScrollInterval = useRef(null);
    const scrollIndicatorRef = useRef(null); // Ref for the scroll indicator

    // State variables to manage user interaction (dragging, hovering) and UI layout.
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [indicatorWidth, setIndicatorWidth] = useState(0); // State for scroll indicator width
    const [indicatorLeft, setIndicatorLeft] = useState(0); // State for scroll indicator position

    // State for dynamically calculated dimensions of cards and font scaling,
    // ensuring responsiveness across different screen sizes.
    const [dimensions, setDimensions] = useState({
        cardWidth: presetSlideWidth,
        cardHeight: presetSlideHeight,
        fontScale: 1,
        imageWidth: presetImageWidth, // New: Store scaled image width
        contentWidth: presetContentWidth, // New: Store scaled content width
    });

    // State to control the visibility of navigation buttons based on scroll position.
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Effect hook to update slide dimensions dynamically on component mount and window resize.
    useEffect(() => {
        const updateDimensions = () => {
            const containerWidth = scrollRef.current?.offsetWidth || 0;
            const fullSlideWidth = presetSlideWidth;

            // Calculate the minimum required width for the carousel to show 'minSlidesToShow'.
            const baseRequiredWidth =
                fullSlideWidth * minSlidesToShow + (minSlidesToShow - 1) * slideGap;

            if (containerWidth < baseRequiredWidth) {
                // If the container is too small, scale down the cards and font.
                const roughAdjustedWidth = containerWidth / minSlidesToShow;
                const fontScale = roughAdjustedWidth / presetSlideWidth;

                const scaledGap = slideGap * fontScale;
                const totalGap = (minSlidesToShow - 1) * scaledGap;
                const adjustedWidth = (containerWidth - totalGap) / minSlidesToShow;

                setDimensions({
                    cardWidth: adjustedWidth,
                    cardHeight: (adjustedWidth * presetSlideHeight) / presetSlideWidth,
                    fontScale,
                    imageWidth: presetImageWidth * fontScale, // Scale image width
                    contentWidth: presetContentWidth * fontScale, // Scale content width
                });
            } else {
                // If the container is large enough, use the preset dimensions.
                setDimensions({
                    cardWidth: fullSlideWidth,
                    cardHeight: presetSlideHeight,
                    fontScale: 1,
                    imageWidth: presetImageWidth,
                    contentWidth: presetContentWidth,
                });
            }
        };

        // Use requestAnimationFrame for initial layout calculation to ensure DOM is ready.
        requestAnimationFrame(updateDimensions);

        // Add event listener for window resize to maintain responsiveness.
        window.addEventListener("resize", updateDimensions);

        // Cleanup function: remove event listener when component unmounts.
        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, [minSlidesToShow, presetSlideWidth, presetSlideHeight, slideGap, presetImageWidth, presetContentWidth]); // Added new preset dependencies

    // Helper function to calculate the distance to scroll for one slide.
    const getScrollDistance = () =>
        dimensions.cardWidth + dimensions.fontScale * slideGap;

    // Callback for scrolling the carousel to the left.
    const scrollLeft = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -getScrollDistance(),
                behavior: "smooth",
            });
        }
    }, [dimensions, slideGap]);

    // Callback for scrolling the carousel to the right.
    const scrollRight = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: getScrollDistance(),
                behavior: "smooth",
            });
        }
    }, [dimensions, slideGap]);

    // Event handler to start dragging the carousel with the mouse.
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollPosition(scrollRef.current.scrollLeft);
    };

    // Effect hook to handle mouse movement during a drag, enabling smooth scrolling.
    useEffect(() => {
        let animationFrameId = null;

        // Function to smoothly animate scrolling to a target position.
        const smoothScroll = (target) => {
            if (!scrollRef.current) return;
            const start = scrollRef.current.scrollLeft;
            const change = target - start;
            let startTime = null;

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / 200, 1); // Animation duration: 200ms
                scrollRef.current.scrollLeft = start + change * easeInOutQuad(progress);
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                } else {
                    setScrollPosition(target); // Update final scroll position after animation.
                }
            };

            animationFrameId = requestAnimationFrame(animate);
        };

        // Easing function for smooth animation (quadrilateral ease-in-out).
        const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

        // Event handler for mouse movement when dragging.
        const handleMouseMove = (e) => {
            if (!isDragging || !scrollRef.current) return;
            e.preventDefault(); // Prevent default browser drag behavior (e.g., text selection).
            const x = e.pageX - scrollRef.current.offsetLeft;

            // Calculate scroll distance based on mouse movement and current card scale.
            const baseCardWidth = presetSlideWidth; // Use the updated presetSlideWidth
            const scale = dimensions.cardWidth / baseCardWidth;
            const scrollDistance = (x - startX) * scale;
            const target = scrollPosition - scrollDistance;
            smoothScroll(target);
        };

        // Add or remove mousemove listener based on the 'isDragging' state.
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
        } else {
            if (animationFrameId) cancelAnimationFrame(animationFrameId); // Cancel any ongoing animation.
        }

        // Cleanup function: remove the mousemove listener.
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isDragging, startX, scrollPosition, dimensions.cardWidth, presetSlideWidth]); // Added presetSlideWidth to dependencies

    // Event handler to stop dragging the carousel.
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Enable Smooth Scrolling with Mouse Wheel & Trackpad
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const handleWheelScroll = (e) => {
            if (!isHovered) return;

            // Dynamically calculate scroll amount
            const scrollDistance = getScrollDistance();
            const scrollAmount = (e.deltaX || e.deltaY) * (scrollDistance / 100);

            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });

            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
            }
        };

        scrollContainer.addEventListener("wheel", handleWheelScroll, {
            passive: false,
        });
        return () => {
            scrollContainer.removeEventListener("wheel", handleWheelScroll);
        };
    }, [isHovered, dimensions, slideGap]);

    // Enable Keyboard Arrow Scrolling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isHovered) return;
            if (e.key === "ArrowLeft") {
                scrollLeft();
            } else if (e.key === "ArrowRight") {
                scrollRight();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isHovered, scrollLeft, scrollRight]);

    // Check Scrollability and update indicator
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        const indicatorContainer = scrollIndicatorRef.current;

        const updateScrollabilityAndIndicator = () => {
            if (!scrollContainer || !indicatorContainer) return;

            // Update scroll button visibility
            setCanScrollLeft(scrollContainer.scrollLeft > 0);
            setCanScrollRight(
                scrollContainer.scrollLeft <
                    scrollContainer.scrollWidth - scrollContainer.offsetWidth - 1,
            );

            // Update scroll indicator
            const scrollPercentage =
                scrollContainer.scrollLeft /
                (scrollContainer.scrollWidth - scrollContainer.offsetWidth);

            const totalIndicatorWidth = indicatorContainer.offsetWidth;
            const numSlides = slides.length;
            const visibleSlidesCount = scrollContainer.offsetWidth / (dimensions.cardWidth + dimensions.fontScale * slideGap);
            const scrollableSlides = numSlides - visibleSlidesCount;

            // Calculate width of each segment of the indicator
            const segmentWidth = totalIndicatorWidth / numSlides; // Each slide gets an equal share of the indicator bar

            // Calculate the width of the active indicator based on visible portion
            // The active indicator should span across the number of visible slides
            const activeIndicatorVisualWidth = totalIndicatorWidth * (scrollContainer.offsetWidth / scrollContainer.scrollWidth);
            setIndicatorWidth(activeIndicatorVisualWidth);

            // Calculate the left position of the active indicator
            const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.offsetWidth;
            const scrollRatio = scrollContainer.scrollLeft / maxScrollLeft;
            const indicatorLeftPosition = scrollRatio * (totalIndicatorWidth - activeIndicatorVisualWidth);
            setIndicatorLeft(indicatorLeftPosition);
        };

        // Add a scroll event listener to the carousel container.
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", updateScrollabilityAndIndicator);
        }

        // Add a resize observer to update indicator when container size changes
        const resizeObserver = new ResizeObserver(() => {
            updateScrollabilityAndIndicator();
        });
        if (scrollContainer) {
            resizeObserver.observe(scrollContainer);
        }
        if (indicatorContainer) {
            resizeObserver.observe(indicatorContainer);
        }


        // Perform an initial check on component mount.
        updateScrollabilityAndIndicator();

        // Cleanup function: remove the scroll event listener and resize observer.
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", updateScrollabilityAndIndicator);
            }
            resizeObserver.disconnect();
        };
    }, [dimensions, slides]); // Dependencies: Recalculate if dimensions or slides data change.

    // Auto-scrolling
    useEffect(() => {
        if (!autoScrolling || slides.length <= 3) return;

        const startAutoScroll = () => {
            if (autoScrollInterval.current) return;
            autoScrollInterval.current = setInterval(() => {
                if (!isHovered && !isDragging) {
                    if (scrollRef.current) {
                        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.offsetWidth - 1) {
                            scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
                        } else {
                            scrollRef.current.scrollBy({
                                left: getScrollDistance(),
                                behavior: "smooth",
                            });
                        }
                    }
                }
            }, 3000);
        };

        const stopAutoScroll = () => {
            if (autoScrollInterval.current) {
                clearInterval(autoScrollInterval.current);
                autoScrollInterval.current = null;
            }
        };

        startAutoScroll();
        return stopAutoScroll;
    }, [
        autoScrolling,
        isHovered,
        isDragging,
        dimensions.cardWidth,
        dimensions.fontScale,
        slideGap,
        slides.length,
    ]);

    // Validate backgroundColor to prevent invalid CSS
    const getValidColor = (color) => {
        if (!color || typeof color !== "string") return "#ffffff";

        const isHex = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color);
        const isRGB = /^rgb(a)?\([\d\s.,%]+\)$/.test(color);
        const isGradient = /gradient\((.|\s)*\)/.test(color);
        const isNamed = /^[a-zA-Z]+$/.test(color);

        if (color === "transparent" || isHex || isRGB || isGradient || isNamed) {
            return color;
        }

        return "#ffffff"; // Fallback
    };

    // Helper function to extract a single color from various CSS color formats and apply transparency.
    // This function's usage for `filterColor` is now removed from the content area,
    // as the content area will have a solid background.
    const getValidColorForFade = (color) => {
        if (!color || typeof color !== "string") return "rgba(255, 255, 255, 0.8)";
        color = color.trim().toLowerCase();

        if (color === "transparent") return "rgba(0, 0, 0, 0)";

        const isNamedColor = (c) => ["red", "blue", "green", "white", "black", "transparent"].includes(c);
        if (isNamedColor(color)) return color;

        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
            const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
            const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        if (color.startsWith("#")) {
            return hexToRgba(color.replace("#", ""), 0.8);
        }

        if (color.startsWith("rgb")) {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                const [, r, g, b, a] = match;
                return `rgba(${r}, ${g}, ${b}, ${a ? parseFloat(a) * 0.8 : 0.8})`;
            }
        }

        if (color.includes("gradient")) {
            const hexMatch = color.match(/(#[0-9a-fA-F]{3,6})/);
            if (hexMatch) return hexToRgba(hexMatch[1].replace("#", ""), 0.7);

            const rgbMatch = color.match(/(rgb\((\d+,\s*\d+,\s*\d+)\))/);
            if (rgbMatch) return `rgba(${rgbMatch[2]}, 0.7)`;

            const rgbaMatch = color.match(/(rgba\((\d+,\s*\d+,\s*\d+,\s*[\d.]+)\))/);
            if (rgbaMatch) {
                const parts = rgbaMatch[2].split(',');
                return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${parseFloat(parts[3]) * 0.7})`;
            }
            return "rgba(255, 255, 255, 0.7)"; // Fallback for unparseable gradients.
        }

        return "rgba(255, 255, 255, 0.7)"; // Final fallback for any other case.
    };

    return (
        // Main container div for the entire component.
        // Accepts external style prop for positioning (e.g., marginLeft)
        <div
            className="relative font-inter rounded-lg overflow-hidden"
            style={{
                ...style, // Spread the style prop here to accept external styles like marginLeft and width
                background: getValidColor(backgroundColor),
                paddingTop: `${30 * dimensions.fontScale}px`,
                paddingBottom: `${50 * dimensions.fontScale}px`,
                paddingLeft: `${leftPadding * dimensions.fontScale}px`, // Apply responsive left padding
                paddingRight: `${20 * dimensions.fontScale}px`, // Apply a smaller, responsive right padding
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                handleMouseUp();
                setIsHovered(false);
            }}
        >
            {/* Subtitle */}
            <p
                className="text-center uppercase tracking-widest font-semibold mb-2"
                style={{
                    fontSize: `${14 * dimensions.fontScale}px`,
                    color: subtitleColor || "#00AEEE",
                }}
            >
                {subtitle}
            </p>
            {/* Component title */}
            <h2
                className="font-medium text-center mb-8"
                style={{
                    fontSize: `${56 * dimensions.fontScale}px`,
                    color: titleColor || "#000",
                }}
            >
                {title}
            </h2>

            {/* Carousel display area, including navigation buttons and scrollable slides */}
            <div
                className="relative w-full"
                style={{
                    minHeight: `${dimensions.cardHeight + 40 * dimensions.fontScale}px`,
                    overflow: "visible",
                }}
            >
                {/* Left navigation button */}
                {canScrollLeft && (
                    <button
                        onClick={scrollLeft}
                        className="text-white carousel-button carousel-button-left hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out focus:outline-none"
                        aria-label="Scroll left"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: "50%",
                            width: `${buttonSize * dimensions.fontScale}px`,
                            height: `${buttonSize * dimensions.fontScale}px`,
                            padding: 0,
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                            cursor: "pointer",
                        }}
                    >
                        {/* SVG for left arrow */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{
                                width: `${0.6 * (buttonSize * dimensions.fontScale)}px`,
                                height: `${0.6 * (buttonSize * dimensions.fontScale)}px`,
                                transform: "translateX(1px) rotate(180deg)",
                                color: "white",
                            }}
                        >
                            <polygon points="4,2 20,12 4,22" />
                        </svg>
                    </button>
                )}

                {/* Scrollable container for the individual slide items */}
                <div style={{ position: "relative" }}>

                <div
                    ref={scrollRef}
                    className={`flex overflow-x-auto no-scrollbar ${
                        isDragging ? "cursor-grabbing" : "cursor-grab"
                    } p-4`}
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: slides.length > minSlidesToShow ? "start" : "center",
                        overflowY: "hidden",
                        gap: `${dimensions.fontScale * slideGap}px`,
                        scrollSnapType: "x mandatory",
                        WebkitOverflowScrolling: "touch",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    
                    {/* Map through the slides array to render each slide item */}
                    {slides.map((item, index) => (
                        <div
                            key={index}
                            className="relative flex flex-shrink-0 overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.01] select-none"
                            style={{
                                width: `${dimensions.cardWidth}px`,
                                minWidth: `${dimensions.cardWidth}px`,
                                height: `${dimensions.cardHeight}px`,
                                scrollSnapAlign: "center",
                                borderRadius: `20px`,
                                marginBottom: `${50 * dimensions.fontScale}px`,
                                marginTop: `${30 * dimensions.fontScale}px`,
                            }}
                        >
                            {/* Left Image Column */}
                            <div
                                className="flex-shrink-0"
                                style={{
                                    width: `${dimensions.imageWidth}px`,
                                    height: '100%',
                                    borderTopLeftRadius: `20px`,
                                    borderBottomLeftRadius: `20px`,
                                    overflow: 'hidden',
                                }}
                            >
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                           <div
                                className="flex flex-col justify-start flex-grow"
                                style={{
                                    width: `${dimensions.contentWidth}px`,
                                    backgroundColor: getValidColor(item.backgroundColor),
                                    color: item.textColor || "#4B5563",
                                    paddingTop: `${Math.max(16, 31.5 * dimensions.fontScale)}px`, // Responsive padding with minimum
                                    paddingBottom: `${30 * dimensions.fontScale}px`,
                                    paddingLeft: `${31.5 * dimensions.fontScale}px`,
                                    paddingRight: `${31.5 * dimensions.fontScale}px`,
                                }}
                            >
                                {/* Icon for the slide, positioned absolutely */}
                                {item.icon && (
                                    <img
                                        src={item.icon}
                                        alt="Step Icon"
                                        className="absolute"
                                        style={{
                                            top: `${60 * dimensions.fontScale}px`, // Adjusted top position
                                            right: `${dimensions.contentWidth - (31.5 + 61.8) * dimensions.fontScale}px`, // Adjusted right to align with content's left padding
                                            width: `${61.8 * dimensions.fontScale}px`, // Set exact width, scaled
                                            height: `${70 * dimensions.fontScale}px`, // Set exact height, scaled
                                            zIndex: 5,
                                            objectFit: 'contain', // Ensure image scales correctly without distortion
                                        }}
                                    />
                                )}

                                {/* Step Number */}
                                <p
                                    className="font-regular text-right w-full" // Align to right
                                    style={{
                                        fontSize: `${18 * dimensions.fontScale}px`, // Original font size for "STEP"
                                        color: "#6A6E8D", // Gray color for step number
                                        marginBottom: `${90 * dimensions.fontScale}px`,
                                    }}
                                >
                                    STEP <span style={{ fontSize: `${28 * dimensions.fontScale}px`, fontWeight:"bold" }}>{item.stepNumber}</span>
                                </p>
                                {/* Content area for title, description, and checklist */}
                                <div className="flex flex-col w-full overflow-visible break-words">
                                    {/* Slide title */}
                                    <h3
                                        className="font-bold text-left mb-2"
                                        style={{
                                            color: item.titleColor || "#000",
                                            fontSize: `${24 * dimensions.fontScale}px`,
                                            lineHeight: 1.2,
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {item.title}
                                    </h3>

                                    {/* Slide description */}
                                    <p
                                        className="text-left mb-4"
                                        style={{
                                            color: item.textColor || "#4B5563",
                                            fontSize: `${18 * dimensions.fontScale}px`,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {item.description}
                                    </p>

                                    {/* Checklist items */}
                                    <ul className="list-none p-0 m-0">
                                        {item.checklistItems && item.checklistItems.map((checkItem, checkIndex) => (
                                            <li
                                                key={checkIndex}
                                                className="flex items-center text-left mb-2"
                                                style={{
                                                    fontSize: `${16 * dimensions.fontScale}px`,
                                                    color: item.textColor || "#4B5563",
                                                }}
                                            >
                                                {/* Checkmark SVG icon */}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    style={{
                                                        color: "#00AEEE",
                                                        width: `${35 * dimensions.fontScale}px`, // Set width to 15px
                                                        height: `${25 * dimensions.fontScale}px`, // Set height to 10.31px
                                                        marginRight: `${8 * dimensions.fontScale}px`, // Kept mr-2 equivalent
                                                    }}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {checkItem}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
                </div>
                {/* Right navigation button */}
                {canScrollRight && (
                    <button
                        onClick={scrollRight}
                        className="text-white carousel-button carousel-button-right hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out focus:outline-none"
                        aria-label="Scroll right"
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: "50%",
                            width: `${buttonSize * dimensions.fontScale}px`,
                            height: `${buttonSize * dimensions.fontScale}px`,
                            padding: 0,
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                            cursor: "pointer",
                        }}
                    >
                        {/* SVG for right arrow */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{
                                width: `${0.6 * (buttonSize * dimensions.fontScale)}px`,
                                height: `${0.6 * (buttonSize * dimensions.fontScale)}px`,
                                transform: "translateX(1px)",
                                color: "white",
                            }}
                        >
                            <polygon points="4,2 20,12 4,22" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Custom Scroll Indicator */}
            <div ref={scrollIndicatorRef} className="relative w-full h-2 bg-gray-300 rounded-full mt-8 mx-auto" style={{ maxWidth: '300px' }}>
                <div
                    className="absolute h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                    style={{
                        width: `${indicatorWidth}px`,
                        left: `${indicatorLeft}px`,
                    }}
                ></div>
            </div>
        </div>
    );
}

export default StepByStepProcess;
