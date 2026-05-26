import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "3D Man Box — Premium 3D-Charaktere für Business-Visuals",
    template: "%s | 3D Man Box",
  },
  description:
    "1.000+ premium 3D-Charaktere für Präsentationen, Webseiten und Marketing — unbegrenzt einsetzbar, einmal zahlen.",
  metadataBase: new URL("https://3dmanbox.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
