'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function MobileWarning() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );

      setIsMobile(width < 768 || isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't show warning on embed routes
  if (pathname?.startsWith('/embed')) return null;
  if (!mounted || !isMobile || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950 p-6 animate-fade-in">
      <div className="max-w-md w-full">
        {/* Icon Container */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-orange to-accent-gold flex items-center justify-center animate-pulse-once">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-rose flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-navy-800 rounded-2xl p-8 shadow-2xl border border-navy-700 animate-slide-up">
          {/* Arabic Section */}
          <div className="mb-6 pb-6 border-b border-navy-600">
            <h1 className="text-2xl font-bold text-white mb-4 text-right font-arabic leading-relaxed">
              هذا الموقع غير مصمم للعرض على الأجهزة المحمولة
            </h1>
            <p className="text-base text-navy-300 text-right font-arabic leading-relaxed">
              يرجى زيارة الموقع من جهاز كمبيوتر أو حاسوب محمول للحصول على أفضل تجربة
              استخدام.
            </p>
          </div>

          {/* English Section */}
          <div dir="ltr">
            <h1 className="text-xl font-bold text-white mb-4 text-left font-sans leading-relaxed">
              This website is not designed for mobile viewing
            </h1>
            <p className="text-base text-navy-300 text-left font-sans leading-relaxed">
              Please visit this site from a desktop or laptop computer for the best
              experience.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setDismissed(true)}
            className="px-6 py-2.5 rounded-lg bg-navy-700 hover:bg-navy-600 text-navy-300 hover:text-white text-sm font-medium transition-all duration-200 border border-navy-600 hover:border-navy-500"
          >
            <span className="block font-arabic">متابعة للموقع</span>
            <span className="block font-sans text-xs opacity-70 mt-0.5" dir="ltr">Continue to site</span>
          </button>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-navy-400 font-sans" dir="ltr">
            Designed for larger screens
          </p>
          <p className="text-sm text-navy-400 font-arabic mt-1">
            مصمم للشاشات الكبيرة
          </p>
        </div>
      </div>
    </div>
  );
}
