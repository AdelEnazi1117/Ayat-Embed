import React from "react";

interface BracketProps {
  type: "open" | "close";
  color: string;
  className?: string;
}

export default function Bracket({ type, color, className = "" }: BracketProps) {
  const bracket = type === "open" ? "﴿" : "﴾";

  return (
    <span
      className={`inline text-2xl md:text-3xl ${className}`}
      style={{
        color,
        fontFamily: "'Amiri Quran', UthmanicHafs, serif",
      }}
    >
      {bracket}
    </span>
  );
}
