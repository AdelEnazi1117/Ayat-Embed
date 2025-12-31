import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { trackCTA } from "@/lib/analytics";

export interface ColorPreset {
  name: string;
  value: string;
}

interface ColorPickerGroupProps {
  label: string;
  presets: ColorPreset[];
  selected: string;
  onSelect: (color: string) => void;
  trackingKey: string;
  showCustomPicker?: boolean;
  customGradient?: string;
  customIconColor?: string;
}

export default function ColorPickerGroup({
  label,
  presets,
  selected,
  onSelect,
  trackingKey,
  showCustomPicker = true,
  customGradient = "from-pink-500 via-purple-500 to-blue-500",
  customIconColor = "text-white",
}: ColorPickerGroupProps) {
  const handlePresetClick = (color: ColorPreset) => {
    onSelect(color.value);
    trackCTA(trackingKey, { color: color.value, name: color.name });
  };

  const handleCustomColorChange = (value: string) => {
    onSelect(value);
    trackCTA(`custom_${trackingKey}`, { color: value });
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {presets.map((color) => (
          <button
            key={color.value}
            onClick={() => handlePresetClick(color)}
            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
              selected === color.value
                ? "border-white"
                : trackingKey.includes("bg")
                ? "border-white/10"
                : "border-transparent"
            } ${trackingKey.includes("bg") && selected === color.value ? "h-7 w-7 ring-2 ring-white/20" : ""}
              ${trackingKey.includes("text") && selected === color.value ? "border-accent-orange h-7 w-7 ring-2 ring-accent-orange/20" : ""}`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
        {showCustomPicker && (
          <label
            className={`relative w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-white/20 hover:border-white hover:scale-110 transition-all flex items-center justify-center bg-gradient-to-tr ${customGradient}`}
            title="Custom color"
          >
            <input
              type="color"
              value={selected}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0 border-0"
            />
            <FontAwesomeIcon
              icon={faPlus}
              className={`w-2.5 h-2.5 drop-shadow-sm ${customIconColor}`}
            />
          </label>
        )}
      </div>
    </div>
  );
}
