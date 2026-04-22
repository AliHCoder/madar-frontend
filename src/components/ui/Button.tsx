"use client";
import { useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { clsx } from "clsx";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-gradient-to-l from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50",
  outline:
    "bg-white/80 backdrop-blur-sm border-2 border-red-500 text-red-600 hover:bg-red-600 hover:text-white shadow-sm hover:shadow-red-500/25",
  ghost: "bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700",
  danger:
    "bg-gradient-to-l from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white shadow-lg shadow-red-700/30",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  className,
  type = "button",
  fullWidth,
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    gsap.to(btnRef.current, { scale: 1.05, duration: 0.2, ease: "power2.out" });
  };
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
  };
  const handleClick = () => {
    gsap.to(btnRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.in",
      yoyo: true,
      repeat: 1,
    });
    onClick?.();
  };

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}
