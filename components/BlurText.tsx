"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  onAnimationComplete?: () => void;
  className?: string;
}

export default function BlurText({
  text,
  delay = 200,
  animateBy = "words",
  direction = "top",
  onAnimationComplete,
  className = "",
}: BlurTextProps) {
  const [started, setStarted] = useState(false);
  const completedCount = useRef(0);

  const segments =
    animateBy === "words" ? text.split(" ") : text.split("");

  const totalSegments = segments.length;

  useEffect(() => {
    setStarted(true);
  }, []);

  const directionOffset = {
    top: { x: 0, y: -30 },
    bottom: { x: 0, y: 30 },
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
  };

  const handleSegmentComplete = () => {
    completedCount.current += 1;
    if (completedCount.current === totalSegments && onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      <AnimatePresence>
        {started &&
          segments.map((segment, i) => (
            <motion.span
              key={i}
              initial={{
                opacity: 0,
                filter: "blur(12px)",
                x: directionOffset[direction].x,
                y: directionOffset[direction].y,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                x: 0,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: i * (delay / 1000),
                ease: "easeOut",
              }}
              onAnimationComplete={handleSegmentComplete}
              className={animateBy === "words" ? "mr-[0.3em] inline-block" : "inline-block"}
            >
              {segment}
            </motion.span>
          ))}
      </AnimatePresence>
    </span>
  );
}
