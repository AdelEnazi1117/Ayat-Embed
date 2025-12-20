"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCode,
  faPalette,
  faCircleQuestion,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import { trackCTA, trackSocial, usePageAnalytics } from "@/lib/analytics";

export default function DocsPage() {
  const { t } = useLanguage();
  usePageAnalytics({ pageName: "docs" });

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
              onClick={() => trackCTA("nav_home_from_docs")}
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
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-accent-blue to-accent-emerald shadow-2xl shadow-accent-blue/20 mb-4 animate-fade-in relative group">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <FontAwesomeIcon
                icon={faCode}
                className="w-8 h-8 text-white relative z-10 drop-shadow-md"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t.docTitle}
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              {t.docIntro}
            </p>
          </div>

          <div className="space-y-8">
            <div className="group bg-gradient-to-br from-navy-900/80 to-navy-950/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all duration-500 hover:border-accent-blue/30 hover:shadow-2xl hover:shadow-accent-blue/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faCode}
                      className="w-5 h-5 text-accent-blue"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {t.docApiSection}
                  </h2>
                </div>
              </div>

              <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
                {t.docApiProxyDesc}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {t.docAvailableEndpoints}
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                      <code className="text-sm font-mono text-accent-blue">
                        /api/quran/chapters
                      </code>
                      <p className="text-xs text-white/50 mt-1">
                        {t.docFetchesSurahs}
                      </p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                      <code className="text-sm font-mono text-accent-blue">
                        /api/quran/verses/by_key/{`{surah}:{ayah}`}
                      </code>
                      <p className="text-xs text-white/50 mt-1">
                        {t.docFetchesVerse}
                      </p>
                    </div>
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                      <code className="text-sm font-mono text-accent-blue">
                        /api/quran/verses/by_chapter/{`{surah}`}
                      </code>
                      <p className="text-xs text-white/50 mt-1">
                        {t.docFetchesChapter}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-800/40 rounded-xl p-4 border border-accent-blue/20">
                  <h4 className="text-sm font-semibold text-accent-blue mb-2">
                    {t.docFeatures}
                  </h4>
                  <ul className="text-xs text-white/60 space-y-1 list-disc list-inside">
                    <li>{t.docOAuth2Auth}</li>
                    <li>{t.docCacheInfo}</li>
                    <li>{t.docBasmalaStripping}</li>
                    <li>{t.docMaxVerses}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-navy-900/80 to-navy-950/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all duration-500 hover:border-accent-purple/30 hover:shadow-2xl hover:shadow-accent-purple/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faCode}
                      className="w-5 h-5 text-accent-purple"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {t.docEmbedParams}
                  </h2>
                </div>
              </div>

              <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
                {t.docEmbedParamsDesc}
              </p>

              <div className="space-y-4">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    {t.docBaseUrlFormat}
                  </h3>
                  <code className="text-xs font-mono text-accent-purple block mb-2 break-all">
                    {`https://ayatembed.adelenazi.cloud/embed/{surah}/{ayah}?{params}`}
                  </code>
                  <p className="text-xs text-white/50">
                    {t.docForVerseRanges}{" "}
                    <code className="text-accent-purple">
                      /embed/{`{surah}/{fromAyah}-{toAyah}`}
                    </code>
                  </p>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    {t.docAvailableParams}
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        color
                      </code>
                      <span className="text-white/60">
                        {t.docAccentColorDesc}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        bg
                      </code>
                      <span className="text-white/60">{t.docBgColorDesc}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        text
                      </code>
                      <span className="text-white/60">
                        {t.docTextColorDesc}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        theme
                      </code>
                      <span className="text-white/60">{t.docThemeDesc}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        translation
                      </code>
                      <span className="text-white/60">
                        {t.docTranslationDesc}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        reference
                      </code>
                      <span className="text-white/60">
                        {t.docReferenceDesc}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        verseNumbers
                      </code>
                      <span className="text-white/60">
                        {t.docVerseNumbersDesc}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        accentLine
                      </code>
                      <span className="text-white/60">
                        {t.docAccentLineDesc}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        transparentBg
                      </code>
                      <span className="text-white/60">
                        {t.docTransparentBgDesc}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        brackets
                      </code>
                      <span className="text-white/60">{t.docBracketsDesc}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        lang
                      </code>
                      <span className="text-white/60">{t.docLangDesc}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <code className="text-accent-purple min-w-[140px]">
                        embedId
                      </code>
                      <span className="text-white/60">{t.docEmbedIdDesc}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-800/40 rounded-xl p-4 border border-accent-purple/20">
                  <h4 className="text-sm font-semibold text-accent-purple mb-2">
                    {t.docExample}
                  </h4>
                  <code className="text-xs font-mono text-white block break-all">
                    {`/embed/1/1?color=f97316&bg=1c2331&text=ffffff&translation=true&reference=true&verseNumbers=true`}
                  </code>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-navy-900/80 to-navy-950/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all duration-500 hover:border-accent-emerald/30 hover:shadow-2xl hover:shadow-accent-emerald/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-emerald/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faCode}
                      className="w-5 h-5 text-accent-emerald"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {t.docEmbedProtocol}
                  </h2>
                </div>
              </div>

              <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
                {t.docEmbedProtocolDesc}
              </p>

              <div className="space-y-4">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    {t.docHeightUpdate}
                  </h3>
                  <pre className="text-xs font-mono text-accent-emerald bg-black/60 p-3 rounded-lg overflow-x-auto">
                    {`{
  "type": "qveg:height",
  "id": "unique-embed-id",
  "height": 450
}`}
                  </pre>
                  <p className="text-xs text-white/50 mt-2">
                    {t.docHeightUpdateDesc}
                  </p>
                </div>

                <div className="bg-navy-800/40 rounded-xl p-4 border border-accent-emerald/20">
                  <h4 className="text-sm font-semibold text-accent-emerald mb-2">
                    {t.docParentListener}
                  </h4>
                  <pre className="text-xs font-mono text-white bg-black/60 p-3 rounded-lg overflow-x-auto">
                    {`window.addEventListener("message", (event) => {
  if (event.data.type === "qveg:height" && 
      event.data.id === "your-embed-id") {
    const iframe = document.getElementById("your-embed-id");
    iframe.style.height = event.data.height + "px";
  }
});`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white pl-4 border-l-4 border-accent-purple flex items-center gap-3">
              <FontAwesomeIcon
                icon={faPalette}
                className="w-5 h-5 text-accent-purple"
              />
              {t.docCustomization}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <ParamCard title={t.accentColor} desc={t.infoAccentColor} />
              <ParamCard
                title={t.backgroundColor}
                desc={t.infoBackgroundColor}
              />
              <ParamCard title={t.textColor} desc={t.infoTextColor} />
              <ParamCard
                title={t.showTranslation}
                desc={t.infoShowTranslation}
              />
              <ParamCard title={t.showReference} desc={t.infoShowReference} />
              <ParamCard
                title={t.showVerseNumbers}
                desc={t.infoShowVerseNumbers}
              />
              <ParamCard title={t.showAccentLine} desc={t.infoShowAccentLine} />
              <ParamCard
                title={t.transparentBackground}
                desc={t.infoTransparentBg}
              />
              <ParamCard title={t.showBrackets} desc={t.infoShowBrackets} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="w-5 h-5 text-accent-gold"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t.docSupport}</h3>
                <p className="text-sm text-white/50">{t.docSupportDesc}</p>
              </div>
            </div>
            <a
              href="https://github.com/AdelEnazi1117/Ayat-Embed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackSocial(
                  "github",
                  "https://github.com/AdelEnazi1117/Ayat-Embed",
                  { page: "docs" }
                )
              }
              className="flex items-center gap-2 px-6 py-3 bg-white text-navy-950 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              <span>View GitHub Repo</span>
            </a>
          </div>

          <div className="h-12" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ParamCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-navy-900/40 border border-white/5 hover:bg-navy-900/60 hover:border-white/10 transition-all group">
      <h3 className="font-bold text-white mb-2 group-hover:text-accent-purple transition-colors">
        {title}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed font-light">{desc}</p>
    </div>
  );
}
