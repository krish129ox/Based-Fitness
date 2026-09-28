"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function AnimatedNumber({ value, className = "", size = "huge", accent = false, unit = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const numericValue = typeof value === "number" ? value : parseInt(String(value).replace(/,/g, ""), 10) || 0;

  const sizeClasses = {
    huge: "font-scoreboard font-bold text-stat-huge",
    large: "font-scoreboard font-bold text-stat-large",
    medium: "font-scoreboard font-bold text-stat-medium",
    default: "font-scoreboard font-bold text-4xl",
  };

  const colorClass = accent ? "text-accent-secondary" : "text-text-primary";

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(numericValue);
      return;
    }

    if (animationRef.current) {
      animationRef.current.stop();
    }

    animationRef.current = animate(0, numericValue, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [numericValue, shouldReduceMotion]);

  return (
    <span className={`${sizeClasses[size] || sizeClasses.huge} ${colorClass} ${className}`} style={{ willChange: "transform" }}>
      <span>{displayValue.toLocaleString()}</span>
      {unit && <span className="ml-1 text-base font-medium opacity-70 text-text-secondary">{unit}</span>}
    </span>
  );
}