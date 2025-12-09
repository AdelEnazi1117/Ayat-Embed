"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { trackProfileInteraction, trackSocial } from "@/lib/analytics";

export default function Footer() {
  const { t, isRTL } = useLanguage();
  
  return (
    <footer className="flex-none h-8 bg-navy-950 border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-white/30 uppercase tracking-widest relative z-50" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center gap-4">
        <span>{t.ready}</span>
        <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
        <span>v1.2.0</span>
        </div>
        <div className="flex items-center gap-4">
            <a
              href="https://github.com/AdelEnazi1117"
              className="hover:text-white transition-colors"
              onClick={() =>
                trackSocial("github", "https://github.com/AdelEnazi1117", {
                  position: "footer",
                })
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://adelenazi.dev"
              className="hover:text-white transition-colors"
              onClick={() => {
                trackSocial("personal_site", "https://adelenazi.dev", {
                  position: "footer",
                });
                trackProfileInteraction("click", "developer_site");
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.developer}
            </a>
        </div>
    </footer>
  );
}
