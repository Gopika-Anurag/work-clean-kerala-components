import React, { useCallback, useEffect, useRef, useState } from "react";
import useCasesByCountrySettings from '../data/useCasesByCountrySettings';
import '../styles/countryslidecard.css'

const CountrySlideCard = ({ attributes = {} }) => {
    const {
        slides = useCasesByCountrySettings.slides,
        slideGap = useCasesByCountrySettings.slideGap,
        backgroundColor = useCasesByCountrySettings.backgroundColor,
        title = useCasesByCountrySettings.title,
        subtitle = useCasesByCountrySettings.subtitle,
        titleColor = useCasesByCountrySettings.titleColor,
        subtitleColor = useCasesByCountrySettings.subtitleColor,
        minSlidesToShow = useCasesByCountrySettings.minSlidesToShow,
        autoScrolling = useCasesByCountrySettings.autoScrolling,
        buttonSize = useCasesByCountrySettings.buttonSize,
        progressbarColor = useCasesByCountrySettings.progressbarColor,
        header = useCasesByCountrySettings.header,
        paragraph = useCasesByCountrySettings.paragraph,
    } = attributes;

    const presetSlideHeight = 200;
    const presetSlideWidth = 203;

    const [progress, setProgress] = useState(0);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const autoScrollInterval = useRef(null);

    const [dimensions, setDimensions] = useState({
        cardWidth: presetSlideWidth,
        cardHeight: presetSlideHeight,
        fontScale: 1,
    });

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [touchedCardIndex, setTouchedCardIndex] = useState(null);
    const [isTooltipClicked, setIsTooltipClicked] = useState(false);

    // Update slide dimensions dynamically
    useEffect(() => {
        const updateDimensions = () => {
            const containerWidth = scrollRef.current?.offsetWidth || 0;
            const fullSlideWidth = presetSlideWidth;

            const baseRequiredWidth =
                fullSlideWidth * minSlidesToShow + (minSlidesToShow - 1) * slideGap;

            if (containerWidth < baseRequiredWidth) {
                // Estimate unscaled card width
                const roughAdjustedWidth = containerWidth / minSlidesToShow;
                const fontScale = roughAdjustedWidth / presetSlideWidth;

                // Scale the gap now
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

        requestAnimationFrame(updateDimensions);
        window.addEventListener("resize", updateDimensions);

        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, [minSlidesToShow, presetSlideWidth, presetSlideHeight, slideGap]);

    const getScrollDistance = () =>
        dimensions.cardWidth + dimensions.fontScale * slideGap;

    // Scroll Left
    const scrollLeft = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -getScrollDistance(),
                behavior: "smooth",
            });
        }
    }, [dimensions, slideGap]);

    // Scroll Right
    const scrollRight = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: getScrollDistance(),
                behavior: "smooth",
            });
        }
    }, [dimensions, slideGap]);

    // Start Dragging
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollPosition(scrollRef.current.scrollLeft);
    };

    // Drag Move with smooth animation
    useEffect(() => {
        let animationFrameId = null;

        const smoothScroll = (target) => {
            if (!scrollRef.current) return;
            const start = scrollRef.current.scrollLeft;
            const change = target - start;
            let startTime = null;

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / 200, 1);
                scrollRef.current.scrollLeft = start + change * easeInOutQuad(progress);
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                } else {
                    setScrollPosition(target);
                }
            };

            animationFrameId = requestAnimationFrame(animate);
        };

        const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

        const handleMouseMove = (e) => {
            if (!isDragging || !scrollRef.current) return;
            e.preventDefault();
            const x = e.pageX - scrollRef.current.offsetLeft;

            // Dynamically scaled drag scroll
            const baseCardWidth = 400; // match your base slide width
            const scale = dimensions.cardWidth / baseCardWidth;
            const scrollDistance = (x - startX) * scale;
            const target = scrollPosition - scrollDistance;
            smoothScroll(target);
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
        } else {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isDragging, startX, scrollPosition, dimensions.cardWidth]);

    // Stop Dragging
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Enable Smooth Scrolling with Mouse Wheel & Trackpad
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const handleWheelScroll = (e) => {
            if (!isHovered) return;

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

    // Check Scrollability
    useEffect(() => {
        const scrollContainer = scrollRef.current;

        const updateScrollability = () => {
            if (!scrollContainer) return;

            setCanScrollLeft(scrollContainer.scrollLeft > 0);

            setCanScrollRight(
                scrollContainer.scrollLeft <
                scrollContainer.scrollWidth - scrollContainer.offsetWidth - 1,
            );
        };

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", updateScrollability);
        }

        updateScrollability();

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", updateScrollability);
            }
        };
    }, [dimensions, slides]);

    // Auto-scrolling
    useEffect(() => {
        if (!autoScrolling || slides.length <= 3) return;

        const startAutoScroll = () => {
            if (autoScrollInterval.current) return;
            autoScrollInterval.current = setInterval(() => {
                if (!isHovered && !isDragging) {
                    if (scrollRef.current) {
                        scrollRef.current.scrollBy({
                            left: getScrollDistance(),
                            behavior: "smooth",
                        });
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

        const isHex = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color); // #fff or #ffffff
        const isRGB = /^rgb(a)?\([\d\s.,%]+\)$/.test(color); // rgb() or rgba()
        const isGradient = /gradient\((.|\s)*\)/.test(color); // linear or radial
        const isNamed = /^[a-zA-Z]+$/.test(color); // red, blue, etc.

        if (color === "transparent" || isHex || isRGB || isGradient || isNamed) {
            return color;
        }

        return "#ffffff"; // Fallback
    };

    // Get single color for fade effect (solid or first gradient stop)
    const getValidColorForFade = (color) => {
        if (!color || typeof color !== "string") return "rgba(255, 255, 255, 0.8)";
        const isHex = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color);
        const isRGB = /^rgb(a)?\([\d\s.,%]+\)$/.test(color);
        const isGradient = /gradient\((.|\s)*\)/.test(color);
        const isNamed = /^[a-zA-Z]+$/.test(color);
        if (color === "transparent") return "rgba(0, 0, 0, 0)";
        if (isNamed) return color;
        if (isRGB) {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                const [, r, g, b] = match;
                return `rgba(${r}, ${g}, ${b}, 0.8)`;
            }
        }
        if (isHex) {
            const hex = color.replace("#", "");
            const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
            const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
            const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
        }
        if (isGradient) {
            const match = color.match(/(#[0-9a-fA-F]{3,6}|rgb\([^)]+\))/);
            if (match) {
                const firstColor = match[0];
                if (firstColor.startsWith("rgb")) {
                    const rgbMatch = firstColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
                    if (rgbMatch) {
                        const [, r, g, b] = rgbMatch;
                        return `rgba(${r}, ${g}, ${b}, 0.8)`;
                    }
                } else if (firstColor.startsWith("#")) {
                    const hex = firstColor.replace("#", "");
                    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
                    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
                    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
                    return `rgba(${r}, ${g}, ${b}, 0.7)`;
                }
            }
            return "rgba(255, 255, 255, 0.7)";
        }
        return "rgba(255, 255, 255, 0.7)";
    };

    return (
        <div className="w-full " style={{
            paddingLeft: "12%",
            paddingRight: "12%",
            paddingTop: "60px",
            paddingBottom: "40px"
        }}>
            {/* Header & Paragraph at top */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end md:gap-4 mb-6 pl-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0E1E45] leading-tight sm:leading-snug break-words">
                    {header?.includes(':') ? (
                        <>
                            <span className="block">{header.split(':')[0]}:</span>
                            <span className="block text-blue-800">{header.split(':').slice(1).join(':')}</span>
                        </>
                    ) : (
                        <span className="block">{header}</span>
                    )}
                </h2>
                {paragraph && (
                    <p className="mt-3 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">
                        {paragraph}
                    </p>
                )}
            </div>

            <div
                className="relative w-full"
                style={{
                    minHeight: `${dimensions.cardHeight + 60 * dimensions.fontScale}px`, // add space for shadow
                    overflow: "visible",
                }}
            >
                {canScrollLeft && (
                    <button
                        onClick={scrollLeft}
                        className="text-white carousel-button carousel-button-left hover:scale-150 blink-effect focus:outline-none"
                        aria-label="Scroll left"
                        style={{
                            position: "absolute",
                            left: -20,
                            top: "35%",
                            transform: "translateY(-35%)",
                            backgroundColor: "transparent",
                            width: `${buttonSize * dimensions.fontScale}px`,
                            height: `${buttonSize * dimensions.fontScale}px`,
                            padding: 0,
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                        }}
                    >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#5B5A6F"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                        </div>
                    </button>
                )}

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto p-4 no-scrollbar"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    style={{
                        columnGap: `${slideGap * dimensions.fontScale}px`,
                        paddingBottom: `${80 * dimensions.fontScale}px`
                    }}>

                    {slides.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                if (activeTooltip === index) {
                                    setActiveTooltip(null);
                                    setIsTooltipClicked(false);
                                } else {
                                    setActiveTooltip(index);
                                    setIsTooltipClicked(true);
                                }
                            }}
                            onMouseEnter={() => {
                                if (isTooltipClicked && activeTooltip !== index) {
                                    setActiveTooltip(null);
                                    setIsTooltipClicked(false);
                                }
                            }}
                            onTouchStart={() => setTouchedCardIndex(index)}
                            onTouchEnd={() => setTouchedCardIndex(index)}
                            className="group relative flex flex-col items-center flex-shrink-0 transition-transform duration-300 hover:scale-[1.01] select-none"
                            style={{
                                width: `${dimensions.cardWidth}px`,
                                minWidth: `${dimensions.cardWidth}px`,
                                height: `${dimensions.cardHeight}px`,
                                marginBottom: `${70 * dimensions.fontScale}px`, // Extra space for tooltip below
                                marginTop: `${30 * dimensions.fontScale}px`,
                                marginLeft: index === 0 ? `${20 * dimensions.fontScale}px` : "0px",
                            }}
                        >
                            {/* Card Container */}
                            <div
                                className="relative overflow-visible w-full rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] rounded-br-[10px] shadow-md "
                                style={{
                                    height: "100%",
                                    background: getValidColor(item.backgroundColor),
                                    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                {/* Background Image */}
                                {item.image && (
                                    <>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-0 rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] rounded-br-[10px]"
                                        />

                                        {/* Bottom Blur Overlay */}
                                        <div
                                            className="absolute bottom-0 left-0 w-full z-10 rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] rounded-br-[10px]"
                                            style={{
                                                height: "25%",
                                                background: "linear-gradient(to top, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                                                backdropFilter: "blur(2px)",
                                            }}
                                        />

                                        {/* Dark Hover Gradient Overlay */}
                                        <div
                                            className={`absolute top-0 left-0 w-full h-full z-10 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-black/40 rounded-[10px] ${touchedCardIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                        />
                                    </>
                                )}

                            </div>

                            {/* Flag - Top Right Corner */}
                            {item.flag && (
                                <div
                                    className="absolute top-2 right-2 z-10 bg-white/70 rounded-full overflow-hidden"
                                    style={{
                                        padding: `${3 * dimensions.fontScale}px`,
                                        width: `${Math.max(30 * dimensions.fontScale, 20)}px`,
                                        height: `${Math.max(30 * dimensions.fontScale, 20)}px`,
                                    }}
                                >
                                    <img
                                        src={item.flag}
                                        alt={`${item.title} flag`}
                                        className="w-full h-full object-cover "
                                    />
                                </div>
                            )}

                            {/* Country Name - Bottom Left Corner */}
                            <div
                                className="absolute bottom-2 left-3 z-10  py-1 rounded-md"
                                style={{
                                    fontSize: `${Math.max(15 * dimensions.fontScale)}px`,
                                    fontWeight: 600,
                                    color: item.titleColor || "#fff",
                                }}
                            >
                                {item.title}
                            </div>

                            {/* Tooltip BELOW Card */}
                            {item.tooltipMessage && (
                                <div
                                    className={`absolute top-full mt-1 md:mt-2 z-20 transition-opacity duration-300 
                                    ${
                                        activeTooltip === index
                                            ? "opacity-100 pointer-events-auto"
                                            : isTooltipClicked
                                                ? "opacity-0 pointer-events-none"
                                                : "sm:group-hover:opacity-100 sm:pointer-events-auto opacity-0 pointer-events-none"
                                    }
                                    `}
                                >
                                    <div className="relative bg-white border border-blue-300 rounded-lg shadow-lg p-1 sm:p-2 text-center w-[90px] max-w-xs sm:w-[270px]">
                                        {/* Arrow */}
                                        <div className="absolute -top-1 sm:-top-2 left-1/2 transform -translate-x-1/2 
                                                      w-2 h-2 sm:w-4 sm:h-4 bg-white border-l border-t border-blue-300 rotate-45" />

                                        {/* Content */}
                                        <p
                                            className="text-gray-800 mb-1 sm:mb-3 leading-snug"
                                            style={{
                                                fontSize: `${14 * dimensions.fontScale}px`,
                                            }}
                                        >
                                            {item.tooltipMessage}
                                        </p>
                                        <a
                                            href={item.buttonLink || "#"}
                                            className="inline-block bg-sky-600 hover:bg-sky-700 text-white rounded-md font-medium"
                                            style={{
                                                fontSize: `${14 * dimensions.fontScale}px`,
                                                padding: `${6 * dimensions.fontScale}px ${16 * dimensions.fontScale}px`,
                                            }}
                                        >
                                            {item.buttonText || "Contact"}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {canScrollRight && (
                    <button
                        onClick={scrollRight}
                        className="text-white carousel-button carousel-button-right hover:scale-150 blink-effect focus:outline-none"
                        aria-label="Scroll right"
                        style={{
                            position: "absolute",
                            right: -20,
                            top: "35%",
                            transform: "translateY(-35%)",
                            backgroundColor: "transparent",
                            width: `${buttonSize * dimensions.fontScale}px`,
                            height: `${buttonSize * dimensions.fontScale}px`,
                            padding: 0,
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                        }}
                    >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#5B5A6F"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default CountrySlideCard;