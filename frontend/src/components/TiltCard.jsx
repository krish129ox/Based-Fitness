import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function TiltCard({ children, className = "", maxTilt = 6, scale = 1.015, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const rawRotateX = useTransform(y, [-1, 1], [maxTilt, -maxTilt]);
  const rawRotateY = useTransform(x, [-1, 1], [-maxTilt, maxTilt]);
  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      x.set(Math.max(-1, Math.min(1, deltaX)));
      y.set(Math.max(-1, Math.min(1, deltaY)));
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <div className={`card ${className}`} {...props}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={`relative bg-surface border border-border rounded-card p-5 transform-gpu ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      {...props}
    >
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  );
}
