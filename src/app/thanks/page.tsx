import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getDict, getLocale } from "@/lib/i18n";

export default async function ThanksPage() {
  const locale = await getLocale();
  const dict = await getDict(locale);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap py-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-300 text-zinc-950">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 16l5 5 11-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-display mt-6 text-4xl text-zinc-950 md:text-5xl">Welcome to 3D Man Box.</h1>
          <p className="mt-3 text-zinc-600">Check your inbox — your download link is on its way.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/gallery" className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
              {dict.nav.gallery}
            </Link>
            <a href="https://3dman.club" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-400">
              {dict.nav.club}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
