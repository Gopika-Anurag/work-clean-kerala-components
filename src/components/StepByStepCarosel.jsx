import { useRef, useEffect, useState, useCallback } from "react";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";

const StepByStepCarousel = ({ steps, carouselSettings, title }) => {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragged, setDragged] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);

    const [isHovered, setIsHovered] = useState(false);
    const isHoveredRef = useRef(isHovered);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [dimensions, setDimensions] = useState({
        slideWidth: carouselSettings.slideWidth,
        slideHeight: carouselSettings.slideHeight,
        fontScale: 1,
    });

    const SCROLL_SPEED = 7;

    useEffect(() => {
        isHoveredRef.current = isHovered;
    }, [isHovered]);

    useEffect(() => {
        const updateDimensions = () => {
            const containerWidth = carouselRef.current?.offsetWidth || window.innerWidth;
            const fullSlideWidth = carouselSettings.slideWidth;
            const requiredWidth = fullSlideWidth * carouselSettings.minimumSlidesToShow;

            if (containerWidth < requiredWidth) {
                const adjustedWidth = containerWidth / carouselSettings.minimumSlidesToShow;
                const fontScale = adjustedWidth / fullSlideWidth;
                setDimensions({
                    slideWidth: adjustedWidth,
                    slideHeight: (adjustedWidth * carouselSettings.slideHeight) / fullSlideWidth,
                    fontScale,
                });
            } else {
                setDimensions({
                    slideWidth: fullSlideWidth,
                    slideHeight: carouselSettings.slideHeight,
                    fontScale: 1.2,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [carouselSettings]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragged(false);
        setStartX(e.pageX);
        setScrollLeftPos(carouselRef.current.scrollLeft);
        document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const scrollDistance = e.pageX - startX;
        if (Math.abs(scrollDistance) > 5) setDragged(true);
        carouselRef.current.scrollLeft = scrollLeftPos - scrollDistance * carouselSettings.dragSpeed;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto";
        setTimeout(() => setDragged(false), 100);
    };

    useEffect(() => {
        const container = carouselRef.current;
        if (!container) return;

        const onWheel = (e) => {
            if (isHoveredRef.current) {
                e.preventDefault();
                const scrollAmount = (e.deltaX || e.deltaY) * SCROLL_SPEED;
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        };

        container.addEventListener("wheel", onWheel, { passive: false });
        return () => container.removeEventListener("wheel", onWheel);
    }, [SCROLL_SPEED]);

    useEffect(() => {
        const handleKey = (e) => {
            if (isHoveredRef.current) {
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                }
                if (e.key === "ArrowLeft") {
                    carouselRef.current.scrollBy({ left: -dimensions.slideWidth, behavior: "smooth" });
                } else if (e.key === "ArrowRight") {
                    carouselRef.current.scrollBy({ left: dimensions.slideWidth, behavior: "smooth" });
                }
            }
        };

        document.addEventListener("keydown", handleKey, { capture: true });
        return () => document.removeEventListener("keydown", handleKey, { capture: true });
    }, [dimensions.slideWidth]);

    useEffect(() => {
        const container = carouselRef.current;
        if (!container) return;
        const updateProgress = () => {
            const scrollLeft = container.scrollLeft;
            const scrollMax = container.scrollWidth - container.clientWidth;
            const percent = scrollMax > 0 ? (scrollLeft / scrollMax) * 100 : 0;
            setScrollProgress(percent);
        };

        container.addEventListener("scroll", updateProgress);
        return () => container.removeEventListener("scroll", updateProgress);
    }, []);

    const scrollLeft = useCallback(() => {
        carouselRef.current.scrollBy({ left: -dimensions.slideWidth, behavior: "smooth" });
    }, [dimensions.slideWidth]);

    const scrollRight = useCallback(() => {
        carouselRef.current.scrollBy({ left: dimensions.slideWidth, behavior: "smooth" });
    }, [dimensions.slideWidth]);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
            style={{ height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}
        >
            {title && (
                <h2
                    style={{ textAlign: "center", fontSize: `${1.3 * dimensions.fontScale}rem`, marginBottom: "0.3rem" }}
                >
                    {title}
                </h2>
            )}

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <p
                    style={{
                        textTransform: "uppercase",
                        fontSize: `${0.95 * dimensions.fontScale}rem`,
                        color: "#2563eb",
                        fontWeight: 600,
                    }}
                >
                    SAUDI PCC ONLINE PROCESS
                </p>
                <h2
                    style={{
                        fontSize: `${1.8 * dimensions.fontScale}rem`,
                        fontWeight: "bold",
                        color: "#1e293b",
                        marginTop: "0.25rem",
                    }}
                >
                    Step-by-Step Process
                </h2>
            </div>

            <div style={{ position: "relative" }}>
                <button onClick={scrollLeft} style={{ position: "absolute", top: "40%", left: "0", zIndex: 10, fontSize: "2rem", background: "transparent", color: "#000", border: "none", cursor: "pointer" }}>‹</button>
                <button onClick={scrollRight} style={{ position: "absolute", top: "40%", right: "0", zIndex: 10, fontSize: "2rem", background: "transparent", color: "#000", border: "none", cursor: "pointer" }}>›</button>

                <div
                    ref={carouselRef}
                    className="no-scrollbar"
                    style={{ display: "flex", overflowX: "auto", scrollBehavior: "smooth", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", gap: "1rem", paddingBottom: "0.5rem", cursor: isDragging ? "grabbing" : "grab" }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            onClick={(e) => dragged && e.preventDefault()}
                            style={{
                                flex: "0 0 auto",
                                width: `${dimensions.slideWidth}px`,
                                minHeight: `${dimensions.slideHeight}px`,
                                backgroundColor: step.slideBackgroundColor,
                                padding: `${1 * dimensions.fontScale}rem`,
                                borderRadius: "1rem",
                                boxShadow: "0 0 8px rgba(0,0,0,0.08)",
                                display: "flex",
                                flexDirection: "row",
                                gap: `${0.75 * dimensions.fontScale}rem`,
                                alignItems: "flex-start",
                                position: "relative",
                            }}
                        >
                            <div style={{
                                position: "absolute",
                                top: `${0.5 * dimensions.fontScale}rem`,
                                right: `${0.5 * dimensions.fontScale}rem`,
                                display: "block",
                                background: "#eef4ff",
                                padding: `${0.35 * dimensions.fontScale}rem ${0.6 * dimensions.fontScale}rem`,
                                borderRadius: "1rem",
                                fontSize: `${0.9 * dimensions.fontScale}rem`,
                                fontWeight: 600,
                                color: "#2563eb",
                                textAlign: "right",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: `${0.4 * dimensions.fontScale}rem` }}>
                                    <FaFileAlt style={{ fontSize: `${1.1 * dimensions.fontScale}rem` }} />
                                    <span>STEP {step.step.toString().padStart(2, "0")}</span>
                                </div>
                            </div>

                            <img src={step.image} alt={`Step ${step.step}`} draggable={false} style={{ width: "40%", height: "100%", objectFit: "cover", borderRadius: "0.5rem" }} />

                            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: `${2.5 * dimensions.fontScale}rem` }}>
                                <h3 style={{ fontSize: `${1.4 * dimensions.fontScale}rem`, fontWeight: "bold", color: step.titleColor, marginBottom: `${0.5 * dimensions.fontScale}rem` }}>{step.title}</h3>
                                <p style={{ fontSize: `${1.05 * dimensions.fontScale}rem`, color: step.descriptionColor, marginBottom: `${0.4 * dimensions.fontScale}rem` }}>{step.description}</p>
                                <ul style={{ listStyle: "none", paddingLeft: 0, overflowWrap: "anywhere" }}>
                                    {step.checklist.map((item, i) => (
                                        <li key={i} style={{ fontSize: `${0.95 * dimensions.fontScale}rem`, color: step.checklistColor, display: "flex", alignItems: "center", marginBottom: `${0.3 * dimensions.fontScale}rem`, lineHeight: 1.4 }}>
                                            <FaCheckCircle style={{ marginRight: `${0.5 * dimensions.fontScale}rem`, flexShrink: 0 }} />
                                            <span style={{ overflowWrap: "anywhere" }}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ width: "100%", maxWidth: `${700 * dimensions.fontScale}px`, margin: "1rem auto 0" }}>
                <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${scrollProgress}%`, height: "100%", background: "#2563eb", transition: "width 0.3s ease" }} />
                </div>
            </div>
        </div>
    );
};

export default StepByStepCarousel;