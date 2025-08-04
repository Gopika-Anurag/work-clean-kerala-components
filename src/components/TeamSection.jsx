import React, { useCallback, useEffect, useRef, useState } from "react";
import '../styles/teamsection.css'
import { teamData } from "../data/teamData";

const TeamSection = (attributes) => {
  const {
    slideGap = teamData.slideGap,
    buttonSize= teamData.buttonSize,
    backgroundColor= teamData.backgroundColor,
    minSlidesToShow= teamData.minSlidesToShow,
    title= teamData.title,
    titleColor= teamData.titleColor,
    autoScrolling= teamData.autoScrolling,
    slides= teamData.slides
  } = attributes
  
  const presetSlideHeight = 550;
	const presetSlideWidth = 400;
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
			const r = parseInt(
				hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2),
				16,
			);
			const g = parseInt(
				hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4),
				16,
			);
			const b = parseInt(
				hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6),
				16,
			);
			return `rgba(${r}, ${g}, ${b}, 0.8)`;
		}
		return "rgba(255, 255, 255, 0.7)";
	};

	return (
		<div
			className="relative select-none"
			style={{
				background: getValidColor(backgroundColor),
				paddingTop: `${100 * dimensions.fontScale}px`,
				paddingBottom: `${80 * dimensions.fontScale}px`,
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				handleMouseUp();
				setIsHovered(false);
			}}
		>
			<h2
				className="font-bold text-start"
				style={{
					fontSize: `${60 * dimensions.fontScale}px`,
					marginBottom: `${30 * dimensions.fontScale}px`,
					color: titleColor || "#000",
				}}
			>
				{title}
			</h2>

			<div
				className="relative w-full"
				style={{
					minHeight: `${dimensions.cardHeight + 40 * dimensions.fontScale}px`, // add space for shadow
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
							left: 0,
							top: "50%",
							transform: "translateY(-50%)",
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
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							style={{
								width: `${0.8 * (buttonSize * dimensions.fontScale)}px`,
								height: `${0.8 * (buttonSize * dimensions.fontScale)}px`,
								transform: "translateX(1px) rotate(180deg)",
								transition: "transform 0.2s ease-in-out",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.transform =
									"translateX(1px) rotate(180deg) scale(1.2)")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.transform =
									"translateX(1px) rotate(180deg)")
							}
						>
							<polygon points="4,2 20,12 4,22" />
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
						justifyContent: slides.length > 3 ? "start" : "center",
						overflowY: "visible",
						gap: `${dimensions.fontScale * slideGap}px`, // Padding to accommodate arrows
					}}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
				>
					{slides.map((item, index) => (
							<div
								key={index}
								className="group relative flex-shrink-0 overflow-hidden transition duration-300 transform select-none hover:scale-105"
								style={{
									width: `${dimensions.cardWidth}px`,
									minWidth: `${dimensions.cardWidth}px`,
									height: `${dimensions.cardHeight}px`,
									scrollSnapAlign: "start",
									borderRadius: `${20 * dimensions.fontScale}px`,
									marginBottom: `${50 * dimensions.fontScale}px`,
									marginTop: `${30 * dimensions.fontScale}px`,
									background: getValidColor(item.backgroundColor),
									marginLeft:
										index === 0 ? `${20 * dimensions.fontScale}px` : "0px",
									boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
									overflowY: "hidden",
									position: "relative",
									display: "block",
								}}
							>
                <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover absolute top-0 left-0 transform group-hover:scale-110 transition-transform duration-1000"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#7b2cbf]/60 via-[#9d4edd]/20 to-transparent"></div>

            {/* Name */}
            <div className="absolute bottom-5 w-full text-center px-2">
              <h3 className="text-white text-base sm:text-xl font-semibold">{item.name}</h3>
            </div>
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
							right: 0,
							top: "50%",
							transform: "translateY(-50%)",
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
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-full"
							fill="currentColor"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							style={{
								width: `${0.8 * (buttonSize * dimensions.fontScale)}px`,
								height: `${0.8 * (buttonSize * dimensions.fontScale)}px`,
								transform: "translateX(1px)",
								transition: "transform 0.2s ease-in-out",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.transform = "translateX(1px) scale(1.2)")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.transform = "translateX(1px)")
							}
						>
							<polygon points="4,2 20,12 4,22" />
						</svg>
					</button>
				)}
			</div>
		</div>
	);
}
export default TeamSection;
