"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 transition-colors text-sm font-medium"
      title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <FontAwesomeIcon icon={faLanguage} className="w-4 h-4" />
      <span>{language === "ar" ? "EN" : "عربي"}</span>
    </button>
  );
}
