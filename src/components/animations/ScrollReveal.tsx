"use client";
import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    
    let x = 0, y = 0;
    if (direction === "up") y = 30;
    else if (direction === "left") x = -30;
    else if (direction === "right") x = 30;
    el.style.transform = `translate(${x}px, ${y}px)`;

    requestAnimationFrame(() => {
      el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
      el.style.opacity = "1";
      el.style.transform = "translate(0, 0)";
    });
  }, [delay, direction]);

  return (
    <div ref={ref} className={`h-full ${className}`}>
      {children}
    </div>
  );
}