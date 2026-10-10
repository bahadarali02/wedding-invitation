import type { Metadata } from "next";

import {
  Amiri,
  Aref_Ruqaa,
  Cinzel,
  Cormorant_Garamond,
  Great_Vibes,
  Italianno,
} from "next/font/google";

import { ThemeProvider } from "next-themes";

import "./globals.css";

const defaultUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),

  title: "Wedding Invitation",

  description:
    "Wedding celebrations of Dr Haider Ali & Sidra Noureen and Iqra Asghar & M Zunair",
};

const displayFont = Italianno({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

const scriptFont = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: "400",
});

const bodyFont = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
});

const labelFont = Cinzel({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
  weight: [
    "400",
    "500",
    "600",
  ],
});

const bismillahFont = Aref_Ruqaa({
  subsets: ["arabic"],
  variable: "--font-bismillah",
  display: "swap",
  weight: ["400", "700"],
});

const arabicFont = Amiri({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: [
    "400",
    "700",
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`
          ${displayFont.variable}
          ${scriptFont.variable}
          ${bodyFont.variable}
          ${labelFont.variable}
          ${arabicFont.variable}
          ${bismillahFont.variable}
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}