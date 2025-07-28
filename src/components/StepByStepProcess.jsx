import React, { useCallback, useEffect, useRef, useState } from "react";
import stepByStepProcessDefaults from '../data/stepByStepProcessData';
import '../styles/stepbystepprocess.css';

const StepByStepProcess = ({ attributes = {}, style = {} }) => { // Added style prop
    // Destructure props from 'attributes', applying default values from stepByStepProcessDefaults
    // if specific attributes are not provided.
    const {
        slides = stepByStepProcessDefaults.slides,
        slideGap = stepByStepProcessDefaults.slideGap,
        backgroundColor = stepByStepProcessDefaults.backgroundColor,
        title = stepByStepProcessDefaults.title,
        subtitle = stepByStepProcessDefaults.subtitle, // Destructure subtitle
        titleColor = stepByStepProcessDefaults.titleColor,
        subtitleColor = stepByStepProcessDefaults.subtitleColor, // Destructure subtitleColor
        minSlidesToShow = stepByStepProcessDefaults.minSlidesToShow,
        autoScrolling = stepByStepProcessDefaults.autoScrolling, // Corrected typo here
        buttonSize = stepByStepProcessDefaults.buttonSize,
        progressbarColor = stepByStepProcessDefaults.progressbarColor,
    } = attributes;

    const presetSlideHeight = 430;
    const presetSlideWidth = 700;

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
        // Main container div for the entire component.
        // Accepts external style prop for positioning (e.g., marginLeft)
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

            <p
				className="font-bold text-center"
				style={{
					fontSize: `${16 * dimensions.fontScale}px`,
					marginBottom: `${10 * dimensions.fontScale}px`,
					color: getValidColor(subtitleColor),
				}}
			>
				{subtitle}
			</p>
			<h2
				className="font-bold text-center"
				style={{
					fontSize: `${60 * dimensions.fontScale}px`,
					marginBottom: `${30 * dimensions.fontScale}px`,
					color: getValidColor(titleColor),
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
                        paddingLeft: "15%"
					}}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
				>

                        {/* Map through the slides array to render each slide item */}
                        {slides.map((item, index) => (
                            <div
                                key={index}
                                className="relative flex flex-shrink-0 overflow-hidden transition-transform duration-300 hover:scale-[1.01] select-none "
                                style={{
								width: `${dimensions.cardWidth}px`,
								minWidth: `${dimensions.cardWidth}px`,
								height: `${dimensions.cardHeight}px`,
								borderTopLeftRadius: `20px`,
                                borderBottomLeftRadius: `20px`,
								marginBottom: `${50 * dimensions.fontScale}px`,
								marginTop: `${30 * dimensions.fontScale}px`,
								marginLeft: index === 0 ? `${20 * dimensions.fontScale}px` : "0px",
								background: getValidColor(item.backgroundColor),
								boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
								overflowY: "hidden",
							}}
                            >
                                {/* Left Image Column */}
                                <div
                                    className="flex-shrink-0"
                                    style={{
                                        width: `${0.4 * dimensions.cardWidth}px`,
                                        height: '100%',
                                        borderTopLeftRadius: `20px`,
                                        borderBottomLeftRadius: `20px`,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                <div
                                    className="flex flex-col justify-start flex-grow"
                                    style={{
                                        width: `${0.6 * dimensions.cardWidth}px`,
                                        backgroundColor: getValidColor(item.backgroundColor),
                                        color: item.textColor || "#4B5563",
                                        paddingTop: `${Math.max(16, 31.5 * dimensions.fontScale)}px`, // Responsive padding with minimum
                                        paddingBottom: `${30 * dimensions.fontScale}px`,
                                        paddingLeft: `${31.5 * dimensions.fontScale}px`,
                                        paddingRight: `${31.5 * dimensions.fontScale}px`,
                                    }}
                                >
                                    {/* Icon for the slide, positioned absolutely */}
                                    {item.icon && (
                                        <img
                                            src={item.icon}
                                            alt="Step Icon"
                                            className="absolute"
                                            style={{
                                                top: `${60 * dimensions.fontScale}px`, // Adjusted top position
                                                // right: `${dimensions.contentWidth - (31.5 + 61.8) * dimensions.fontScale}px`, // Adjusted right to align with content's left padding
                                                width: `${61.8 * dimensions.fontScale}px`, // Set exact width, scaled
                                                height: `${70 * dimensions.fontScale}px`, // Set exact height, scaled
                                                zIndex: 5,
                                                objectFit: 'contain', // Ensure image scales correctly without distortion
                                            }}
                                        />
                                    )}

                                    {/* Step Number */}
                                    <p
                                        className="font-regular text-right w-full" // Align to right
                                        style={{
                                            fontSize: `${18 * dimensions.fontScale}px`, // Original font size for "STEP"
                                            color: "#6A6E8D", // Gray color for step number
                                            marginBottom: `${90 * dimensions.fontScale}px`,
                                        }}
                                    >
                                        STEP <span style={{ fontSize: `${25 * dimensions.fontScale}px`, fontWeight: "bold" }}>{item.stepNumber}</span>
                                    </p>
                                    {/* Content area for title, description, and checklist */}
                                    <div className="flex flex-col w-full overflow-visible break-words">
                                        {/* Slide title */}
                                        <h3
                                            className="font-bold text-left mb-2"
                                            style={{
                                                color: item.titleColor || "#000",
                                                fontSize: `${24 * dimensions.fontScale}px`,
                                                lineHeight: 1.2 *dimensions.fontScale,
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {item.title}
                                        </h3>

                                        {/* Slide description */}
                                        <p
                                            className="text-left mb-4"
                                            style={{
                                                color: item.textColor || "#4B5563",
                                                fontSize: `${18 * dimensions.fontScale}px`,
                                                lineHeight: 1.5 *dimensions.fontScale,
                                            }}
                                        >
                                            {item.description}
                                        </p>

                                        {/* Checklist items */}
                                        <ul className="list-none p-0 m-0">
                                            {item.checklistItems && item.checklistItems.map((checkItem, checkIndex) => (
                                                <li
                                                    key={checkIndex}
                                                    className="flex items-center text-left"
                                                    style={{
                                                        fontSize: `${16 * dimensions.fontScale}px`,
                                                        color: item.textColor || "#4B5563",
                                                    }}
                                                >
                                                    {/* Checkmark SVG icon */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-4 h-4 mr-2"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        style={{
                                                            color: "#00AEEE",
                                                            width: `${35 * dimensions.fontScale}px`, // Set width to 15px
                                                            height: `${25 * dimensions.fontScale}px`, // Set height to 10.31px
                                                            marginRight: `${8 * dimensions.fontScale}px`, // Kept mr-2 equivalent
                                                        }}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {checkItem}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

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
            <div
						className="bg-gray-200 rounded"
						style={{ height: `${8 * dimensions.fontScale}px`,
                            marginLeft: `${25 * dimensions.fontScale}px`,
                            marginRight: `${25 * dimensions.fontScale}px`,
                            marginTop: `${8 * dimensions.fontScale}px`
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
		</div>
	);
}

export default StepByStepProcess;
