// components/common/CategoryBadge.tsx
import { Category } from "@/types/news";

interface CategoryBadgeProps {
  category: Category;
  variant?: "solid" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
}

export default function CategoryBadge({
  category,
  variant = "solid",
  size = "md",
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  if (variant === "outline") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-bold border-2 ${sizeClasses[size]}`}
        style={{
          color: "#1099a6",
          borderColor: "#1099a6",
          backgroundColor: `${"#1099a6"}08`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#1099a6" }}
        />
        {category.name}
      </span>
    );
  }

  if (variant === "glass") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-bold text-white backdrop-blur-md ${sizeClasses[size]}`}
        style={{
          backgroundColor: `${"#1099a6"}40`,
          border: `1px solid ${"#1099a6"}60`,
        }}
      >
        {category.name}
      </span>
    );
  }

  // solid (default)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold text-white ${sizeClasses[size]}`}
      style={{
        backgroundColor: "#1099a6",
        boxShadow: `0 4px 12px ${"#1099a6"}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-white/80"
        style={{ boxShadow: "0 0 6px rgba(255,255,255,0.5)" }}
      />
      {category.name}
    </span>
  );
}
