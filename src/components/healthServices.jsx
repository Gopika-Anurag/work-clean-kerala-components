    import React, { useRef, useState, useEffect } from "react";
    import healthServicesData from "../data/healthServicesData";

    function HealthServices() {
    const { slides, minSlidesToShow } = healthServicesData;
    const carouselRef = useRef(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [slideWidthPercent, setSlideWidthPercent] = useState(100 / minSlidesToShow.desktop);
    const [slideHeight, setSlideHeight] = useState(600);


    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftStart, setScrollLeftStart] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);


    const updateSlideHeight = () => {
    if (window.innerWidth >= 1024) setSlideHeight(600);
    else if (window.innerWidth >= 768) setSlideHeight(400);
    else setSlideHeight(300);
    };

    useEffect(() => {
    updateSlideHeight();
    window.addEventListener("resize", updateSlideHeight);
    return () => window.removeEventListener("resize", updateSlideHeight);
    }, []);

    // Update slide width on resize
    const updateSlideWidth = () => {
        let slidesToShow;
        if (window.innerWidth >= 1024) slidesToShow = minSlidesToShow.desktop;
        else if (window.innerWidth >= 768) slidesToShow = minSlidesToShow.tablet;
        else slidesToShow = minSlidesToShow.mobile;
        setSlideWidthPercent(100 / slidesToShow);
    };

    useEffect(() => {
        updateSlideWidth();
        window.addEventListener("resize", updateSlideWidth);
        return () => window.removeEventListener("resize", updateSlideWidth);
    }, []);

    // Scroll logic
    const checkScroll = () => {
        if (!carouselRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
        setScrollProgress(progress);
    };

    const scrollLeft = () => {
        if (carouselRef.current) {
        const card = carouselRef.current.querySelector(".snap-center");
        if (!card) return;
        carouselRef.current.scrollBy({ left: -card.offsetWidth, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
        const card = carouselRef.current.querySelector(".snap-center");
        if (!card) return;
        carouselRef.current.scrollBy({ left: card.offsetWidth, behavior: "smooth" });
        }
    };

    // Arrow key navigation
    const handleKeyDown = (event) => {
        if (event.key === "ArrowLeft") scrollLeft();
        else if (event.key === "ArrowRight") scrollRight();
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        checkScroll();
        carousel.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
        return () => {
        carousel.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        };
    }, []);

    useEffect(() => {
        if (hovered) window.addEventListener("keydown", handleKeyDown);
        else window.removeEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hovered]);

    // Drag handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeftStart(carouselRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = x - startX;
        carouselRef.current.scrollLeft = scrollLeftStart - walk;
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeaveDrag = () => setIsDragging(false);

    return (
        <div className="relative flex flex-col items-center py-20 px-6 md:px-60 bg-gray-100">
        {/* Navigation Buttons */}
        {/* Left Arrow */}
    {canScrollLeft && (
    <button
        onClick={scrollLeft}
        className="absolute top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-indigo-500 hover:text-white transition
                left-2 md:left-50"
    >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
    </button>
    )}

    {/* Right Arrow */}
    {canScrollRight && (
    <button
        onClick={scrollRight}
        className="absolute top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-indigo-500 hover:text-white transition
                right-2 md:right-50"
    >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </button>
    )}


        {/* Carousel */}
        <div
            ref={carouselRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
            setHovered(false);
            handleMouseLeaveDrag();
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="flex overflow-x-auto w-full scroll-smooth snap-x snap-mandatory scrollbar-hide cursor-grab"
        >
            {slides.map((slide, index) => (
    <div
        key={index}
        className="flex-shrink-0 snap-center px-2"
        style={{ width: `${slideWidthPercent}%`, height: `${slideHeight}px` }}
    >
        {slide.type === "dualCard" ? (
  isMobile ? (
  // Mobile view:
  (() => {
    const imageCard = slide.cards.find(card => card.imageUrl);
    const textCard = slide.cards.find(card => card.type === "text");
    return (
      <div
        className="relative w-full h-full rounded-lg overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(${imageCard?.imageUrl || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* THIS IS THE DIV THAT HAS BEEN CHANGED */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center p-4 text-white text-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <h3 className="text-lg sm:text-xl font-bold mb-2">{textCard?.title || "Title"}</h3>
          <p className="text-xs sm:text-sm">{textCard?.description || "Description"}</p>
          <button className="mt-4 px-4 py-2 bg-white text-black rounded font-semibold text-xs sm:text-sm">
            {textCard?.buttonText || "Button"}
          </button>
        </div>
      </div>
    );
  })()
) : (
    // Desktop / Tablet view: (NO CHANGE NEEDED HERE)
    <div className="grid grid-rows-2 gap-4 w-full h-full">
      {slide.cards.map((card, cardIndex) => (
        <div
          key={card.id || cardIndex}
          className="rounded-lg overflow-hidden shadow-lg"
          style={{ backgroundColor: card.type === "text" ? card.backgroundColor : undefined }}
        >
          {card.type === "text" ? (
            <div className="p-4 sm:p-6 h-full flex flex-col justify-between text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{card.title}</h3>
              <p className="text-xs sm:text-sm md:text-base">{card.description}</p>
              <button className="mt-4 px-3 py-1 sm:px-4 sm:py-2 bg-white text-black rounded font-semibold self-start text-xs sm:text-sm">
                {card.buttonText}
              </button>
            </div>
          ) : (
            <img
              src={card.imageUrl}
              alt={`Image for ${card.title || "service"}`}
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          )}
        </div>
      ))}
    </div>
  )
) : (
    // Other slide types
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
        <img
        src={slide.cards[0].imageUrl}
        alt="Full service image"
        className="w-full h-full object-cover select-none"
        draggable={false}
        />
    </div>
    )}

    </div>
    ))}

        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-7xl h-2 bg-gray-300 rounded-full mt-4 overflow-hidden">
            <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
            ></div>
        </div>
        </div>
    );
    }

    export default HealthServices;
