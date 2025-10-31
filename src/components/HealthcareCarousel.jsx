import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { ChevronRight, ChevronLeft } from 'lucide-react'; // Using Lucide for the arrow icons

function HealthcareCarousel({ attributes, useEditor = false, onSlideClick = () => {} }) {
    const {
        blockId,
        caption,
        captionFontSize,
        captionLineHeight,
        captionPadding,
        captionAlign,
        captionBold,
        captionItalics,
        captionUnderline,
        titleOne,
        titleTwo,
        titleFontSize,
        titleLineHeight,
        titlePadding,
        titleAlign,
        titleBold,
        titleItalics,
        titleUnderline,
        captionColor,
        titleColor,
        backgroundColor,
        padding,
        mobilePadding,
        slideGap,
        minSlidesToShow,
        scrollSpeed,
        slides = [],
        reviewedEntityType,
        reviewedEntityName,

        slideWidth,
        slideImageHeight,
        slideBackgroundColor,
        slideBorderRadius,
        slideContentPadding, 
        slideContentGap,      
        slideTextContentGap,  

        slideTitleColor,
        slideTitleFontSize,
        slideTitleLineHeight,
        slideTitleBold,

        slideAddressColor,
        slideAddressFontSize,
        slideAddressLineHeight,
        slideAddressBold,

        slidePhoneColor,
        slidePhoneFontSize,
        slidePhoneLineHeight,
        slidePhoneBold,

        slideLinkColor,
        slideLinkHoverColor,
        slideLinkFontSize,
        slideLinkBold,
        
        slideBoxShadow,
        slideHoverBoxShadow,
        slideHoverScale,
        slideImageOverlayColor,
        enableAutoScroll,
        animationType,
    } = attributes;

    const scrollRef = useRef(null); 

    // Dynamic aspect ratio calculation simplified
    const effectiveSlideHeight = slideImageHeight + 
                                (slideContentPadding ? (slideContentPadding.top || 0) + (slideContentPadding.bottom || 0) : 0) +
                                ((slideTitleFontSize || 22) * (slideTitleLineHeight || 1.3) + (slideAddressFontSize || 16) * (slideAddressLineHeight || 1.5) * 2 + (slidePhoneFontSize || 18) * (slidePhoneLineHeight || 1.5)) * 1.5; 

    const presetSlideWidth = 320; 
    const aspectRatio = effectiveSlideHeight / presetSlideWidth; 

    const [dimensions, setDimensions] = useState({
        cardWidth: slideWidth || presetSlideWidth,
        cardHeight: (slideWidth || presetSlideWidth) * aspectRatio,
        fontScale: 1,
    });
    
    // State to track hover *and* focus
    const [activeSlide, setActiveSlide] = useState(null);
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // State to track whether the component is mounted to trigger the initial animation
    const [isMounted, setIsMounted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftStart, setScrollLeftStart] = useState(0);


    // Mouse down
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftStart(scrollRef.current.scrollLeft);
    };

    // Mouse leave / mouse up
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    // Mouse move
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // drag speed multiplier
        scrollRef.current.scrollLeft = scrollLeftStart - walk;
    };

    // Touch events for mobile
    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
        setScrollLeftStart(scrollRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeftStart - walk;
    };

    const handleTouchEnd = () => setIsDragging(false);

    
    // --- Utils ---
    const getBoxModelString = useCallback((obj) =>
        obj ? `${obj.top}px ${obj.right}px ${obj.bottom}px ${obj.left}px` : "0px",
    [], );

    const getScaledBoxModelString = useCallback((obj, scale = 1) => {
        if (!obj) return "0px";
        const top = (obj.top || 0) * scale;
        const right = (obj.right || 0) * scale;
        const bottom = (obj.bottom || 0) * scale;
        const left = (obj.left || 0) * scale;
        return `${top}px ${right}px ${bottom}px ${left}px`;
    }, []);

    const getBorderRadiusString = useCallback((obj) =>
        obj
            ? `${obj.topLeft}px ${obj.topRight}px ${obj.bottomRight}px ${obj.bottomLeft}px`
            : "0px",
    [], );

    const getValidColor = useCallback((color) => {
        if (!color || typeof color !== "string" || color.trim() === "") return "transparent";
        const isHex = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color.trim());
        const isRGB = /^rgb(a)?\([\d\s.,%]+\)$/.test(color.trim());
        const isGradient = /gradient\((.|\s)*\)/.test(color.trim());
        const isNamed = /^[a-zA-Z]+$/.test(color.trim());
        if (color.trim() === "transparent" || isHex || isRGB || isGradient || isNamed) {
            return color.trim();
        }
        return "transparent";
    }, []);

    // --- Navigation Logic ---
    const scroll = useCallback((direction) => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        // Calculate movement based on one card width + gap
        const cardMove = dimensions.cardWidth + slideGap;
        const currentScroll = scrollElement.scrollLeft;
        let newScroll;

        if (direction === 'next') {
            newScroll = currentScroll + cardMove;
        } else {
            newScroll = currentScroll - cardMove;
        }
        
        scrollElement.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
    }, [dimensions.cardWidth, slideGap]);

    // 1. Mobile/Responsive Check
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setIsMobile(entry.contentRect.width <= 768);
            }
        });
        observer.observe(containerRef.current);

        // Set mounted true after initial render cycle
        const timeout = setTimeout(() => setIsMounted(true), 100);

        return () => {
            observer.disconnect();
            clearTimeout(timeout);
        };
    }, []);

    // 2. Card Dimensions Calculation (Scaling logic)
    useEffect(() => {
        const updateDimensions = () => {
            const containerWidth = containerRef.current?.offsetWidth || 0;
            if (containerWidth === 0) return;

            const userSetWidth = slideWidth || presetSlideWidth;
            const fullSlideWidth = userSetWidth;
            
            const totalGapWidth = (minSlidesToShow - 1) * slideGap;
            const baseRequiredWidth = fullSlideWidth * minSlidesToShow + totalGapWidth;

            let newDims;
            if (containerWidth < baseRequiredWidth) {
                const availableSlideSpace = containerWidth - totalGapWidth;
                const adjustedWidth = availableSlideSpace / minSlidesToShow;
                const fontScale = adjustedWidth / presetSlideWidth;

                newDims = {
                    cardWidth: adjustedWidth,
                    cardHeight: adjustedWidth * aspectRatio,
                    fontScale: Math.max(0.6, fontScale), 
                };
            } else {
                newDims = {
                    cardWidth: fullSlideWidth,
                    cardHeight: fullSlideWidth * aspectRatio,
                    fontScale: 1,
                };
            }
            setDimensions(newDims);
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [minSlidesToShow, slideGap, slideWidth, aspectRatio]);

    // 3. Auto-Scrolling Logic (Conditional based on enableAutoScroll)
    useEffect(() => {
        if (!enableAutoScroll) return;
        
        const autoScroll = (ref) => {
            let scrollPos = 0;
            const step = scrollSpeed;
            let animationFrameId;

            const scroll = () => {
                if (ref.current) {
                    // Check if user has manually scrolled and update scrollPos
                    if (ref.current.scrollLeft !== scrollPos) {
                        scrollPos = ref.current.scrollLeft;
                    }
                    const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;

                    // Scroll left
                    scrollPos += step;
                    if (scrollPos >= maxScroll) {
                        scrollPos = 0; // Seamless loop reset
                    }
                    
                    ref.current.scrollLeft = scrollPos;
                }
                animationFrameId = requestAnimationFrame(scroll);
            };

            scroll();
            return () => cancelAnimationFrame(animationFrameId);
        };

        const cancelScroll1 = autoScroll(scrollRef);

        return () => {
            cancelScroll1();
        };
    }, [scrollSpeed, enableAutoScroll]);

    // 4. Mouse Wheel + Keyboard Controls Fix
    useEffect(() => {
        const carousel = scrollRef.current;
        if (!carousel) return;

        // 🖱 Smooth horizontal scroll for mouse wheel / trackpad
        const handleWheel = (e) => {
            const rect = carousel.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (!inside) return;

            e.preventDefault();

            // Scroll horizontally even when user scrolls vertically
            const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
            carousel.scrollBy({
                left: delta * 1.1, // Sensitivity multiplier
                behavior: "smooth",
            });
        };

        // ⌨️ Global Arrow Key Control
        const handleKeyDown = (e) => {
            // Only trigger if carousel is visible on screen
            const rect = carousel.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;

            if (e.key === "ArrowRight") {
                e.preventDefault();
                carousel.scrollBy({ left: 350, behavior: "smooth" });
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                carousel.scrollBy({ left: -350, behavior: "smooth" });
            }
        };

        carousel.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            carousel.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    
    // 5. Looped Items Memoization (Used for the smooth infinite scroll effect)
    const loopedItems = useMemo(() => {
        return enableAutoScroll ? [...slides, ...slides] : slides;
    }, [slides, enableAutoScroll]);

    // 6. Schema Markup Injection (Unchanged)
    useEffect(() => {
        if (useEditor || !blockId || slides.length === 0) return;
        
        const blockSlug = "scd-hospital-carousel"; 
        const existingScriptId = `${blockSlug}-schema-${blockId}`;

        if (document.getElementById(existingScriptId)) return;

        const itemListElements = slides.map((slide, index) => {
            const placeSchema = {
                "@type": "Hospital", 
                name: slide.title,
                address: {
                    "@type": "PostalAddress",
                    streetAddress: slide.addressLine1,
                    addressLocality: slide.addressLine2?.split(',')[0]?.trim(), 
                    addressRegion: slide.addressLine2?.split(',')[1]?.trim(), 
                    postalCode: slide.addressLine2?.split('–')[1]?.trim(), 
                    addressCountry: "IN", 
                },
                telephone: slide.phone,
                url: slide.link,
                image: slide.image,
                ...(slide.rating && {
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": slide.rating,
                        "reviewCount": 10 
                    }
                })
            };

            return {
                "@type": "ListItem",
                position: index + 1,
                item: placeSchema,
            };
        });

        const schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name:
                [titleOne, titleTwo].filter(Boolean).join(" ") ||
                "Healthcare Providers Network",
            description:
                "A list of leading hospitals and healthcare facilities in our network.",
            itemListElement: itemListElements,
        };

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = existingScriptId;
        document.head.appendChild(script);
        script.innerHTML = JSON.stringify(schema, null, 2);

        return () => {
            const scriptTag = document.getElementById(existingScriptId);
            if (scriptTag) scriptTag.remove();
        };
    }, [
        slides,
        titleOne,
        titleTwo,
        reviewedEntityType, 
        reviewedEntityName,
        blockId,
        useEditor,
    ]);

    // --- Rendering ---
    return (
        <div
            ref={containerRef}
            className="font-sans antialiased text-gray-800 transition-all duration-300"
            style={{
                background: getValidColor(backgroundColor),
                padding: getBoxModelString(isMobile ? mobilePadding : padding),
                minWidth: '100%'
            }}
        >
            <div className="w-full flex flex-col items-center justify-center max-w-7xl mx-auto">
                {/* Header Section (Unchanged) */}
                {(caption || titleOne || titleTwo) && (
                    <div className="w-full flex flex-col items-center justify-center mb-10">
                        {caption && (
                            <h3
                                className="uppercase tracking-wide text-center"
                                style={{
                                    fontWeight: captionBold ? "bold" : "normal",
                                    fontStyle: captionItalics ? "italic" : "normal",
                                    textDecoration: captionUnderline ? "underline" : "none",
                                    fontSize: `${captionFontSize * dimensions.fontScale}px`,
                                    lineHeight: captionLineHeight,
                                    padding: getScaledBoxModelString(captionPadding, dimensions.fontScale),
                                    color: captionColor || "#6B7280",
                                }}
                            >
                                {caption}
                            </h3>
                        )}

                        {(titleOne || titleTwo) && (
                            <h2
                                className="text-center"
                                style={{
                                    fontWeight: titleBold ? "bold" : "normal",
                                    fontStyle: titleItalics ? "italic" : "normal",
                                    textDecoration: titleUnderline ? "underline" : "none",
                                    fontSize: `${titleFontSize * dimensions.fontScale}px`,
                                    lineHeight: titleLineHeight,
                                    padding: getScaledBoxModelString(titlePadding, dimensions.fontScale),
                                    color: titleColor || "#111827",
                                }}
                            >
                                {titleOne} {titleOne && titleTwo && <br className="sm:hidden" />} {titleTwo}
                            </h2>
                        )}
                    </div>
                )}
            </div>

            {/* Carousel Track - Now Single Row with Navigation */}
            <div
                className="w-full max-w-7xl mx-auto relative" 
            >
                <div // Outer wrapper for single track
                    key={"single-track"}
                    className="relative w-full overflow-hidden"
                >
                    <div
                        ref={scrollRef}
                        className="flex whitespace-nowrap will-change-scroll"
                        tabIndex={0}
                        style={{
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            overflowX: "scroll",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            gap: `${dimensions.fontScale * slideGap}px`,
                            scrollSnapType: 'x mandatory',
                            userSelect: isDragging ? 'none' : 'auto', 
                            WebkitUserSelect: isDragging ? 'none' : 'auto', 
                            msUserSelect: isDragging ? 'none' : 'auto', 
                            cursor: isDragging ? 'grabbing' : 'grab', 
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >


                        {/* Slides */}
                        {loopedItems.map((item, idx) => {
                            const uniqueKey = `${blockId}-slide-0-${idx}`;
                            
                            // Check if the current slide is hovered OR focused
                            const isActive = activeSlide === uniqueKey;
                            
                            // NEW: Animation Style
                            const animationStyle = (() => {
                                if (!isMounted) {
                                    if (animationType === "slide-right") {
                                        return { opacity: 0, transform: 'translateX(50px)' };
                                    } else {
                                        return { opacity: 0, transform: 'translateY(20px)' };
                                    }
                                } else {
                                    if (animationType === "slide-right") {
                                        return {
                                            opacity: 1,
                                            transform: 'translateX(0)',
                                            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                                            transitionDelay: `${idx * 0.15}s`,
                                        };
                                    } else {
                                        return {
                                            opacity: 1,
                                            transform: 'translateY(0)',
                                            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                                            transitionDelay: `${idx * 0.15}s`,
                                        };
                                    }
                                }
                            })();


                            return (
                                <div // Outer wrapper, maintains size and handles keyboard focus/hover states
                                    key={uniqueKey}
                                    tabIndex={0} // Make the slide focusable
                                    className="focus:outline-none" // Tailwind utility to hide default focus ring
                                    role="group" // Useful for accessibility
                                    onMouseEnter={() => setActiveSlide(uniqueKey)}
                                    onMouseLeave={() => setActiveSlide(null)}
                                    onFocus={() => setActiveSlide(uniqueKey)}
                                    onBlur={() => setActiveSlide(null)}
                                    style={{
                                        ...animationStyle, // Apply entrance animation
                                        flex: "0 0 auto",
                                        width: `${dimensions.cardWidth}px`,
                                        minWidth: `${dimensions.cardWidth}px`,
                                        minHeight: `${dimensions.cardWidth * aspectRatio}px`,
                                        scrollSnapAlign: 'start',
                                        transition: animationStyle.transition, // Only include entrance transition here
                                    }}
                                    onClick={(e) => {
                                        if (useEditor && !isDragging) {
                                            e.preventDefault();
                                            onSlideClick(idx % slides.length);
                                        }
                                    }}
                                >
                                    {/* Inner Card - Applies the Active Animation */}
                                    <a // Use an anchor tag for semantic linking, and apply animation styles here
                                        href={useEditor ? "#" : item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block h-full w-full"
                                        style={{
                                            borderRadius: getBorderRadiusString(slideBorderRadius),
                                            background: getValidColor(slideBackgroundColor) || '#FFFFFF',
                                            boxShadow: isActive ? slideHoverBoxShadow : slideBoxShadow, 
                                            // Focus Card Animation: Lift the card when active (hovered OR focused)
                                            transform: isActive ? 'translateY(-5px)' : 'translateY(0)',
                                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 
                                            willChange: 'transform, box-shadow',
                                            overflow: "hidden", 
                                            display: "flex",
                                            flexDirection: "column",
                                            position: "relative",
                                        }}
                                    >
                                        {/* Hospital Image */}
                                        {item.image && (
                                            <div
                                                className="w-full bg-gray-100 overflow-hidden relative" 
                                                style={{ height: `${slideImageHeight * dimensions.fontScale}px` }}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.imgAlt || item.title}
                                                    className="w-full h-full object-cover transition-transform duration-300"
                                                    onError={(e) => (e.target.style.display = 'none')}
                                                     draggable={false} 

                                                />
                                                {/* Image Overlay */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        background: slideImageOverlayColor,
                                                        pointerEvents: 'none', 
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Main Content Area */}
                                        <div
                                            className="flex-grow flex flex-col justify-between"
                                            style={{
                                                padding: getScaledBoxModelString(slideContentPadding, dimensions.fontScale),
                                                gap: `${slideContentGap * dimensions.fontScale}px`,
                                            }}
                                        >
                                            <div>
                                                {/* Title */}
                                                {item.title && (
                                                    <div className="flex flex-col gap-1">
                                                        <h3
                                                            style={{
                                                                fontWeight: slideTitleBold ? "bold" : "normal",
                                                                fontSize: `${slideTitleFontSize * dimensions.fontScale}px`,
                                                                lineHeight: slideTitleLineHeight,
                                                                color: slideTitleColor || "#1F2937",
                                                                margin: 0,
                                                                whiteSpace: "normal",
                                                            }}
                                                        >
                                                            {item.title}
                                                        </h3>

                                                        {/* Animated Rating Stars (Unchanged) */}
                                                        {item.rating && (
                                                            <div
                                                                className="flex items-center gap-1 mt-1"
                                                                style={{
                                                                    opacity: isMounted ? 1 : 0,
                                                                    transform: isMounted ? "translateY(0px)" : "translateY(10px)",
                                                                    transition: "opacity 0.5s ease, transform 0.5s ease",
                                                                }}
                                                            >
                                                                {Array.from({ length: 5 }, (_, index) => {
                                                                    const filled = index + 1 <= Math.floor(item.rating);
                                                                    const halfFilled = item.rating - index > 0 && item.rating - index < 1;
                                                                    return (
                                                                        <svg
                                                                            key={index}
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            className="w-5 h-5 transition-transform duration-300"
                                                                            style={{
                                                                                fill: filled
                                                                                    ? "#FBBF24"
                                                                                    : halfFilled
                                                                                    ? "url(#halfGradient)"
                                                                                    : "#E5E7EB",
                                                                                transform: filled || halfFilled ? "scale(1.1)" : "scale(1)",
                                                                            }}
                                                                        >
                                                                            {/* Gradient for half star */}
                                                                            {halfFilled && (
                                                                                <defs>
                                                                                    <linearGradient id="halfGradient">
                                                                                        <stop offset="50%" stopColor="#FBBF24" />
                                                                                        <stop offset="50%" stopColor="#E5E7EB" />
                                                                                    </linearGradient>
                                                                                </defs>
                                                                            )}
                                                                            <path d="M12 .587l3.668 7.431L24 9.753l-6 5.847 1.417 8.268L12 19.771l-7.417 4.097L6 15.6 0 9.753l8.332-1.735z" />
                                                                        </svg>
                                                                    );
                                                                })}
                                                                <span
                                                                    className="text-gray-600 text-sm ml-1"
                                                                    style={{ fontSize: `${13 * dimensions.fontScale}px` }}
                                                                >
                                                                    ({item.rating.toFixed(1)})
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Address & Phone (Unchanged) */}
                                                <div
                                                    className="mt-2"
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: `${slideTextContentGap * dimensions.fontScale}px`,
                                                    }}
                                                >
                                                    {item.addressLine1 && (
                                                        <p
                                                            style={{
                                                                fontWeight: slideAddressBold ? "bold" : "normal",
                                                                fontSize: `${slideAddressFontSize * dimensions.fontScale}px`,
                                                                lineHeight: slideAddressLineHeight,
                                                                color: slideAddressColor || "#4B5563",
                                                                margin: 0,
                                                                whiteSpace: 'normal',
                                                            }}
                                                        >
                                                            {item.addressLine1}
                                                        </p>
                                                    )}
                                                    {item.addressLine2 && (
                                                        <p
                                                            style={{
                                                                fontWeight: slideAddressBold ? "bold" : "normal",
                                                                fontSize: `${slideAddressFontSize * dimensions.fontScale}px`,
                                                                lineHeight: slideAddressLineHeight,
                                                                color: slideAddressColor || "#4B5563",
                                                                margin: 0,
                                                                whiteSpace: 'normal',
                                                            }}
                                                        >
                                                            {item.addressLine2}
                                                        </p>
                                                    )}
                                                    {item.phone && (
                                                        <p
                                                            style={{
                                                                fontWeight: slidePhoneBold ? "bold" : "normal",
                                                                fontSize: `${slidePhoneFontSize * dimensions.fontScale}px`,
                                                                lineHeight: slidePhoneLineHeight,
                                                                color: slidePhoneColor || "#1F2937",
                                                                margin: `${slideTextContentGap * dimensions.fontScale * 0.5}px 0 0`, 
                                                                whiteSpace: 'normal',
                                                            }}
                                                        >
                                                            {item.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Know More Link (Unchanged) */}
                                            {item.link && item.linkText && (
                                                <div className="mt-4 self-start">
                                                     <span // Use a span wrapper to prevent link focus/click when dragging
                                                        onClick={(e) => isDragging && e.preventDefault()}
                                                     >
                                                        <a
                                                            href={useEditor ? "#" : item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center group" 
                                                            style={{
                                                                textDecoration: "none",
                                                                color: slideLinkColor || "#A020F0",
                                                                fontWeight: slideLinkBold ? "bold" : "normal",
                                                                fontSize: `${slideLinkFontSize * dimensions.fontScale}px`,
                                                                transition: 'color 0.2s ease-in-out',
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = slideLinkHoverColor || "#8B008B"}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = slideLinkColor || "#A020F0"}
                                                        >
                                                            {item.linkText}
                                                            <ChevronRight
                                                                size={slideLinkFontSize * dimensions.fontScale * 1.2}
                                                                className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
                                                                style={{ color: 'inherit' }} 
                                                            />
                                                        </a>
                                                     </span>
                                                </div>
                                            )}
                                        </div>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Navigation Buttons (Unchanged) */}
                <button
                    onClick={() => scroll('prev')}
                    className="absolute z-10 p-3 rounded-full shadow-lg transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    style={{ 
                        top: '50%', 
                        left: isMobile ? '8px' : '-24px', 
                        transform: 'translateY(-50%)',
                        backgroundColor: 'transparent', 
                        pointerEvents: 'auto',
                    }}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} color="#A020F0" />
                </button>

                <button
                    onClick={() => scroll('next')}
                    className="absolute z-10 p-3 rounded-full shadow-lg transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    style={{ 
                        top: '50%', 
                        right: isMobile ? '8px' : '-24px', 
                        transform: 'translateY(-50%)',
                        backgroundColor: 'transparent', 
                        pointerEvents: 'auto',
                    }}
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} color="#A020F0" />
                </button>

            </div>
        </div>
    );
}

export default HealthcareCarousel;