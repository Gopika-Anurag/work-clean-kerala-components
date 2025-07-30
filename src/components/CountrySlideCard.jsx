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

		// 🛠 Run once layout is ready
		requestAnimationFrame(updateDimensions);

		// 🔁 Update on resize
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
    useEffect(() => {
		const slider = scrollRef.current;
		if (!slider) return;
		const handleScroll = () => {
			const maxScroll = slider.scrollWidth - slider.clientWidth;
			setProgress(maxScroll > 0 ? (slider.scrollLeft / maxScroll) * 100 : 0);
		};
		slider.addEventListener("scroll", handleScroll);
		return () => slider.removeEventListener("scroll", handleScroll);
	}, []);

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


return (
    <div className="w-full " style={{
        paddingLeft:"12%",
        paddingRight:"12%"
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
    ref={scrollRef}
    className="flex overflow-x-auto gap-4 p-4 no-scrollbar"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    style={{ paddingBottom: `${80 * dimensions.fontScale}px` }} // Add bottom padding to make space for tooltips

  >
    {slides.map((item, index) => (
  <div
    key={index}
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
className="relative overflow-visible w-full rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] rounded-br-[10px] shadow-md"
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

    {/* 🔥 Dark Hover Gradient Overlay */}
    <div className="absolute top-0 left-0 w-full h-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-black/40 rounded-[10px]
    " />
  </>
)}


    </div>
{/* Flag - Top Right Corner */}
{item.flag && (
  <div
  className="absolute top-2 right-2 z-10 bg-white/70 rounded-full p-1"
  style={{
    width: `${Math.max(30 * dimensions.fontScale, 20)}px`,
    height: `${Math.max(30 * dimensions.fontScale, 20)}px`,
  }}
>
    <img
      src={item.flag}
      alt={`${item.title} flag`}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
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
      <div className="absolute top-full mt-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="relative bg-white border border-blue-300 rounded-lg shadow-lg p-4 w-[260px] text-center">
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-blue-300 rotate-45" />
          
          {/* Content */}
          <p
            className="text-gray-800 mb-3 leading-snug"
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
              padding: `${8 * dimensions.fontScale}px ${20 * dimensions.fontScale}px`,
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
  </div> // <-- Close outer container
); // <-- Final closing of return

};

export default CountrySlideCard;
