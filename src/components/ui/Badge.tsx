// Badge.tsx
import { clsx } from "clsx";

interface BadgeProps {
  label: string;
  color?: "blue" | "red" | "green" | "yellow" | "purple" | "gray";
  size?: "sm" | "md";
}

const colors = {
  blue: "bg-blue-50 text-blue-700 border border-blue-100",
  red: "bg-red-50 text-red-600 border border-red-100",
  green: "bg-green-50 text-green-700 border border-green-100",
  yellow: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  purple: "bg-purple-50 text-purple-700 border border-purple-100",
  gray: "bg-gray-100 text-gray-600 border border-gray-200",
};

const sizes = {
  sm: "text-xs px-2.5 py-0.5",
  md: "text-sm px-3 py-1",
};

export default function Badge({
  label,
  color = "red",
  size = "sm",
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-block font-semibold rounded-full",
        colors[color],
        sizes[size],
      )}
    >
      {label}
    </span>
  );
}
