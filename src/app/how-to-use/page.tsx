"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faArrowLeft,
  faPalette,
  faCode,
  faCopy,
  faCircleCheck,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";

export default function HowToUsePage() {
  const { t } = useLanguage();

  return (
    <div className="h-screen flex flex-col bg-navy-950 overflow-hidden text-white relative">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />

      <header className="flex-none z-50 fixed top-4 inset-x-4 h-16 bg-navy-900/90 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl transition-all duration-300">
        <div className="h-full px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {t.backToHome}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-y-auto custom-scrollbar pt-32 pb-4 px-4 w-full">
        <div className="max-w-4xl mx-auto space-y-12 pb-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-accent-orange to-amber-500 shadow-2xl shadow-accent-orange/20 mb-4 animate-fade-in relative group overflow-hidden">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Image
                src="/favicon.png"
                alt="Logo"
                width={48}
                height={48}
                className="relative z-10 w-12 h-12 object-contain drop-shadow-md"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t.howToUseTitle}
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              {t.howToUseIntro}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-2xl hover:shadow-accent-orange/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-8xl text-white group-hover:opacity-20 transition-opacity select-none">
                1
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-accent-orange/50 group-hover:bg-accent-orange/10">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="w-5 h-5 text-white/70 group-hover:text-accent-orange transition-colors"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-orange transition-colors">
                {t.step1Title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-light">
                {t.step1Desc}
              </p>
            </div>

            <div className="group bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-8xl text-white group-hover:opacity-20 transition-opacity select-none">
                2
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-purple-500/50 group-hover:bg-purple-500/10">
                <FontAwesomeIcon
                  icon={faPalette}
                  className="w-5 h-5 text-white/70 group-hover:text-purple-400 transition-colors"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                {t.step2Title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-light">
                {t.step2Desc}
              </p>
            </div>

            <div className="group bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-8xl text-white group-hover:opacity-20 transition-opacity select-none">
                3
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10">
                <FontAwesomeIcon
                  icon={faCopy}
                  className="w-5 h-5 text-white/70 group-hover:text-emerald-400 transition-colors"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                {t.step3Title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-light">
                {t.step3Desc}
              </p>
            </div>
          </div>

          <div className="bg-navy-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-6 py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-orange group-hover:border-accent-orange transition-all duration-300 shadow-2xl">
                <FontAwesomeIcon
                  icon={faPlay}
                  className="w-6 h-6 text-white ml-1"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Watch Tutorial
                </h2>
                <p className="text-white/50 max-w-md mx-auto">
                  Coming soon: A detailed video guide on how to create and
                  customize your embeds.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy-900/80 to-navy-950/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <FontAwesomeIcon icon={faCode} className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {t.iframeVsHtml}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-emerald-400 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
                  iFrame
                </h3>
                <div className="p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-sm text-white/70 leading-relaxed">
                    {t.iframeDesc}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-amber-400 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
                  Pure HTML
                </h3>
                <div className="p-6 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-sm text-white/70 leading-relaxed">
                    {t.htmlDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-navy-950 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl shadow-white/10"
            >
              <span>{t.backToHome}</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
