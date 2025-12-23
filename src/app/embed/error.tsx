"use client";

import { useEffect, useState } from "react";

export default function EmbedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  useEffect(() => {
    // Detect language from URL params
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (lang === "en") {
      setLanguage("en");
    }

    // Log the error
    console.error("Embed error:", error);

    // Track embed errors if analytics is available
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track("embed_error", {
        message: error.message,
        digest: error.digest,
        url: window.location.pathname,
      });
    }
  }, [error]);

  const content = {
    ar: {
      title: "خطأ في التضمين",
      description: "عذراً، حدث خطأ أثناء تحميل الآية.",
      tryAgain: "حاول مرة أخرى",
    },
    en: {
      title: "Embed Error",
      description: "Sorry, an error occurred while loading the verse.",
      tryAgain: "Try Again",
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
        <div className="backdrop-blur-sm bg-navy-800/90 border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Accent line */}
          <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />

          <div className="p-8 text-center">
            {/* Error Icon */}
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

            {/* Error details (in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 p-3 bg-navy-950/50 rounded-lg border border-red-500/20 text-start">
                <p className="text-xs font-mono text-red-400 mb-1">
                  [Dev Only]
                </p>
                <p className="text-xs font-mono text-white/60 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-white/40 mt-1">
                    {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action button */}
            <button
              onClick={reset}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{t.tryAgain}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
