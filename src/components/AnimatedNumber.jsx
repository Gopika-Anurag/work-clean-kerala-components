import { useEffect, useState } from "react";

const AnimatedNumber = ({ target = 0, duration = 500, className = "", style = {} }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let numericTarget = 0;

    if (typeof target === "string") {
      const cleaned = target
        .toLowerCase()
        .replace(/,/g, "")
        .replace(/\+/g, "")
        .trim();

      if (cleaned.includes("k")) {
        numericTarget = parseFloat(cleaned.replace("k", "")) * 1000;
      } else {
        numericTarget = parseFloat(cleaned);
      }
    } else {
      numericTarget = target;
    }

    if (!numericTarget || isNaN(numericTarget)) return;

    let start = 0;
    const stepTime = Math.max(Math.floor(duration / numericTarget), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= numericTarget) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <div className={className} style={style}>
      {count.toLocaleString()}
    </div>
  );
};

export default AnimatedNumber;
