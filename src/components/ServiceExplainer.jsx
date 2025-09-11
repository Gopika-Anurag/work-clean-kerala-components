// src/components/ServiceExplainer.jsx
// This file will contain the React component.

import React, { useCallback, useEffect, useRef, useState } from "react";
import serviceExplainerData from "../data/serviceExplainerData";

function ServiceExplainer() {
	const {
		blockId,
		cards = [],
		slideGap,
		backgroundColor,
		title,
		subtitle,
		minSlidesToShow,
		autoScrolling,
		buttonSize,
		progressbarColor,
		progressbar,
	} = serviceExplainerData;

	// Base dimensions for different aspect ratios
	const baseCardDimensions = {
		portrait: { width: 300, height: 450 },
		square: { width: 300, height: 300 },
		landscape: { width: 400, height: 390 },
	};
	
	const scrollRef = useRef(null);

	const [progress, setProgress] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const autoScrollInterval = useRef(null);
const [hoveredArrow, setHoveredArrow] = useState(null);
const [hoveredCard, setHoveredCard] = useState(null);



	const [dimensions, setDimensions] = useState({
		fontScale: 1,
		maxCardHeight: 0,
	});

	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	// Get scaled dimensions for a specific card
	const getScaledCardDimensions = useCallback((cardAspectRatio, currentFontScale) => {
		const base = baseCardDimensions[cardAspectRatio] || baseCardDimensions.square;
		return {
			width: base.width * currentFontScale,
			height: base.height * currentFontScale,
		};
	}, [baseCardDimensions]);

	// Update slide dimensions and container height dynamically
	useEffect(() => {
		const updateDimensions = () => {
			const containerWidth = scrollRef.current?.offsetWidth || 0;
			if (!containerWidth || cards.length === 0) return;

			// Calculate font scale based on average card width to fit minSlidesToShow
			const averageBaseWidth = Object.values(baseCardDimensions).reduce((sum, d) => sum + d.width, 0) / Object.keys(baseCardDimensions).length;
			const baseRequiredWidth = averageBaseWidth * minSlidesToShow + (minSlidesToShow - 1) * slideGap;
			let currentFontScale = 1;
			if (containerWidth < baseRequiredWidth) {
				currentFontScale = (containerWidth - (minSlidesToShow - 1) * slideGap) / (averageBaseWidth * minSlidesToShow);
			}

			// Determine the maximum height among all scaled cards
			const newMaxCardHeight = Math.max(
				...cards.map(card => getScaledCardDimensions(card.aspectRatio, currentFontScale).height)
			);

			setDimensions(prev => ({
				...prev,
				fontScale: currentFontScale,
				maxCardHeight: newMaxCardHeight,
			}));
		};

		requestAnimationFrame(updateDimensions);
		window.addEventListener("resize", updateDimensions);

		return () => {
			window.removeEventListener("resize", updateDimensions);
		};
	}, [minSlidesToShow, slideGap, cards, getScaledCardDimensions, baseCardDimensions]);
	
	// Get scroll distance for varied-width cards
	const getScrollDistance = useCallback((direction) => {
  if (!scrollRef.current) return 0;

  const currentScrollLeft = scrollRef.current.scrollLeft;

  if (direction === 'right') {
    let accumulatedWidth = 0;
    for (let i = 0; i < cards.length; i++) {
      const cardWidth = getScaledCardDimensions(cards[i].aspectRatio, dimensions.fontScale).width;
      const cardStart = accumulatedWidth;
      accumulatedWidth += cardWidth + slideGap * dimensions.fontScale;

      if (cardStart > currentScrollLeft) {
        return cardStart - currentScrollLeft;
      }
    }
    return accumulatedWidth - currentScrollLeft;
  } else {
    // LEFT
    let accumulatedWidth = 0;
    let lastStart = 0;
    for (let i = 0; i < cards.length; i++) {
      const cardWidth = getScaledCardDimensions(cards[i].aspectRatio, dimensions.fontScale).width;
      const cardStart = accumulatedWidth;
      accumulatedWidth += cardWidth + slideGap * dimensions.fontScale;

      if (cardStart >= currentScrollLeft) {
        return currentScrollLeft - lastStart;
      }
      lastStart = cardStart;
    }
    return currentScrollLeft; // fallback
  }
}, [cards, dimensions.fontScale, slideGap, getScaledCardDimensions]);


	const scrollLeft = useCallback(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
				left: -getScrollDistance('left'),
				behavior: "smooth",
			});
		}
	}, [getScrollDistance]);

	const scrollRight = useCallback(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
				left: getScrollDistance('right'),
				behavior: "smooth",
			});
		}
	}, [getScrollDistance]);

	const handleMouseDown = (e) => {
		setIsDragging(true);
		setStartX(e.pageX - scrollRef.current.offsetLeft);
		setScrollPosition(scrollRef.current.scrollLeft);
	};

	useEffect(() => {
		let animationFrameId = null;
		const smoothScroll = (target) => {
			if (!scrollRef.current) return;
			const start = scrollRef.current.scrollLeft;
			const change = target - start;
			let startTime = null;
			const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
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
		const handleMouseMove = (e) => {
			if (!isDragging || !scrollRef.current) return;
			e.preventDefault();
			const x = e.pageX - scrollRef.current.offsetLeft;
			const avgCardWidth = cards.length > 0 ? cards.reduce((sum, card) => sum + getScaledCardDimensions(card.aspectRatio, dimensions.fontScale).width, 0) / cards.length : 400;
			const scale = avgCardWidth / baseCardDimensions.square.width;
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
	}, [isDragging, startX, scrollPosition, dimensions.fontScale, cards, getScaledCardDimensions, baseCardDimensions]);

	const handleMouseUp = () => {
		setIsDragging(false);
	};
	
	useEffect(() => {
		const scrollContainer = scrollRef.current;
		if (!scrollContainer) return;
		const isTrackpad = (e) => Math.abs(e.deltaY) < 50 && e.deltaMode === 0;
		const handleWheelScroll = (e) => {
			if (!isHovered) return;
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
			const atStart = scrollLeft <= 0;
			const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;
			if (isTrackpad(e)) {
				if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
					if ((e.deltaX < 0 && !atStart) || (e.deltaX > 0 && !atEnd)) {
						scrollContainer.scrollLeft += e.deltaX;
						e.preventDefault();
					}
				}
			} else {
				const avgCardWidth = cards.length > 0 ? cards.reduce((sum, card) => sum + getScaledCardDimensions(card.aspectRatio, dimensions.fontScale).width, 0) / cards.length : 400;
				const scrollAmount = (e.deltaX || e.deltaY) > 0 ? avgCardWidth : -avgCardWidth;
				if ((e.deltaY < 0 && !atStart) || (e.deltaY > 0 && !atEnd)) {
					scrollContainer.scrollBy({
						left: scrollAmount,
						behavior: "smooth",
					});
					e.preventDefault();
				}
			}
		};
		scrollContainer.addEventListener("wheel", handleWheelScroll, { passive: false });
		return () => {
			scrollContainer.removeEventListener("wheel", handleWheelScroll);
		};
	}, [isHovered, dimensions, slideGap, cards, getScaledCardDimensions]);
	
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
	}, [dimensions, cards]);

	useEffect(() => {
		if (!autoScrolling || cards.length <= 3) return;
		const startAutoScroll = () => {
			if (autoScrollInterval.current) return;
			autoScrollInterval.current = setInterval(() => {
				if (!isHovered && !isDragging) {
					if (scrollRef.current) {
						scrollRef.current.scrollBy({
							left: getScrollDistance('right'),
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
		dimensions.fontScale,
		slideGap,
		cards.length,
		getScrollDistance,
	]);

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
	
	const getValidColor = (color) => {
		const valid =
			/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color) ||
			/^rgb(a)?\([\d\s.,%]+\)$/.test(color) ||
			/gradient\((.|\s)*\)/.test(color) ||
			/^[a-zA-Z]+$/.test(color) ||
			color === "transparent";
		return valid ? color : "#ffffff";
	};

	const getValidColorForFade = (color) => {
		if (!color || typeof color !== "string" || color === "transparent")
			return "rgba(0, 0, 0, 0)";
		const hexToRgb = (hex) => {
			const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result
				? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, 0.8)`
				: "rgba(255, 255, 255, 0.7)";
		};
		if (color.startsWith("#")) return hexToRgb(color);
		if (color.startsWith("rgb")) return color.replace(")", ", 0.8)");
		return "rgba(255, 255, 255, 0.7)";
	};

	return (
		<div
			className="relative select-none"
			style={{
				background: getValidColor(backgroundColor),
				paddingTop: `${100 * dimensions.fontScale * 0.8}px`,
				paddingBottom: `${80 * dimensions.fontScale * 0.8}px`,
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				handleMouseUp();
				setIsHovered(false);
			}}
		>
            <p
	className="text-center font-bold"
	style={{
		fontSize: `${14 * dimensions.fontScale * 0.8}px`,
		letterSpacing: '2px',
		color: '#6c63ff',
		textTransform: 'uppercase',
		marginBottom: `${10 * dimensions.fontScale * 0.8}px`,
	}}
>
	WHAT WE DO
</p>
			<h2
    className="font-bold text-center px-4 sm:px-6"
    style={{
        fontSize: `${40 * dimensions.fontScale * 0.8}px`, // default size
        lineHeight: 1.3,
        color: "#000",
        marginBottom: `${10 * dimensions.fontScale * 0.8}px`,
    }}
>
    Elevate Your Business with <br className="hidden sm:block" /> Our Product & Service Explainer Videos
</h2>


			<p
				className="text-center"
				style={{
					fontSize: `${18 * dimensions.fontScale * 0.8}px`,
					marginBottom: `${60 * dimensions.fontScale * 0.8}px`,
					color: "#555",
				}}
			>
				{subtitle}
			</p>

			<div
				className="relative w-full"
				style={{
					minHeight: `${dimensions.maxCardHeight + 40 * dimensions.fontScale * 0.8}px`,
					overflow: "visible",
					paddingLeft:
						minSlidesToShow >= cards.length ? `${30 * dimensions.fontScale * 0.8}px` : "0px",
					paddingRight:
						minSlidesToShow >= cards.length ? `${30 * dimensions.fontScale * 0.8}px` : "0px",
				}}
			>
				{canScrollLeft && (
					<button
						onClick={scrollLeft}
						className="text-gray-800 carousel-button carousel-button-left hover:scale-110 focus:outline-none transition-transform duration-200"
						aria-label="Scroll left"
						style={{
							position: "absolute",
							left: 0,
							top: "50%",
							transform: "translateY(-50%)",
							backgroundColor: "rgba(255,255,255,0.8)",
							width: `${buttonSize}px`,
							height: `${buttonSize}px`,
							borderRadius: '50%',
							padding: 0,
							border: "1px solid #ddd",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 10,
							boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							style={{
								width: "50%",
								height: "50%",
								transform: "rotate(180deg)",
							}}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				)}
				<div
					ref={scrollRef}
					className={`flex overflow-x-auto no-scrollbar ${
						isDragging ? "cursor-grabbing" : "cursor-grab"
					}`}
					style={{
						width: "100%",
						height: "100%",
						justifyContent:
							!canScrollLeft && !canScrollRight && cards.length <= minSlidesToShow ? "center" : "flex-start",
						alignItems: "center", // Add this line for vertical centering
						overflowY: "visible",
						gap: `${dimensions.fontScale * slideGap}px`,
					}}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
				>
					{cards.map((item, index) => {
    const { width: cardWidth, height: cardHeight } = getScaledCardDimensions(item.aspectRatio, dimensions.fontScale);
    return (
        <a
            key={item.id}
            href={item.link}
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative flex-shrink-0 overflow-hidden transition duration-300 transform select-none"
            style={{
                width: `${cardWidth}px`,
                minWidth: `${cardWidth}px`,
                height: `${cardHeight}px`,
                scrollSnapAlign: "start",
                borderRadius: `${20 * dimensions.fontScale * 0.8}px`,
                marginBottom: `${50 * dimensions.fontScale * 0.8}px`,
                marginTop: `${30 * dimensions.fontScale * 0.8}px`,
                background: getValidColor(item.backgroundColor),
                marginLeft:
                    index === 0 && (canScrollLeft || canScrollRight) ?
                        `${20 * dimensions.fontScale * 0.8}px` :
                        "0px",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                overflowY: "hidden",
                position: "relative",
                display: "block",
            }}
        >
            {item.image && (
                <img
                    src={item.image}
                    alt={item.title}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "opacity 0.3s ease",
                        pointerEvents: "none",
                    }}
                />
            )}
           <div
    className="relative w-full h-full rounded-md overflow-hidden"
    style={{
        borderRadius: `${20 * dimensions.fontScale}px`, // use fontScale instead
    }}
>
    <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
    />

    {/* Gradient Overlay */}
    <div
    className="absolute left-0 right-0"
    style={{
        height: `${100 * dimensions.fontScale}px`, // adjust this value to reduce gradient height
        top: item.textPosition === "top" ? 0 : "auto",
        bottom: item.textPosition === "bottom" ? 0 : "auto",
        backgroundImage: item.textPosition === "top"
            ? "linear-gradient(to bottom, rgba(16,18,97,0.8), rgba(16,18,97,0))"
            : "linear-gradient(to top, rgba(16,18,97,0.8), rgba(16,18,97,0))",
    }}
></div>


    {/* Title */}
    <div
        className={`absolute left-0 right-0 px-4 py-2 ${
            item.textPosition === "top" ? "top-0" : "bottom-0"
        }`}
    >
        <h3
            className="text-white font-medium"
            style={{
                fontSize: `${25 * dimensions.fontScale * 0.8}px`,
            }}
        >
            {item.title}
        </h3>
    </div>
</div>

            {/* Arrow Container — opposite corner depending on textPosition */}
            {/* Arrow Container — reacts to card hover */}
<div
  className="absolute right-4 transition-colors duration-300"
  style={{
    top: item.textPosition === "bottom" ? `${16 * dimensions.fontScale * 0.8}px` : "auto",
    bottom: item.textPosition === "top" ? `${16 * dimensions.fontScale * 0.8}px` : "auto",
    width: `${50 * dimensions.fontScale * 0.8}px`,
    height: `${50 * dimensions.fontScale * 0.8}px`,
    borderRadius: `${10 * dimensions.fontScale * 0.8}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: 'blur(5px)',
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: hoveredCard === item.id ? '#6c63ff' : 'rgba(255,255,255,0.7)',
    border: `1px solid #6c63ff`,
    cursor: "pointer",
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke={hoveredCard === item.id ? 'white' : '#6c63ff'}
    className="w-5 h-5 transition-transform duration-300"
    style={{
      transform: hoveredCard === item.id ? 'rotate(10deg)' : 'rotate(-135deg)',
      transition: "transform 0.3s ease, stroke 0.3s ease",
    }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
</div>


        </a>
    );
})}

				</div>
				{canScrollRight && (
					<button
						onClick={scrollRight}
						className="text-gray-800 carousel-button carousel-button-right hover:scale-110 focus:outline-none transition-transform duration-200"
						aria-label="Scroll right"
						style={{
							position: "absolute",
							right: 0,
							top: "50%",
							transform: "translateY(-50%)",
							backgroundColor: "rgba(255,255,255,0.8)",
							width: `${buttonSize}px`,
							height: `${buttonSize}px`,
							borderRadius: '50%',
							padding: 0,
							border: "1px solid #ddd",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 10,
							boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							style={{
								width: "50%",
								height: "50%",
							}}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				)}
			</div>
			{(canScrollLeft || canScrollRight) && progressbar && (
				<div
					className="bg-gray-200 rounded"
					style={{
						height: `${8 * dimensions.fontScale * 0.8}px`,
						marginTop: `${30 * dimensions.fontScale * 0.8}px`,
						marginLeft: `${30 * dimensions.fontScale * 0.8}px`,
						marginRight: `${30 * dimensions.fontScale * 0.8}px`,
					}}
				>
					<div
						className="rounded"
						style={{
							width: `${progress}%`,
							height: "100%",
							background: getValidColor(progressbarColor) || "#000000",
						}}
					/>
				</div>
			)}
			<div className="text-center mt-8">
                <p 
        className="mb-4"
        style={{
            fontSize: `${16 * dimensions.fontScale * 0.8}px`,
            color: "#555",
            maxWidth: '600px', // Optional: Add a max-width for better readability on large screens
            margin: '0 auto 1rem',
            padding: '0 20px',
        }}
    >
        We have all the services to help your business.
    </p>
				<button
    className="text-white font-bold transition-all duration-300 rounded-full px-6 py-3 sm:px-8 sm:py-4"
    style={{
        backgroundColor: '#6c63ff',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        fontSize: `${16 * dimensions.fontScale * 0.8}px`,
    }}
>
    EXPLORE MORE
</button>

			</div>
		</div>
	);
}

export default ServiceExplainer;