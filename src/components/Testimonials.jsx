import React, { useEffect, useRef, useState } from 'react';
import testimonialSettings from '../data/testimonialsData';
import '../styles/testimonials.css';

const TestimonialScroller = () => {
    const {
        title,
        subtitle,
        titleColor,
        subtitleColor,
        backgroundColor,
        slideGap: responsiveGap,
        testimonials
    } = testimonialSettings;

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const [slideGap, setSlideGap] = useState(responsiveGap.desktop);

    // Resize handler
    const updateGap = () => {
        const width = window.innerWidth;
        if (width < 640) {
            setSlideGap(responsiveGap.mobile); // mobile
        } else if (width < 1024) {
            setSlideGap(responsiveGap.tablet); // tablet
        } else {
            setSlideGap(responsiveGap.desktop); // desktop
        }
    };

    useEffect(() => {
        updateGap(); // on mount
        window.addEventListener('resize', updateGap); // on resize
        return () => window.removeEventListener('resize', updateGap);
    }, []);

    useEffect(() => {
        const autoScroll = (ref, direction = "left") => {
            let scrollPos = 0;
            const step = 0.5;
            const scroll = () => {
                if (ref.current) {
                    if (direction === "left") {
                        scrollPos += step;
                        if (scrollPos >= ref.current.scrollWidth - ref.current.clientWidth) {
                            scrollPos = 0;
                        }
                    } else {
                        scrollPos -= step;
                        if (scrollPos <= 0) {
                            scrollPos = ref.current.scrollWidth - ref.current.clientWidth;
                        }
                    }
                    ref.current.scrollLeft = scrollPos;
                }
                requestAnimationFrame(scroll);
            };
            scroll();
        };

        autoScroll(ref1, "left");
    setTimeout(() => autoScroll(ref2, "right"), 90); // delay second scroll slightly
    }, []);

    const loopedItems = [...testimonials, ...testimonials];

    return (
        <div className="py-16 px-4 sm:px-6 md:px-12" style={{ backgroundColor }}>
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-xs sm:text-base md:text-lg font-semibold" style={{ color: subtitleColor }}>
                    {subtitle}
                </p>
                <h2
                    className="text-xl sm:text-3xl md:text-4xl font-semibold mt-2 leading-snug"
                    style={{ color: titleColor }}
                >
                    {title.split("Success").map((part, index, arr) =>
                        index < arr.length - 1 ? (
                            <React.Fragment key={index}>
                                {part}Success -<br />
                            </React.Fragment>
                        ) : (
                            part
                        )
                    )}
                </h2>
            </div>

            <div className="mt-12 space-y-10">
                {[ref1, ref2].map((ref, sectionIndex) => (
                    <div key={sectionIndex} className="relative overflow-hidden w-full">
                        {/* Left gradient */}
    <div
        className="absolute left-0 top-0 h-full w-10 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.8), transparent)' }}
    ></div>

    {/* Right gradient */}
    <div
        className="absolute right-0 top-0 h-full w-10 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.8), transparent)' }}
    ></div>

                        <div
                            ref={ref}
                            className="flex overflow-x-auto pb-4 px-2 sm:px-4 hide-scrollbar"
                            style={{ gap: slideGap }}
                        >
                            {loopedItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white shadow-lg rounded-xl p-[20px] flex-shrink-0 p-[20px] w-[300px] sm:w-[400px] lg:w-[430px] h-auto lg:h-[200px]"
                                    style={{
                                        flex: '0 0 auto',
                                    }}
                                >
                                    <p
                                        className="text-gray-600 mb-4 leading-[1.6] break-words text-[13px] sm:text-[14px] lg:text-[15px] h-[80px] lg:h-[100px] overflow-hidden"
                                    >
                                        {item.text}
                                    </p>

                                    <div className="flex items-center mt-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-[30px] h-[30px] sm:w-[38px] sm:h-[38px] rounded-full mr-3 object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-[11px] sm:text-[14px] lg:text-[15px]">{item.name}</p>
                                            <p className="text-yellow-500 text-[11px] sm:text-[12px] lg:text-[13px] leading-none mt-1">
                                                {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialScroller;
