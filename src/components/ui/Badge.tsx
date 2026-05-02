// components/ui/Badge.tsx
import { clsx } from "clsx";

interface BadgeProps {
  label: string;
  color?: "blue" | "red" | "green" | "yellow" | "purple" | "gray";
  size?: "sm" | "md";
}

const colors = {
  blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800",
  red: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800",
  green:
    "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800",
  yellow:
    "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800",
  purple:
    "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800",
  gray: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
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
