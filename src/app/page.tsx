"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faCheck,
  faCode,
  faPalette,
  faChevronDown,
  faHashtag,
  faMinus,
  faBookOpen,
  faEye,
  faPlus,
  faCircleQuestion,
  faBook,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Footer from "@/components/Footer";
import QuranCard, { generateStaticHTML } from "@/components/QuranCard";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchSurahs, fetchVersesRange, MAX_VERSES_LIMIT } from "@/lib/api";
import {
  trackCTA,
  trackProfileInteraction,
  trackSocial,
  usePageAnalytics,
} from "@/lib/analytics";
import {
  COLOR_PRESETS,
  BACKGROUND_PRESETS,
  TEXT_COLOR_PRESETS,
  DEFAULT_STYLE,
  DEFAULT_SURAH,
  DEFAULT_FROM_AYAH,
  DEFAULT_TO_AYAH,
  generateIframeCode,
} from "@/lib/constants";
import type { Surah, CardStyle, ExportFormat, VerseData } from "@/types";

export default function BuilderPage() {
  const { t, isRTL } = useLanguage();
  usePageAnalytics({ pageName: "builder" });

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(DEFAULT_SURAH);
  const [fromAyah, setFromAyah] = useState(DEFAULT_FROM_AYAH);
  const [toAyah, setToAyah] = useState(DEFAULT_TO_AYAH);
  const [verses, setVerses] = useState<VerseData[]>([]);

  const [style, setStyle] = useState<CardStyle>(DEFAULT_STYLE);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("iframe");
  const [copied, setCopied] = useState(false);
  const [surahSearch, setSurahSearch] = useState("");
  const [isSurahDropdownOpen, setIsSurahDropdownOpen] = useState(false);

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);

  const [baseUrl, setBaseUrl] = useState("");

  const stylesButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    trackProfileInteraction("view", "builder_header_avatar");
  }, []);

  const currentSurah = surahs.find((s) => s.number === selectedSurah);
  const maxAyahs = currentSurah?.numberOfAyahs || 7;

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
      surah.name.includes(surahSearch) ||
      surah.number.toString().includes(surahSearch)
  );

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (error) {
        console.error("Failed to load Surahs:", error);
      } finally {
        setIsLoadingSurahs(false);
      }
    };
    loadSurahs();
  }, []);

  useEffect(() => {
    setFromAyah(1);
    setToAyah(1);
  }, [selectedSurah]);

  useEffect(() => {
    if (fromAyah > maxAyahs) {
      setFromAyah(1);
    }
    if (toAyah > maxAyahs) {
      setToAyah(Math.min(fromAyah, maxAyahs));
    }
  }, [maxAyahs, fromAyah, toAyah]);

  useEffect(() => {
    if (toAyah < fromAyah) {
      setToAyah(fromAyah);
    }
  }, [fromAyah, toAyah]);

  const loadVerses = useCallback(async () => {
    if (selectedSurah && fromAyah && toAyah) {
      setIsLoadingVerses(true);
      try {
        const data = await fetchVersesRange(selectedSurah, fromAyah, toAyah);
        setVerses(data);
      } catch (error) {
        console.error("Failed to load verses:", error);
        setVerses([]);
      } finally {
        setIsLoadingVerses(false);
      }
    }
  }, [selectedSurah, fromAyah, toAyah]);

  useEffect(() => {
    loadVerses();
  }, [loadVerses]);

  const getEmbedCode = () => {
    if (exportFormat === "iframe") {
      return generateIframeCode(
        baseUrl,
        selectedSurah,
        fromAyah,
        toAyah,
        style
      );
    } else {
      return generateStaticHTML(
        verses,
        currentSurah?.englishName || "Al-Fatiha",
        currentSurah?.name || "الفاتحة",
        selectedSurah,
        style,
        isRTL
      );
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
      setCopied(true);
      trackCTA("copy_embed_code", {
        format: exportFormat,
        surah: selectedSurah,
        from: fromAyah,
        to: toAyah,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const selectExportFormat = (format: ExportFormat) => {
    setExportFormat(format);
    trackCTA("choose_export_format", { format });
  };

  const updateStyle = (updates: Partial<CardStyle>) => {
    setStyle((prev) => ({ ...prev, ...updates }));
  };

  const getSurahDisplayName = (surah: Surah) => {
    return isRTL ? surah.name : surah.englishName;
  };

  const togglePanel = (panelName: string) => {
    if (activePanel === panelName) {
      setActivePanel(null);
    } else {
      if (panelName === "colors" && stylesButtonRef.current) {
        const rect = stylesButtonRef.current.getBoundingClientRect();
        const popoverWidth = 320;
        const margin = 16;
        const screenWidth = window.innerWidth;

        let left = rect.left + rect.width / 2;

        if (left < popoverWidth / 2 + margin) {
          left = popoverWidth / 2 + margin;
        }
        if (left > screenWidth - popoverWidth / 2 - margin) {
          left = screenWidth - popoverWidth / 2 - margin;
        }

        setPopoverPos({
          top: rect.bottom + 8,
          left: left,
        });
      }
      setActivePanel(panelName);
      if (panelName === "colors") {
        trackCTA("open_styles_panel");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activePanel &&
        !(event.target as Element).closest(".dashboard-panel") &&
        !(event.target as Element).closest(".dashboard-trigger")
      ) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePanel]);

  return (
    <div className="h-screen flex flex-col bg-navy-950 overflow-hidden text-white">
      <header className="flex-none z-50 fixed top-4 inset-x-4 h-16 bg-navy-900/90 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl transition-all duration-300">
        <div
          className="relative h-full px-4 flex items-center justify-between gap-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex items-center gap-4 min-w-0 flex-shrink-0 z-10">
            <div
              className="hidden xl:flex items-center gap-3 px-4 border-e border-white/10"
              role="button"
              tabIndex={0}
              onClick={() =>
                trackProfileInteraction("click", "builder_header_avatar")
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  trackProfileInteraction("click", "builder_header_avatar");
                }
              }}
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/favicon.png"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white/90">
                {t.appTitle}
              </h1>
            </div>

            <div className="relative group shrink-0">
              <button
                onClick={() => setIsSurahDropdownOpen(!isSurahDropdownOpen)}
                className="dashboard-trigger flex items-center gap-3 px-3 py-2 bg-navy-800/50 hover:bg-navy-800 rounded-lg text-sm border border-white/5 hover:border-white/10 transition-all min-w-[160px] sm:min-w-[200px] justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-accent-orange font-mono text-xs">
                    {currentSurah?.number || "0"}
                  </span>
                  <span className="font-medium truncate max-w-[100px] sm:max-w-[120px]">
                    {currentSurah
                      ? getSurahDisplayName(currentSurah)
                      : t.selectSurah}
                  </span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3 h-3 text-white/40 transition-transform ${
                    isSurahDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSurahDropdownOpen && (
                <div className="absolute top-full start-0 mt-2 w-72 bg-navy-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60] animate-fade-in text-start">
                  <div className="p-2 border-b border-white/5 bg-navy-950/50">
                    <input
                      type="text"
                      placeholder={t.searchSurah}
                      value={surahSearch}
                      onChange={(e) => setSurahSearch(e.target.value)}
                      className="w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent-orange/50"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {filteredSurahs.map((surah) => (
                      <button
                        key={surah.number}
                        onClick={() => {
                          setSelectedSurah(surah.number);
                          setIsSurahDropdownOpen(false);
                          setSurahSearch("");
                          trackCTA("select_surah", {
                            surahNumber: surah.number,
                            surahName: surah.englishName,
                          });
                        }}
                        className={`w-full px-4 py-2.5 text-start text-sm hover:bg-white/5 transition-colors flex items-center justify-between group/item ${
                          selectedSurah === surah.number
                            ? "bg-accent-orange/10 text-accent-orange"
                            : "text-white/80"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-xs opacity-50 w-6">
                            {surah.number}
                          </span>
                          <span>{getSurahDisplayName(surah)}</span>
                        </span>
                        <span className="text-xs opacity-30 group-hover/item:opacity-70 transition-opacity">
                          {surah.numberOfAyahs}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-navy-800/30 p-1 rounded-lg border border-white/5">
              <div className="flex items-center">
                <span className="text-[10px] uppercase tracking-wider text-white/40 px-2 font-bold">
                  {t.ayah}
                </span>
                <select
                  value={fromAyah}
                  onChange={(e) => setFromAyah(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono text-accent-orange focus:outline-none py-1 pl-1 pr-6 cursor-pointer hover:bg-white/5 rounded appearance-none"
                  dir="ltr"
                >
                  {Array.from({ length: maxAyahs }, (_, i) => i + 1).map(
                    (num) => (
                      <option key={num} value={num} className="bg-navy-900">
                        {num}
                      </option>
                    )
                  )}
                </select>
              </div>
              <span className="text-white/20 px-1">-</span>
              <div className="flex items-center">
                <select
                  value={toAyah}
                  onChange={(e) => setToAyah(Number(e.target.value))}
                  className="bg-transparent text-sm font-mono text-accent-orange focus:outline-none py-1 pl-1 pr-2 cursor-pointer hover:bg-white/5 rounded appearance-none"
                  dir="ltr"
                >
                  {Array.from(
                    { length: maxAyahs - fromAyah + 1 },
                    (_, i) => fromAyah + i
                  ).map((num) => (
                    <option key={num} value={num} className="bg-navy-900">
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-3">
            <Link
              href="/how-to-use"
              onClick={() => trackCTA("nav_how_to_use")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <FontAwesomeIcon
                icon={faCircleQuestion}
                className="w-3.5 h-3.5"
              />
              <span>{t.howToUseTitle}</span>
            </Link>
            <Link
              href="/docs"
              onClick={() => trackCTA("nav_docs")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faBook} className="w-3.5 h-3.5" />
              <span>{t.docTitle}</span>
            </Link>
            <a
              href="https://github.com/AdelEnazi1117/Ayat-Embed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackSocial(
                  "github",
                  "https://github.com/AdelEnazi1117/Ayat-Embed",
                  {
                    position: "header",
                  }
                )
              }
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faGithub} className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 z-10">
            <div className="hidden lg:flex bg-navy-800/50 rounded-lg p-1 border border-white/5">
              <button
                onClick={() => selectExportFormat("iframe")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  exportFormat === "iframe"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {t.iframe}
              </button>
              <button
                onClick={() => selectExportFormat("html")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  exportFormat === "html"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {t.pureHtml}
              </button>
            </div>

            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                copied
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                  : "bg-accent-orange hover:bg-accent-orange/90 text-white shadow-lg shadow-accent-orange/20"
              }`}
            >
              <FontAwesomeIcon
                icon={copied ? faCheck : faCode}
                className="w-4 h-4"
              />
              <span className="hidden sm:inline">
                {copied ? t.copied : t.exportCode}
              </span>
            </button>

            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="flex-none z-40 fixed top-24 inset-x-4 h-16 bg-navy-900/80 backdrop-blur-md border border-white/5 shadow-md rounded-xl flex items-center justify-center px-4 transition-all duration-300">
        <div
          className="flex-1 flex items-center justify-center overflow-x-auto scrollbar-hide"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() =>
                updateStyle({ showTranslation: !style.showTranslation })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                style.showTranslation
                  ? "bg-navy-700 text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {t.showTranslation}
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  style.showTranslation ? "bg-accent-emerald" : "bg-white/10"
                }`}
              />
            </button>

            <button
              onClick={() =>
                updateStyle({ showVerseNumbers: !style.showVerseNumbers })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                style.showVerseNumbers
                  ? "bg-navy-700 text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faHashtag} className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t.showVerseNumbers}</span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  style.showVerseNumbers ? "bg-accent-emerald" : "bg-white/10"
                }`}
              />
            </button>

            <button
              onClick={() =>
                updateStyle({ showReference: !style.showReference })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                style.showReference
                  ? "bg-navy-700 text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faBookOpen} className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t.showReference}</span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  style.showReference ? "bg-accent-emerald" : "bg-white/10"
                }`}
              />
            </button>

            <button
              onClick={() =>
                updateStyle({ showAccentLine: !style.showAccentLine })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                style.showAccentLine
                  ? "bg-navy-700 text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <FontAwesomeIcon
                icon={faMinus}
                className="w-3.5 h-3.5 rotate-90"
              />
              <span className="hidden lg:inline">{t.showAccentLine}</span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  style.showAccentLine ? "bg-accent-emerald" : "bg-white/10"
                }`}
              />
            </button>

            <button
              onClick={() => updateStyle({ showBrackets: !style.showBrackets })}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                style.showBrackets
                  ? "bg-navy-700 text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <span
                className="text-base font-bold leading-none"
                dir="rtl"
                style={{ unicodeBidi: "isolate" }}
              >
                ﴿﴾
              </span>
              <span className="hidden lg:inline">{t.showBrackets}</span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  style.showBrackets ? "bg-accent-emerald" : "bg-white/10"
                }`}
              />
            </button>

            <button
              onClick={() =>
                updateStyle({
                  transparentBackground: !style.transparentBackground,
                })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                !style.transparentBackground
                  ? "bg-navy-700 text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t.showBackground}</span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  !style.transparentBackground
                    ? "bg-accent-emerald"
                    : "bg-white/10"
                }`}
              />
            </button>

            <button
              ref={stylesButtonRef}
              onClick={() => togglePanel("colors")}
              className={`dashboard-trigger px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                activePanel === "colors"
                  ? "bg-navy-700 text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={faPalette} className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t.styles}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 relative overflow-hidden flex bg-[#0f1115]">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-80" />

        <div className="relative w-full h-full flex flex-col">
          <div className="shrink-0 h-[180px] w-full" aria-hidden="true" />

          <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col">
            <div className="min-h-full flex flex-col p-8 lg:p-16">
              <div
                className={`my-auto mx-auto transition-all duration-500 max-w-4xl w-full ${
                  isLoadingVerses
                    ? "opacity-50 scale-95"
                    : "opacity-100 scale-100"
                }`}
              >
                <div className="backdrop-blur-sm bg-black/20 p-8 rounded-3xl border border-white/5 shadow-2xl ring-1 ring-white/5">
                  <QuranCard
                    verses={verses}
                    surahName={currentSurah?.englishName || "Al-Fatiha"}
                    surahNameArabic={currentSurah?.name || "الفاتحة"}
                    surahNumber={selectedSurah}
                    style={style}
                    isLoading={isLoadingVerses}
                    isArabicUI={isRTL}
                  />
                </div>

                <p className="text-center mt-6 text-white/20 text-sm font-mono tracking-widest uppercase">
                  {t.livePreview} •{" "}
                  {`${
                    currentSurah ? getSurahDisplayName(currentSurah) : ""
                  } • ${fromAyah}-${toAyah}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {activePanel === "colors" && (
        <div
          className="fixed p-4 bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-[280px] z-[100] animate-fade-in dashboard-panel"
          style={{
            top: popoverPos.top,
            left: popoverPos.left,
            transform: "translateX(-50%)",
          }}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {t.accentColor}
              </span>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => updateStyle({ accentColor: c.value })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      style.accentColor === c.value
                        ? "border-white"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
                <label
                  className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-white/20 hover:border-white hover:scale-110 transition-all flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500"
                  title={t.customColor}
                >
                  <input
                    type="color"
                    value={style.accentColor}
                    onChange={(e) =>
                      updateStyle({ accentColor: e.target.value })
                    }
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0 border-0"
                  />
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="w-2.5 h-2.5 text-white drop-shadow-sm"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {t.backgroundColor}
              </span>
              <div className="flex flex-wrap gap-2">
                {BACKGROUND_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => updateStyle({ backgroundColor: c.value })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      style.backgroundColor === c.value
                        ? "border-white h-7 w-7 ring-2 ring-white/20"
                        : "border-white/10"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
                <label
                  className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-white/20 hover:border-white hover:scale-110 transition-all flex items-center justify-center bg-gradient-to-tr from-gray-700 via-gray-600 to-gray-500"
                  title={t.customColor}
                >
                  <input
                    type="color"
                    value={style.backgroundColor}
                    onChange={(e) =>
                      updateStyle({ backgroundColor: e.target.value })
                    }
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0 border-0"
                  />
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="w-2.5 h-2.5 text-white drop-shadow-sm"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {t.textColor}
              </span>
              <div className="flex flex-wrap gap-2">
                {TEXT_COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => updateStyle({ textColor: c.value })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      style.textColor === c.value
                        ? "border-white"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
                <label
                  className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-white/20 hover:border-white hover:scale-110 transition-all flex items-center justify-center bg-gradient-to-tr from-yellow-300 via-orange-400 to-red-500"
                  title={t.customColor}
                >
                  <input
                    type="color"
                    value={style.textColor}
                    onChange={(e) => updateStyle({ textColor: e.target.value })}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0 border-0"
                  />
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="w-2.5 h-2.5 text-white drop-shadow-sm"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={() => setStyle(DEFAULT_STYLE)}
              className="w-full mt-2 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-white/20"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="w-3 h-3" />
              <span>{t.resetStyles}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
