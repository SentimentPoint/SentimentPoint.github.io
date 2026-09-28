import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SentimentPoint — Clarity from complexity",
  description:
    "Audience sentiment analysis, culture surveys and custom data gathering for life science organisations.",
  openGraph: {
    title: "SentimentPoint",
    description:
      "Audience sentiment analysis, culture surveys and custom data gathering for life science organisations.",
    url: "https://sentimentpoint.com/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
