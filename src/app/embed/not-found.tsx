"use client";

import { useEffect, useState } from "react";

export default function EmbedNotFound() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  useEffect(() => {
    // Detect language from URL params or browser
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (lang === "en") {
      setLanguage("en");
    }

    // Track embed 404 errors if analytics is available
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track("embed_404_error", {
        url: window.location.pathname,
      });
    }
  }, []);

  const content = {
    ar: {
      title: "رابط تضمين غير صحيح",
      description: "يرجى استخدام الرابط بالتنسيق الصحيح لتضمين الآيات القرآنية.",
      exampleFormat: "مثال:",
      exampleUrl: "/embed/1/1",
      exampleDesc: "(سورة 1، آية 1)",
      orRange: "أو للنطاقات:",
      exampleRangeUrl: "/embed/2/1-5",
      exampleRangeDesc: "(سورة 2، آيات 1-5)",
    },
    en: {
      title: "Invalid Embed URL",
      description: "Please use the correct URL format to embed Quranic verses.",
      exampleFormat: "Example:",
      exampleUrl: "/embed/1/1",
      exampleDesc: "(Surah 1, Ayah 1)",
      orRange: "Or for ranges:",
      exampleRangeUrl: "/embed/2/1-5",
      exampleRangeDesc: "(Surah 2, Ayahs 1-5)",
    },
  };

  const t = content[language];
  const isRTL = language === "ar";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "transparent" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-md w-full">
        <div className="backdrop-blur-sm bg-navy-800/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Accent line */}
          <div className="h-1 bg-gradient-to-r from-accent-orange to-accent-gold" />

          <div className="p-8 text-center">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-accent-orange/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-accent-orange"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-3 text-white">{t.title}</h1>

            {/* Description */}
            <p className="text-white/70 mb-6 text-sm leading-relaxed">
              {t.description}
            </p>

            {/* Examples */}
            <div className="bg-navy-900/50 rounded-xl p-4 mb-4 text-start border border-white/5">
              <p className="text-white/50 text-xs uppercase font-bold tracking-wider mb-3">
                {t.exampleFormat}
              </p>

              <div className="space-y-3">
                <div>
                  <code className="text-accent-orange font-mono text-sm block mb-1">
                    {t.exampleUrl}
                  </code>
                  <p className="text-white/40 text-xs">{t.exampleDesc}</p>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <p className="text-white/50 text-xs mb-2">{t.orRange}</p>
                  <code className="text-accent-emerald font-mono text-sm block mb-1">
                    {t.exampleRangeUrl}
                  </code>
                  <p className="text-white/40 text-xs">{t.exampleRangeDesc}</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <p className="text-white/30 text-xs">
              {isRTL
                ? "قم بإنشاء رابط التضمين باستخدام أداة الإنشاء"
                : "Use the builder to create your embed URL"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
