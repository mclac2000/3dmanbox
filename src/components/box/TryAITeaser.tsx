import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n";

export async function TryAITeaser() {
  const locale = await getLocale();
  const dict = await getDict(locale);

  return (
    <section className="wrap py-20">
      <div className="grid items-center gap-10 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-white to-accent-50 p-8 md:p-14 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent-700">{dict.common.free} · AI</p>
          <h2 className="font-display mt-3 text-3xl text-zinc-950 md:text-5xl">{dict.try.title}</h2>
          <p className="mt-4 max-w-md text-zinc-600">{dict.try.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/try"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {dict.hero.ctaSecondary}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </Link>
            <a
              href="https://3dman.club"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:border-zinc-400"
            >
              {dict.pricing.joinClub}
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-950">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
          <div className="absolute inset-6 rounded-xl bg-white/95 p-5 shadow-2xl backdrop-blur">
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">prompt</p>
            <p className="mt-2 font-display text-lg text-zinc-950">
              &quot;3D character holding a laptop, smiling, modern minimalist style&quot;
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent-700">{dict.try.generating}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-zinc-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
