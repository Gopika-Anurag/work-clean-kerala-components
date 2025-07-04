// src/components/ProjectsCarousel.js
import React, { useRef, useEffect, useState, useCallback } from "react";

const ProjectsCarousel = ({ projects, settings }) => {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [slideWidth, setSlideWidth] = useState(0);
    const [slideHeight, setSlideHeight] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Using isHovered to control both wheel and keyboard for simplicity and directness
    const [isHovered, setIsHovered] = useState(false);

    const [carouselPadding, setCarouselPadding] = useState(0);
    const [currentSlideGap, setCurrentSlideGap] = useState(0);

    const [carouselBottomGap, setCarouselBottomGap] = useState(0);
    const [currentProgressBarHeight, setCurrentProgressBarHeight] = useState(0);

    const BASE_SLIDE_WIDTH = 400;
    const BASE_SLIDE_HEIGHT = 600;
    const BASE_SLIDE_GAP = 50;
    const BASE_CORNER_RADIUS = 20;
    const BASE_TEXT_PADDING = 60;

    const BASE_CAROUSEL_BOTTOM_GAP = 50;
    const BASE_PROGRESS_BAR_HEIGHT = 4;

    const scroll = useCallback((dir) => {
        if (scrollRef.current) {
            const scrollAmount = slideWidth + currentSlideGap;
            scrollRef.current.scrollBy({
                left: dir === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    }, [slideWidth, currentSlideGap]);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const windowWidth = window.innerWidth;

                let slidesToDisplay;
                let calculatedSlideWidth;
                let calculatedSlideGap;
                let calculatedCarouselPadding;

                if (windowWidth >= 1024) {
                    slidesToDisplay = 3.8;
                } else {
                    slidesToDisplay = 2.4;
                }

                const assumedGapRatio = BASE_SLIDE_GAP / BASE_SLIDE_WIDTH;
                calculatedSlideWidth = (containerWidth) / (slidesToDisplay + (slidesToDisplay - 1) * assumedGapRatio);
                calculatedSlideGap = calculatedSlideWidth * assumedGapRatio;

                const MIN_ALLOWED_SLIDE_WIDTH = 250;
                if (calculatedSlideWidth < MIN_ALLOWED_SLIDE_WIDTH) {
                    calculatedSlideWidth = MIN_ALLOWED_SLIDE_WIDTH;
                    calculatedSlideGap = MIN_ALLOWED_SLIDE_WIDTH * assumedGapRatio;
                }

                calculatedCarouselPadding = calculatedSlideGap;

                const slideWidthRatio = calculatedSlideWidth / BASE_SLIDE_WIDTH;

                const calculatedCarouselBottomGap = BASE_CAROUSEL_BOTTOM_GAP * slideWidthRatio;
                const calculatedProgressBarHeight = BASE_PROGRESS_BAR_HEIGHT * slideWidthRatio;

                setSlideWidth(calculatedSlideWidth);
                setSlideHeight(calculatedSlideWidth * (BASE_SLIDE_HEIGHT / BASE_SLIDE_WIDTH));
                setCurrentSlideGap(calculatedSlideGap);
                setCarouselPadding(calculatedCarouselPadding);
                setCarouselBottomGap(calculatedCarouselBottomGap);
                setCurrentProgressBarHeight(calculatedProgressBarHeight);
            }
        };

        const debounce = (func, delay) => {
            let timeout;
            return function executed(...args) {
                const context = this;
                const later = () => {
                    timeout = null;
                    func.apply(context, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, delay);
            };
        };

        const debouncedUpdateDimensions = debounce(updateDimensions, 100);

        updateDimensions();
        window.addEventListener("resize", debouncedUpdateDimensions);

        return () => window.removeEventListener("resize", debouncedUpdateDimensions);
    }, [BASE_SLIDE_WIDTH, BASE_SLIDE_HEIGHT, BASE_SLIDE_GAP, BASE_CAROUSEL_BOTTOM_GAP, BASE_PROGRESS_BAR_HEIGHT]);

    useEffect(() => {
        const ref = scrollRef.current;
        const handleScroll = () => {
            if (ref) {
                const maxScroll = ref.scrollWidth - ref.clientWidth;
                const percent = maxScroll > 0 ? (ref.scrollLeft / maxScroll) * 100 : 0;
                setProgress(percent);
            }
        };
        ref?.addEventListener("scroll", handleScroll);
        return () => ref?.removeEventListener("scroll", handleScroll);
    }, []);

    // 🖱️ Mouse Drag Scroll
    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        const handleMouseDown = (e) => {
            setIsDragging(true);
            setStartX(e.pageX - slider.offsetLeft);
            setScrollLeft(slider.scrollLeft);
            slider.classList.add("select-none");
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            slider.classList.remove("select-none");
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const dragSpeed = settings.dragSpeed ?? 1.5; // fallback if not passed
const walk = (x - startX) * dragSpeed;
            slider.scrollLeft = scrollLeft - walk;
        };

        slider.addEventListener("mousedown", handleMouseDown);
        slider.addEventListener("mouseleave", handleMouseUp);
        slider.addEventListener("mouseup", handleMouseUp);
        slider.addEventListener("mousemove", handleMouseMove);

        return () => {
            slider.removeEventListener("mousedown", handleMouseDown);
            slider.removeEventListener("mouseleave", handleMouseUp);
            slider.removeEventListener("mouseup", handleMouseUp);
            slider.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isDragging, startX, scrollLeft]);

    // 🧭 Scroll by WHEEL (only when hovered)
    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return; // Always need slider to exist

        const handleWheel = (e) => {
            // ONLY if hovered, prevent default and scroll carousel
            if (isHovered) {
                e.preventDefault();
                const scrollAmount = e.deltaY || e.deltaX;
                const wheelScrollSpeed = settings.wheelScrollSpeed ?? 0.8;
                slider.scrollBy({ left: scrollAmount * wheelScrollSpeed, behavior: "smooth" });
            }
        };

        // Attach listener to the slider itself, not document
        slider.addEventListener("wheel", handleWheel, { passive: false });
        return () => slider.removeEventListener("wheel", handleWheel);
    }, [isHovered, settings.wheelScrollSpeed]); // Depend on isHovered

    // ⌨️ Scroll by Arrow Keys (only when hovered - this is the critical change)
    useEffect(() => {
        const handleKey = (e) => {
            if (isHovered) { // Only if this carousel is hovered
                if (e.key === "ArrowLeft") {
                    e.preventDefault(); // Prevent default page scroll
                    scroll("left");
                } else if (e.key === "ArrowRight") {
                    e.preventDefault(); // Prevent default page scroll
                    scroll("right");
                }
                // Important: Also prevent up/down arrows if you want to completely stop page scroll
                // when hovered over the carousel, as they might still cause a jump.
                // You might need to experiment with this based on your page layout.
                // if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                //     e.preventDefault();
                // }
            }
        };

        // Add/remove global keydown listener based on hover state
        if (isHovered) {
            document.addEventListener("keydown", handleKey);
        }

        // Cleanup function: remove the listener when unhovered or component unmounts
        return () => {
            document.removeEventListener("keydown", handleKey);
        };
    }, [isHovered, scroll]); // Depend on isHovered and scroll

    return (
        <section
            ref={containerRef}
            className="w-full relative bg-[#f0fdf4] py-6 overflow-visible"
            onMouseEnter={() => setIsHovered(true)} // Mouse enters this carousel
            onMouseLeave={() => setIsHovered(false)} // Mouse leaves this carousel
            // Removed tabIndex, onFocus, onBlur from here
        >
            <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                <h2
                    className="font-bold text-gray-800 mb-8 text-center
                                 text-xl sm:text-3xl md:text-4xl lg:text-5xl"
                >
                    OUR PROJECTS
                </h2>

                <div
                    onClick={() => scroll("left")}
                    className="absolute left-4 md:left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black cursor-pointer select-none
                                 text-lg sm:text-xl md:text-2xl"
                    style={{ fontWeight: 700 }}
                >
                    &lt;
                </div>

                <div
                    onClick={() => scroll("right")}
                    className="absolute right-4 md:right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black cursor-pointer select-none
                                 text-lg sm:text-xl md:text-2xl"
                    style={{ fontWeight: 700 }}
                >
                    &gt;
                </div>

                <div
                    ref={scrollRef}
                    className="cursor-grab active:cursor-grabbing overflow-x-auto overflow-visible scroll-smooth no-scrollbar"
                    style={{ scrollSnapType: "x mandatory" }}
                    // Removed tabIndex, onFocus, onBlur from scrollRef div as well
                >
                    <div
                        className="flex w-max select-none"
                        style={{
                            gap: `${currentSlideGap}px`,
                            paddingLeft: `${carouselPadding}px`,
                            paddingRight: `${carouselPadding}px`,
                            transition: 'gap 0.3s ease-out, padding 0.3s ease-out',
                        }}
                    >
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0 overflow-hidden shadow-md select-none"
                                style={{
                                    width: `${slideWidth}px`,
                                    height: `${slideHeight}px`,
                                    scrollSnapAlign: "start",
                                    backgroundColor: project.bgColor || "#f0f0f0",
                                    borderRadius: `${BASE_CORNER_RADIUS}px`,
                                    transition: 'width 0.3s ease-out, height 0.3s ease-out, border-radius 0.3s ease-out',
                                }}
                            >
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
                                    onError={(e) => {
                                        e.target.style.opacity = 0.1;
                                    }}
                                />

                                <div
                                    className={`absolute inset-0 flex`}
                                    style={{
                                        background: project.textPosition === "top"
                                            ? `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)`
                                            : `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)`,
                                        paddingTop: project.textPosition === "top" ? `${BASE_TEXT_PADDING * 0.7}px` : '0',
                                        paddingBottom: project.textPosition === "bottom" ? `${BASE_TEXT_PADDING * 0.7}px` : '0',
                                        paddingLeft: `${BASE_TEXT_PADDING * 0.5}px`,
                                        paddingRight: `${BASE_TEXT_PADDING * 0.5}px`,
                                        alignItems: project.textPosition === "top" ? "flex-start" : "flex-end",
                                        transition: 'padding 0.3s ease-out',
                                    }}
                                >
                                    <h3
                                        className="text-white font-semibold text-center w-full
                                                     text-base sm:text-xl md:text-2xl lg:text-3xl"
                                        style={{
                                            wordBreak: 'break-word',
                                            lineHeight: 1.8,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {project.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div
                    className="bg-gray-200 rounded mx-auto"
                    style={{
                        width: "100%",
                        marginTop: `${carouselBottomGap}px`,
                        height: `${currentProgressBarHeight}px`,
                        transition: 'margin-top 0.3s ease-out, height 0.3s ease-out',
                    }}
                >
                    {/* Progress Bar Fill */}
                    <div
                        className="bg-green-700 rounded"
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            transition: "width 0.3s ease",
                        }}
                    ></div>
                </div>
            </div>
        </section>
    );
};

export default ProjectsCarousel;