import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { trackCTA } from "@/lib/analytics";

interface ToggleButtonProps {
  icon?: IconProp | string;
  label: string;
  active: boolean;
  onClick: () => void;
  trackingKey: string;
  trackingData?: Record<string, unknown>;
  iconOnly?: boolean;
}

export default function ToggleButton({
  icon,
  label,
  active,
  onClick,
  trackingKey,
  trackingData,
  iconOnly = false,
}: ToggleButtonProps) {
  const handleClick = () => {
    trackCTA(trackingKey, { enabled: !active, ...trackingData });
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
        active
          ? "bg-navy-700 text-white shadow-sm"
          : "text-white/40 hover:text-white"
      }`}
    >
      {icon && typeof icon === "string" ? (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-current opacity-90"
          style={{
            fontFamily: "'Amiri Quran', UthmanicHafs, serif",
          }}
        >
          <text
            x="50%"
            y="55%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="18"
            fill="currentColor"
            style={{
              direction: "rtl",
              unicodeBidi: "bidi-override",
            }}
          >
            {icon}
          </text>
        </svg>
      ) : icon ? (
        <FontAwesomeIcon icon={icon as IconProp} className="w-3.5 h-3.5" />
      ) : null}
      <span className={iconOnly ? "hidden lg:inline" : ""}>{label}</span>
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-accent-emerald" : "bg-white/10"
        }`}
      />
    </button>
  );
}
