import React, { useRef, useEffect, useState, useCallback } from "react";

const ActivitiesCarousel = ({ items, settings = {} }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [slideDims, setSlideDims] = useState({ width: 0, height: 0, gap: 0 });
  const [scale, setScale] = useState(1);
  const [drag, setDrag] = useState({ active: false, startX: 0, scrollLeft: 0 });
  const [focus, setFocus] = useState(false);

  const BASE = {
    SLIDE_W: settings.baseSlideWidth ?? 500,
    SLIDE_H: settings.baseSlideHeight ?? 250,
    GAP: 50,
    RADIUS: 20,
    PADDING: 25,
    FONT: 16,
    BTN_W: 120,
    BTN_H: 40,
    BTN_RADIUS: 10,
  };

  const computeSlidesToShow = () => {
    const w = window.innerWidth;
    if (w >= 1280) return 2.8;
    if (w >= 1024) return 2.5;
    if (w >= 768) return 1.8;
    return 1.5;
  };

  const updateDimensions = () => {
    const containerW = containerRef.current?.offsetWidth || 0;
    const slidesToShow = computeSlidesToShow();
    const gapRatio = BASE.GAP / BASE.SLIDE_W;
    let slideW = containerW / (slidesToShow + (slidesToShow - 1) * gapRatio);
    slideW = Math.max(slideW, 200);
    const gap = slideW * gapRatio;
    const ratio = slideW / BASE.SLIDE_W;
    setSlideDims({ width: slideW, height: (slideW * BASE.SLIDE_H) / BASE.SLIDE_W, gap });
    setScale(ratio);
  };

  useEffect(() => {
    updateDimensions();
    const resizeHandler = () => requestAnimationFrame(updateDimensions);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
    };
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = useCallback((dx) => {
    trackRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  }, []);

  const keyNav = useCallback(
    (e) => {
      if (!focus) return;
      if (e.key === "ArrowLeft") scrollBy(-slideDims.width);
      if (e.key === "ArrowRight") scrollBy(slideDims.width);
    },
    [focus, slideDims.width]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyNav);
    return () => document.removeEventListener("keydown", keyNav);
  }, [keyNav]);

  const wheelHandler = useCallback(
    (e) => {
      if (!focus) return;
      e.preventDefault();
      const speed = settings.scrollSpeed ?? 0.3;
      scrollBy(e.deltaY * speed);
    },
    [focus, scrollBy, settings.scrollSpeed]
  );

  useEffect(() => {
    const el = trackRef.current;
    el?.addEventListener("wheel", wheelHandler, { passive: false });
    return () => el?.removeEventListener("wheel", wheelHandler);
  }, [wheelHandler]);

  const dragStart = (e) => {
    if (e.target.tagName.toLowerCase() === "img") return;
    setDrag({ active: true, startX: e.pageX - trackRef.current.offsetLeft, scrollLeft: trackRef.current.scrollLeft });
  };

  const dragMove = (e) => {
    if (!drag.active) return;
    const walk = (e.pageX - trackRef.current.offsetLeft - drag.startX) * (settings.dragSpeed ?? 1);
    trackRef.current.scrollLeft = drag.scrollLeft - walk;
  };

  const dragEnd = () => setDrag((d) => ({ ...d, active: false }));

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      className="w-full relative bg-[#f0fdf4] py-6"
    >
      <div className="px-4 sm:px-6 lg:px-12">
        <h2 className="text-center font-bold text-gray-800 text-3xl md:text-5xl mb-5">
          Activities at a Glance
        </h2>

        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-black"
          onClick={() => scrollBy(-slideDims.width)}
        >
          &lt;
        </div>
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-black"
          onClick={() => scrollBy(slideDims.width)}
        >
          &gt;
        </div>

        <div
          ref={trackRef}
          className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
          style={{ padding: `0 ${slideDims.gap}px` }}
          onMouseDown={dragStart}
          onMouseMove={dragMove}
          onMouseUp={dragEnd}
          onMouseLeave={dragEnd}
        >
          <div className="flex w-max select-none" style={{ gap: `${slideDims.gap}px` }}>
            {items.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-row items-center shadow-md relative"
                style={{
                  width: `${slideDims.width}px`,
                  height: `${slideDims.height}px`,
                  borderRadius: `${BASE.RADIUS * scale}px`,
                  padding: `${BASE.PADDING * scale}px`,
                  gap: `${slideDims.gap / 2}px`,
                  background: item.bgColor || "#E6F4EA",
                }}
              >
                <div className="w-1/2 h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt="icon"
                    className="object-contain w-full h-[90%]"
                    style={{ borderRadius: `${BASE.RADIUS * 1.5 * scale}px`, pointerEvents: "none" }}
                  />
                </div>

                <div className="w-1/2 flex flex-col justify-center items-start relative">
                  {item.topRightText && (
                    <div
                      className="absolute"
                      style={{
                        top: `${8 * scale}px`,
                        right: `${BASE.PADDING * scale}px`,
                        fontWeight: "bold",
                        fontSize: `${16 * scale}px`,
                        color: item.topRightTextColor || "#374151",
                      }}
                    >
                      {item.topRightText}
                    </div>
                  )}
                  <p style={{ font: `bold ${30 * scale}px/1 sans-serif`, color: item.valueColor }}>{item.value}</p>
                  <p style={{ font: `${15 * scale}px/1.2 sans-serif`, color: item.labelColor }}>{item.label}</p>
                  {item.showKnowMoreButton && (
                    <button
                      className="mt-3 bg-green-600 text-white hover:bg-green-700 transition font-semibold"
                      style={{
                        width: `${BASE.BTN_W * scale}px`,
                        height: `${BASE.BTN_H * scale}px`,
                        borderRadius: `${BASE.BTN_RADIUS * scale}px`,
                        fontSize: `${BASE.FONT * scale}px`,
                      }}
                    >
                      Know More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-200 rounded mt-6" style={{ height: "6px" }}>
          <div className="bg-green-700 rounded" style={{ width: `${progress}%`, height: "100%" }}></div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesCarousel;