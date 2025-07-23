// AnimatedNumber.jsx
import React, { useState, useEffect, useRef } from 'react';

const AnimatedNumber = ({ targetValue, format, isActive, delay = 300, duration = 2000, style = {} }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const animationFrameId = useRef(null);
  const startTime = useRef(null);
  const hasAnimated = useRef(false); // To ensure animation runs only once per activation

  useEffect(() => {
    // Only run animation if 'isActive' and it hasn't animated yet for this 'active' cycle
    if (isActive && !hasAnimated.current) {
      startTime.current = null; // Reset start time for a new animation
      hasAnimated.current = true; // Mark as animating

      const animate = (timestamp) => {
        if (!startTime.current) startTime.current = timestamp;
        const progress = (timestamp - startTime.current) / duration;
        const value = Math.min(progress, 1) * targetValue;

        setCurrentValue(value);

        if (progress < 1) {
          animationFrameId.current = requestAnimationFrame(animate);
        } else {
          setCurrentValue(targetValue); // Ensure it snaps to exact target
        }
      };

      const startAnimation = () => {
        animationFrameId.current = requestAnimationFrame(animate);
      };

      // Apply the delay before starting the animation
      const timeoutId = setTimeout(startAnimation, delay);

      return () => {
        // Cleanup on unmount or if isActive changes to false mid-animation
        clearTimeout(timeoutId);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    } else if (!isActive && hasAnimated.current) {
      // Reset when it goes out of view, so it can animate again next time
      hasAnimated.current = false;
      setCurrentValue(0); // Reset to 0 for the next animation cycle
    }
  }, [isActive, targetValue, delay, duration]); // Dependencies for useEffect

  // Format the number based on the original item's format
  const formatNumber = (num) => {
    let formatted = Math.floor(num); // Always floor for the intermediate animation
    if (format && format.includes("MT")) {
      return `${formatted} MT`;
    } else if (format && (format.includes("Rs") || format.includes("₹"))) {
      return `₹${formatted.toLocaleString("en-IN")}`;
    } else if (format && format.includes("KM")) {
      return `${formatted} KM`;
    } else {
      return formatted.toLocaleString();
    }
  };

  // The 'style' object is for the specific visual styling of the number
  // The opacity is now controlled internally, only visible when active
  return (
    <p
      style={{
        ...style, // Inherit styles like fontSize, fontWeight, color
        opacity: isActive ? 1 : 0, // Fade in when active
        transition: `opacity 0.3s ease-in-out`, // Smooth opacity transition
      }}
    >
      {formatNumber(currentValue)}
    </p>
  );
};

export default AnimatedNumber;