import Image from "next/image";

interface PlayButtonProps {
  size?: number;
  className?: string;
  onClick?: () => void;
  showPing?: boolean;
  tag?: "button" | "span";
}

export default function PlayButton({ size = 80, className = "", onClick, showPing, tag = "button" }: PlayButtonProps) {
  const ringSize = size;
  const iconSize = Math.round(size * 0.42);
  const Tag = tag;

  return (
    <Tag
      onClick={onClick}
      className={`relative inline-flex items-center justify-center group ${className}`}
      style={{ width: ringSize, height: ringSize }}
    >
      {showPing && (
        <div
          className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"
          style={{ width: ringSize, height: ringSize }}
        />
      )}

      <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />

      <svg
        width={ringSize}
        height={ringSize}
        viewBox="0 0 80 80"
        className="absolute inset-0"
      >
        <circle
          cx="40"
          cy="40"
          r="37"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2"
        />
      </svg>

      <div
        className="relative z-10 transition-transform group-hover:scale-110"
        style={{ width: iconSize, height: iconSize }}
      >
        <Image
          src="/images/pley.png"
          alt="play"
          width={iconSize}
          height={iconSize}
          className="w-full h-full object-contain"
        />
      </div>
    </Tag>
  );
}
