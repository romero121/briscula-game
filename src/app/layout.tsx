import type { Metadata, Viewport } from "next";
import { Geist, Marcellus } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Marcellus: elegant Roman-inscriptional serif — premium, not cartoon.
const displaySerif = Marcellus({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Briscula & Tresetta — Dalmatinske karte",
  description:
    "Igraj Briskulu i Trešetu protiv računala s tradicionalnim talijansko-dalmatinskim kartama.",
};

export const viewport: Viewport = {
  themeColor: "#06243b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hr"
      className={`${geistSans.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
