import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ayatembed.adelenazi.cloud";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "مضمّن الآيات | Ayat Embed",
  description:
    "مضمّن الآيات (Ayat Embed): أنشئ آيات قرآنية قابلة للتضمين في موقعك. Generate beautiful, embeddable Quranic verses for your website.",
  keywords: [
    "Quran",
    "القرآن",
    "Islamic",
    "إسلامي",
    "Embed",
    "تضمين",
    "Verse",
    "آية",
    "Ayah",
    "Widget",
    "Arabic",
    "عربي",
  ],
  authors: [{ name: "Ayat Embed" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "مضمّن الآيات | Ayat Embed",
    description:
      "مضمّن الآيات (Ayat Embed): أنشئ آيات قرآنية قابلة للتضمين في موقعك. Generate beautiful, embeddable Quranic verses for your website.",
    url: siteUrl,
    type: "website",
    siteName: "Ayat Embed",
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 630,
        alt: "مضمّن الآيات | Ayat Embed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مضمّن الآيات | Ayat Embed",
    description:
      "مضمّن الآيات (Ayat Embed): أنشئ آيات قرآنية قابلة للتضمين في موقعك. Generate beautiful, embeddable Quranic verses for your website.",
    images: [`${siteUrl}/preview.jpg`],
  },
  other: {
    "og:logo": `${siteUrl}/favicon.png`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        {/* Preload critical Quran font for faster initial render - per Quran Foundation best practices */}
        <link
          rel="preload"
          href="https://verses.quran.foundation/fonts/quran/hafs/uthmanic_hafs/UthmanicHafs1Ver18.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-navy-950 text-white min-h-screen font-arabic">
        {process.env.NEXT_PUBLIC_UMAMI_URL &&
          process.env.NEXT_PUBLIC_UMAMI_ID && (
            <Script
              src={process.env.NEXT_PUBLIC_UMAMI_URL}
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
              strategy="afterInteractive"
            />
          )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
