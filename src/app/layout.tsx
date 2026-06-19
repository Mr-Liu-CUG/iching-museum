import type { Metadata } from "next";
import { Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-song",
  display: "swap",
});

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "易经数字博物馆 — 面向现代人的易经数字学习平台",
  description:
    "探索中国古代哲学经典《易经》的数字化博物馆。六十四卦完整解读，邵雍、傅佩荣、传统、张铭仁四家解卦，变卦模拟器，卦象关系图谱——三千年前的智慧，今天依然在回答人生问题。",
  keywords: [
    "易经", "六十四卦", "周易", "八卦", "阴阳", "国学", "传统文化",
    "I Ching", "Zhou Yi", "hexagram", "Chinese philosophy",
  ],
  authors: [{ name: "I Ching Digital Museum" }],
  creator: "I Ching Digital Museum",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["zh_TW", "en", "ja"],
    title: "易经数字博物馆",
    description: "三千年前的智慧，今天依然在回答人生问题",
    siteName: "易经数字博物馆",
  },
  twitter: {
    card: "summary",
    title: "易经数字博物馆",
    description: "面向现代人的易经数字学习平台",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hans" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Museum",
              name: "易经数字博物馆",
              description:
                "面向现代人的易经数字学习平台 — 探索六十四卦，理解阴阳八卦，学习中国传统文化哲学",
              url: "https://iching.museum",
              inLanguage: ["zh-CN", "zh-TW", "en", "ja"],
              about: {
                "@type": "Thing",
                name: "易经 (I Ching)",
                description: "中国古代经典哲学著作，六十四卦体系",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-bg-paper text-ink-dark font-[family-name:var(--font-song)] antialiased leading-relaxed">
        {children}
      </body>
    </html>
  );
}
