import React, { useState, useEffect, useRef, useCallback } from "react";

const Directors = ({ attributes }) => {
    const {
        slides = [],
        slideGap,
        backgroundColor,
        title,
        titleColor,
        slideWidth,
        slideHeight,
        buttonSize,
        autoScrolling,
    } = attributes;

    const [active, setActive] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const isMobile = windowWidth < 768;
    const gap = isMobile ? 12 : slideGap;
    const extraCenterGap = 20;

    // Responsive width and height calculation
    const getSlideDimensions = () => {
        if (windowWidth < 480) {
            return { width: windowWidth * 0.6, height: slideHeight * 0.6 };
        } else if (windowWidth < 768) {
            return { width: windowWidth * 0.6, height: slideHeight * 0.6 };
        } else if (windowWidth < 1024) {
            return { width: slideWidth * 0.8, height: slideHeight * 0.8 };
        }
        return { width: slideWidth, height: slideHeight };
    };

    const { width: itemWidth, height: itemHeight } = getSlideDimensions();

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const calculateTransform = (index) => {
        let position = index - active;

        if (position > slides.length / 2) {
            position -= slides.length;
        } else if (position < -slides.length / 2) {
            position += slides.length;
        }

        let transformX = position * (itemWidth + gap);

        if (!isMobile) {
            const centerOffset = -((itemWidth + gap + extraCenterGap) / 2);
            transformX += centerOffset;

            if (index === (active + 1) % slides.length) {
                transformX += extraCenterGap / 2;
            }
            if (index === active) {
                transformX -= extraCenterGap / 2;
            }
        } else {
            if (index === (active - 1 + slides.length) % slides.length) {
                transformX -= extraCenterGap / 2;
            }
            if (index === (active + 1) % slides.length) {
                transformX += extraCenterGap / 2;
            }
        }
        return `translateX(${transformX}px)`;
    };

    const calculateScale = (index) => {
        if (!isMobile) {
            return index === active || index === (active + 1) % slides.length
                ? "scale(1.15)"
                : "scale(1)";
        } else {
            return index === active ? "scale(1.15)" : "scale(1)";
        }
    };

    // Scroll left/right navigation handlers
    const scrollLeft = useCallback(() => {
        setActive((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const scrollRight = useCallback(() => {
        setActive((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    // Dragging and touch event handlers
    const handleMouseDown = useCallback((e) => {
        setIsDragging(true);
        setStartX(e.pageX);
    }, []);

    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX);
    }, []);

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const walk = e.pageX - startX;
            // Threshold for sliding
            if (walk > 50) {
                scrollLeft();
                setIsDragging(false);
            } else if (walk < -50) {
                scrollRight();
                setIsDragging(false);
            }
        },
        [isDragging, startX, scrollLeft, scrollRight]
    );

    const handleTouchMove = useCallback(
        (e) => {
            if (!isDragging) return;
            const walk = e.touches[0].pageX - startX;
            if (walk > 50) {
                scrollLeft();
                setIsDragging(false);
            } else if (walk < -50) {
                scrollRight();
                setIsDragging(false);
            }
        },
        [isDragging, startX, scrollLeft, scrollRight]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Auto-scrolling effect
    useEffect(() => {
        if (!autoScrolling || slides.length <= 1 || isHovered || isDragging) return;

        const interval = setInterval(() => {
            setActive((prevActive) => (prevActive + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [autoScrolling, slides.length, isHovered, isDragging]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                scrollLeft();
            } else if (e.key === "ArrowRight") {
                scrollRight();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [scrollLeft, scrollRight]);

    // Wheel/trackpad scrolling
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let scrollTimeout = null;

        const onWheel = (e) => {
            // Prevent native scroll
            e.preventDefault();

            const threshold = 100;
            if (e.deltaY < -threshold || e.deltaX < -threshold) {
                setActive((prev) => (prev - 1 + slides.length) % slides.length);
                clearTimeout(scrollTimeout);
            } else if (e.deltaY > threshold || e.deltaX > threshold) {
                setActive((prev) => (prev + 1) % slides.length);
                clearTimeout(scrollTimeout);
            }

            scrollTimeout = setTimeout(() => { }, 100);
        };

        container.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            container.removeEventListener("wheel", onWheel);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [slides.length]);

    return (
        <div
            className="bg-gray min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor }}
        >
            <div
                className="relative w-full max-w-7xl mx-auto rounded-xl p-4 sm:p-8 py-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <h2
                    className="text-3xl sm:text-5xl font-extrabold text-center mb-1 sm:mb-6 mt-0 sm:mt-4"
                    style={{ color: titleColor }}
                >
                    {title}
                </h2>

                <div className="relative h-[490px] sm:h-[600px] flex items-center justify-center">
                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
                        <button
                            onClick={scrollLeft}
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 disabled:opacity-50"
                            aria-label="Scroll Left"
                            disabled={isDragging}
                            style={{ width: buttonSize || 40, height: buttonSize || 40 }}
                        >
                            &#8592;
                        </button>
                    </div>

                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
                        <button
                            onClick={scrollRight}
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 disabled:opacity-50"
                            aria-label="Scroll Right"
                            disabled={isDragging}
                            style={{ width: buttonSize || 40, height: buttonSize || 40 }}
                        >
                            &#8594;
                        </button>
                    </div>

                    {/* Slides */}
                    <div
                        ref={scrollRef}
                        className={`flex w-full h-full justify-center items-center overflow-x-hidden no-scrollbar relative`}
                        style={{ gap: `${gap}px`, cursor: isDragging ? "grabbing" : "grab" }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchEnd={handleTouchEnd}
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                    >
                        {slides.map((director, index) => {
                            const isCenterPair =
                                !isMobile &&
                                (index === active || index === (active + 1) % slides.length);
                            const isMobileCenter = isMobile && index === active;

                            let opacity = 0;
                            if (!isMobile) {
                                const prev = (active - 1 + slides.length) % slides.length;
                                const next = (active + 2) % slides.length;
                                if (
                                    index === prev ||
                                    index === active ||
                                    index === (active + 1) % slides.length ||
                                    index === next
                                ) {
                                    opacity = 1;
                                }
                            } else {
                                const prev = (active - 1 + slides.length) % slides.length;
                                const next = (active + 1) % slides.length;
                                if (index === prev || index === active || index === next) {
                                    opacity = 1;
                                }
                            }

                            return (
                                <div
                                    key={index}
                                    className="absolute transition-all duration-500 ease-in-out"
                                    style={{
                                        transform: `${calculateTransform(index)} ${calculateScale(index)}`,
                                        zIndex: isCenterPair || isMobileCenter ? 10 : 5,
                                        opacity,
                                        width: `${itemWidth}px`,
                                        height: `${itemHeight}px`,
                                        transitionProperty: "width, height, transform",
                                        transitionDuration: "0.5s",
                                        transitionTimingFunction: "ease-in-out",
                                        userSelect: isDragging ? "none" : "auto",
                                    }}
                                >
                                    <div className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-500">
                                        <img
                                            src={director.image}
                                            alt={director.name}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />

                                        {(() => {
                                            let overlayStyle = null;
                                            if (!isMobile) {
                                                const prev = (active - 1 + slides.length) % slides.length;
                                                const next = (active + 2) % slides.length;
                                                if (index === prev) {
                                                    overlayStyle = {
                                                        background: "linear-gradient(to right, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0) 80%)",
                                                    };
                                                }
                                                if (index === next) {
                                                    overlayStyle = {
                                                        background: "linear-gradient(to left, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0) 80%)",
                                                    };
                                                }
                                            } else {
                                                const prev = (active - 1 + slides.length) % slides.length;
                                                const next = (active + 1) % slides.length;
                                                if (index === prev) {
                                                    overlayStyle = {
                                                        background: "linear-gradient(to right, rgba(255,255,255,0.95) 10%, rgba(255,255,255,0) 85%)",
                                                    };
                                                }
                                                if (index === next) {
                                                    overlayStyle = {
                                                        background: "linear-gradient(to left, rgba(255,255,255,0.95) 10%, rgba(255,255,255,0) 85%)",
                                                    };
                                                }
                                            }
                                            return overlayStyle ? (
                                                <div className="absolute inset-0" style={overlayStyle}></div>
                                            ) : null;
                                        })()}

                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white transition-opacity duration-500 opacity-100">
                                            <h3 className="text-xl sm:text-2xl font-bold text-black">
                                                {director.name}
                                            </h3>
                                            <p className="text-sm text-gray-700">{director.position}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Directors;