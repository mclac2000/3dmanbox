import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getDict, getLocale } from "@/lib/i18n";

export async function SiteHeader({ context = "box" }: { context?: "box" | "club" }) {
  const locale = await getLocale();
  const dict = await getDict(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="wrap flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-zinc-950 text-white">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 4l5-3 5 3v8l-5 3-5-3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M3 4l5 3 5-3M8 7v8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <span>3D Man Box</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-zinc-600 md:flex">
          <Link href="/gallery" className="transition hover:text-zinc-950">{dict.nav.gallery}</Link>
          <Link href="/try" className="transition hover:text-zinc-950">{dict.nav.tryAi}</Link>
          <Link href="/pricing" className="transition hover:text-zinc-950">{dict.nav.pricing}</Link>
          <a href="https://3dman.club" className="transition hover:text-zinc-950">{dict.nav.club}</a>
          <Link href="/donate" className="transition hover:text-zinc-950">{dict.nav.donate}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} />
          <Link
            href="/pricing"
            className="hidden rounded-full bg-zinc-950 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 md:inline-block"
          >
            {context === "club" ? dict.club.heroCta : dict.hero.ctaPrimary}
          </Link>
        </div>
      </div>
    </header>
  );
}
