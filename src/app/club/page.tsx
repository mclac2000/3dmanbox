import Link from "next/link";
import Image from "next/image";
import { getDict, getLocale } from "@/lib/i18n";
import { getCategories, getCategory } from "@/lib/gallery";
import { PRICING } from "@/lib/site";

export default async function ClubHome() {
  const locale = await getLocale();
  const dict = await getDict(locale);
  const cats = await getCategories();
  const featured = await Promise.all(cats.slice(0, 4).map((c) => getCategory(c.slug)));

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="bg-grid absolute inset-0 opacity-10" aria-hidden />
        <div className="wrap relative grid items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent-300">3dman.club</p>
            <h1 className="font-display mt-3 text-4xl leading-[1.05] md:text-6xl">
              {dict.club.heroTitle}
            </h1>
            <p className="mt-5 max-w-md text-zinc-300">{dict.club.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/club/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-accent-300 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-400"
              >
                {dict.club.heroCta}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </Link>
              <a
                href="https://3dmanbox.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse the gallery
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featured.flatMap((cat, i) =>
              cat
                ? cat.images.slice(0, i === 0 ? 4 : 2).map((img, j) => (
                    <div
                      key={`${cat.slug}-${j}`}
                      className="relative aspect-square overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10"
                    >
                      <Image src={`/gallery/${cat.slug}/${img.file}`} alt="" fill sizes="180px" className="object-contain p-3" />
                    </div>
                  ))
                : [],
            )}
          </div>
        </div>
      </section>

      <section className="wrap py-20">
        <h2 className="font-display text-3xl text-zinc-950 md:text-5xl">{dict.value.title}</h2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {(["ai", "scale", "royaltyFree", "hiRes", "instant", "support"] as const).map((key, i) => {
            const it = dict.value.items[key];
            const labels = ["AI", "▣", "∞", "8K", "↓", "60d"];
            return (
              <li key={key} className="bg-white p-6 md:p-8">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-100 font-mono text-sm font-semibold text-accent-700">
                  {labels[i]}
                </div>
                <h3 className="font-display mt-4 text-xl text-zinc-950">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{it.body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="wrap pb-20">
        <div className="rounded-3xl bg-zinc-950 px-6 py-14 text-white md:px-12">
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent-300">Or buy the static pack</p>
          <h2 className="font-display mt-3 text-3xl md:text-5xl">
            {PRICING.masterBox.price}€ · one payment · all 15,000 renders.
          </h2>
          <a
            href="https://3dmanbox.com"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-300 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-400"
          >
            Visit 3dmanbox.com
          </a>
        </div>
      </section>
    </>
  );
}
