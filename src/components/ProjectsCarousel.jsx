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
    const [slideWidthRatio, setSlideWidthRatio] = useState(1);
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
    const BASE_FONT_SCALE = 1;

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
            if (!containerRef.current) return;

            const windowWidth = window.innerWidth;
            const containerWidth = containerRef.current.offsetWidth;

            const slidesToDisplay = settings.minimumSlidesToShow ?? (
                windowWidth >= 1280 ? 3.8 :
                windowWidth >= 1024 ? 3.2 :
                windowWidth >= 768  ? 2.4 :
                                      2.4
            );

            // ✅ Responsive gap adjustment
            let dynamicBaseGap = BASE_SLIDE_GAP;
            if (windowWidth < 640) dynamicBaseGap = 24;
            else if (windowWidth < 768) dynamicBaseGap = 32;
            else if (windowWidth < 1024) dynamicBaseGap = 40;

            const gapRatio = dynamicBaseGap / BASE_SLIDE_WIDTH;
            const totalGapCount = slidesToDisplay - 1;
            const slideAndGapFactor = slidesToDisplay + totalGapCount * gapRatio;

            let calculatedSlideWidth = containerWidth / slideAndGapFactor;
            let calculatedGap = calculatedSlideWidth * gapRatio;

            if (calculatedSlideWidth < 150) {
                calculatedSlideWidth = 150;
                calculatedGap = calculatedSlideWidth * gapRatio;
            }

            const ratio = Math.max(0.7, calculatedSlideWidth / BASE_SLIDE_WIDTH);
            setSlideWidthRatio(ratio);
            setSlideWidth(calculatedSlideWidth);
            setSlideHeight(calculatedSlideWidth * (BASE_SLIDE_HEIGHT / BASE_SLIDE_WIDTH));
            setCurrentSlideGap(calculatedGap);
            setCarouselPadding(calculatedGap);
            setCarouselBottomGap(BASE_CAROUSEL_BOTTOM_GAP * ratio);
            setCurrentProgressBarHeight(BASE_PROGRESS_BAR_HEIGHT * ratio);
        };

        const debounce = (func, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), delay);
            };
        };

        const debouncedUpdate = debounce(updateDimensions, 100);
        updateDimensions();
        window.addEventListener("resize", debouncedUpdate);

        return () => window.removeEventListener("resize", debouncedUpdate);
    }, []);

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
            const dragSpeed = settings.dragSpeed ?? 1.5;
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

    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        const handleWheel = (e) => {
            if (!isHovered) return;
            e.preventDefault();

            const delta = e.deltaY || e.deltaX;
            if (Math.abs(delta) < 5) return;

            const direction = delta > 0 ? "right" : "left";
            const scrollDistance = slideWidth + currentSlideGap;

            slider.scrollBy({
                left: direction === "right" ? scrollDistance : -scrollDistance,
                behavior: "smooth",
            });
        };

        slider.addEventListener("wheel", handleWheel, { passive: false });
        return () => slider.removeEventListener("wheel", handleWheel);
    }, [isHovered, slideWidth, currentSlideGap]);

    useEffect(() => {
        const handleKey = (e) => {
            if (!isHovered) return;
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                scroll("left");
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                scroll("right");
            }
        };

        if (isHovered) {
            document.addEventListener("keydown", handleKey);
        }

        return () => {
            document.removeEventListener("keydown", handleKey);
        };
    }, [isHovered, scroll]);

    return (
        <section
            ref={containerRef}
            className="w-full max-w-[100vw] relative bg-[#f0fdf4] py-6 overflow-visible"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                <h2 className="font-bold text-gray-800 mb-8 text-center text-xl sm:text-3xl md:text-4xl lg:text-5xl">
                    OUR PROJECTS
                </h2>

                <div
                    onClick={() => scroll("left")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black cursor-pointer select-none text-xl"
                    style={{ fontWeight: 700 }}
                >
                    &lt;
                </div>

                <div
                    onClick={() => scroll("right")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black cursor-pointer select-none text-xl"
                    style={{ fontWeight: 700 }}
                >
                    &gt;
                </div>

                <div
                    ref={scrollRef}
                    className="cursor-grab active:cursor-grabbing overflow-x-auto overflow-visible scroll-smooth no-scrollbar"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    <div
                        className="flex w-max select-none"
                        style={{
                            gap: `${currentSlideGap}px`,
                            paddingLeft: `${BASE_TEXT_PADDING * 0.5 * slideWidthRatio}px`,
                            paddingRight: `${BASE_TEXT_PADDING * 0.5 * slideWidthRatio}px`,
                            transition: 'gap 0.3s ease-out, padding 0.3s ease-out',
                        }}
                    >
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0 overflow-hidden select-none"
                                style={{
                                    width: `${slideWidth}px`,
                                    height: `${slideHeight}px`,
                                    scrollSnapAlign: "start",
                                    backgroundColor: project.bgColor || "#f0f0f0",
                                    borderRadius: `${BASE_CORNER_RADIUS * slideWidthRatio}px`,
                                    transition: 'width 0.3s ease-out, height 0.3s ease-out, border-radius 0.3s ease-out',
                                }}
                            >
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
                                    onError={(e) => { e.target.style.opacity = 0.1; }}
                                />

                                <div
                                    className="absolute inset-0 flex"
                                    style={{
                                        background: project.textPosition === "top"
                                            ? `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)`
                                            : `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)`,
                                        paddingTop: project.textPosition === "top"
                                            ? `${BASE_TEXT_PADDING * 0.3 * slideWidthRatio}px`
                                            : '0',
                                        paddingBottom: project.textPosition === "bottom"
                                            ? `${BASE_TEXT_PADDING * 0.3 * slideWidthRatio}px`
                                            : '0',
                                        paddingLeft: `${BASE_TEXT_PADDING * 0.5 * slideWidthRatio}px`,
                                        paddingRight: `${BASE_TEXT_PADDING * 0.5 * slideWidthRatio}px`,
                                        alignItems: project.textPosition === "top" ? "flex-start" : "flex-end",
                                        transition: 'padding 0.3s ease-out',
                                    }}
                                >
                                    <h3
                                        className="text-white font-semibold text-center"
                                        style={{
                                            maxWidth: `${300 * slideWidthRatio}px`,
                                            margin: "0 auto",
                                            fontSize: `${24 * slideWidthRatio * BASE_FONT_SCALE}px`,
                                            lineHeight: 1.2,
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {project.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="bg-gray-200 rounded mx-auto"
                    style={{
                        width: "100%",
                        marginTop: `${carouselBottomGap}px`,
                        height: `${currentProgressBarHeight}px`,
                        transition: 'margin-top 0.3s ease-out, height 0.3s ease-out',
                    }}
                >
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
