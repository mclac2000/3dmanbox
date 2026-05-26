import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getLocale, getDict } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDict(locale);
  return {
    title: { default: dict.meta.title, template: "%s · 3D Man Box" },
    description: dict.meta.description,
    metadataBase: new URL("https://3dmanbox.com"),
    alternates: {
      languages: {
        en: "/?lang=en",
        de: "/?lang=de",
        es: "/?lang=es",
        fr: "/?lang=fr",
        pt: "/?lang=pt",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/gallery/business/01-man-taking-a-risk.webp"],
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${inter.variable} ${grotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-zinc-950">
        {children}
      </body>
    </html>
  );
}
