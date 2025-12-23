"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error("Global error:", error);

    // Track errors if analytics is available
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track("app_error", {
        message: error.message,
        digest: error.digest,
      });
    }
  }, [error]);

  // Detect language from localStorage or default to Arabic
  const getLanguage = () => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as "ar" | "en") || "ar";
    }
    return "ar";
  };

  const language = getLanguage();
  const isRTL = language === "ar";

  const content = {
    ar: {
      title: "حدث خطأ ما",
      description: "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      reset: "إعادة المحاولة",
      backToBuilder: "العودة للرئيسية",
      reportIssue: "الإبلاغ عن المشكلة",
    },
    en: {
      title: "Something Went Wrong",
      description: "Sorry, an unexpected error occurred. Please try again.",
      reset: "Try Again",
      backToBuilder: "Back to Builder",
      reportIssue: "Report Issue",
    },
  };

  const t = content[language];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-navy-950 overflow-hidden relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background gradients and patterns */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />

      {/* Error content */}
      <div className="relative z-10 max-w-2xl w-full">
        <div className="backdrop-blur-xl bg-navy-900/60 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Accent line at top - warning colors */}
          <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />

          <div className="p-8 md:p-12 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-red-500/20">
                <Image
                  src="/favicon.png"
                  alt="Ayat Embed"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                <svg
                  className="w-10 h-10 text-red-500"
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

            {/* Error title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t.title}
            </h2>

            {/* Error description */}
            <p className="text-white/60 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
              {t.description}
            </p>

            {/* Error details (in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-8 p-4 bg-navy-950/50 rounded-xl border border-red-500/20 text-start">
                <p className="text-xs font-mono text-red-400 mb-2">
                  [Development Only]
                </p>
                <p className="text-xs font-mono text-white/60 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-white/40 mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105"
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
                <span className="text-lg">{t.reset}</span>
              </button>

              <Link
                href="/"
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
                    d={isRTL ? "M15 19l-7-7 7-7" : "M10 19l-7-7 7-7"}
                  />
                </svg>
                <span>{t.backToBuilder}</span>
              </Link>

              <a
                href="https://github.com/AdelEnazi1117/Ayat-Embed/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-navy-800/50 hover:bg-navy-800 text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="hidden sm:inline">{t.reportIssue}</span>
              </a>
            </div>
          </div>

          {/* Decorative bottom gradient */}
          <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 opacity-50" />
        </div>

        {/* Additional info */}
        <p className="text-center mt-6 text-white/30 text-sm font-mono">
          {isRTL ? "خطأ في التطبيق" : "Application Error"}
        </p>
      </div>
    </div>
  );
}
