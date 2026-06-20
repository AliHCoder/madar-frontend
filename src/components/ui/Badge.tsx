// components/ui/Badge.tsx
import { clsx } from "clsx";

interface BadgeProps {
  label: string;
  color?: "blue" | "red" | "green" | "yellow" | "purple" | "gray";
  size?: "sm" | "md";
}

const colors = {
  blue: "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  red: "bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
  green:
    "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  yellow:
    "bg-yellow-50 text-yellow-700 border border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  purple:
    "bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  gray: "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
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
