import type { Metadata } from "next";
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
      <body className="bg-navy-950 text-white min-h-screen font-arabic">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
