"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export default function NotFound() {
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    // Track 404 errors if analytics is available
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track("404_error", {
        url: window.location.pathname,
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy-950 overflow-hidden relative">
      {/* Background gradients and patterns */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 via-transparent to-accent-purple/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />

      {/* Error content */}
      <div className="relative z-10 max-w-2xl w-full" dir={isRTL ? "rtl" : "ltr"}>
        <div className="backdrop-blur-xl bg-navy-900/60 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Accent line at top */}
          <div className="h-1 bg-gradient-to-r from-accent-orange via-accent-gold to-accent-emerald" />

          <div className="p-8 md:p-12 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/10">
                <Image
                  src="/favicon.png"
                  alt="Ayat Embed"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 404 animated */}
            <div className="mb-6">
              <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent-orange via-accent-gold to-accent-emerald animate-fade-in">
                404
              </h1>
            </div>

            {/* Error title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t.notFound.title}
            </h2>

            {/* Error description */}
            <p className="text-white/60 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
              {t.notFound.description}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-orange to-accent-gold text-white font-bold rounded-xl shadow-lg shadow-accent-orange/20 hover:shadow-accent-orange/40 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="text-lg">{t.notFound.backToBuilder}</span>
                <svg
                  className={`w-5 h-5 transition-transform group-hover:${
                    isRTL ? "-translate-x-1" : "translate-x-1"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                  />
                </svg>
              </Link>

              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-navy-800/50 hover:bg-navy-800 text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>{t.docTitle}</span>
              </Link>
            </div>
          </div>

          {/* Decorative bottom gradient */}
          <div className="h-2 bg-gradient-to-r from-accent-purple via-accent-blue to-accent-emerald opacity-50" />
        </div>

        {/* Additional info */}
        <p className="text-center mt-6 text-white/30 text-sm font-mono">
          {isRTL ? "خطأ 404" : "Error 404"}
        </p>
      </div>
    </div>
  );
}
