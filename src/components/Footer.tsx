"use client";

import { useLanguage } from "@/contexts/LanguageContext";

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
            <a href="https://github.com/AdelEnazi1117" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://adelenazi.dev" className="hover:text-white transition-colors">{t.developer}</a>
        </div>
    </footer>
  );
}
