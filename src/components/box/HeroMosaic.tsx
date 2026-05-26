import Image from "next/image";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n";
import { getCategories, getCategory } from "@/lib/gallery";
import { TRUST } from "@/lib/site";

export async function HeroMosaic() {
  const locale = await getLocale();
  const dict = await getDict(locale);
  const cats = await getCategories();
  // Pull first image from each of 10 categories for the mosaic
  const mosaic = await Promise.all(
    cats.slice(0, 10).map(async (c) => {
      const cat = await getCategory(c.slug);
      const file = cat?.images[0]?.file ?? c.cover;
      return { slug: c.slug, file, title: c.title, accent: c.accent };
    }),
  );

  return (
    <section className="relative overflow-hidden">
      <div className="bg-dotted absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div className="wrap grid grid-cols-1 items-start gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            <span className="font-mono uppercase tracking-wider text-[10px] text-zinc-500">{dict.hero.badge}</span>
          </div>

          <h1 className="font-display mt-6 text-4xl leading-[1.05] text-zinc-950 md:text-6xl lg:text-7xl">
            {dict.hero.title}
            <br />
            <span className="text-zinc-400">{dict.hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-zinc-600 md:text-lg">{dict.hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {dict.hero.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </Link>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:border-zinc-400"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-300 text-zinc-950">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6l2 2 4-5" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </span>
              {dict.hero.ctaSecondary}
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            <Stat label={dict.hero.stats.renders} value="15,000+" />
            <Stat label={dict.hero.stats.categories} value="10" />
            <Stat label={dict.hero.stats.creators} value={`${TRUST.customers.toLocaleString("en-US")}+`} />
            <Stat label={dict.hero.stats.countries} value={String(TRUST.countries)} />
          </dl>
        </div>

        {/* Mosaic 5×2 of category cover images */}
        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
            {mosaic.map((m, i) => (
              <Link
                key={m.slug}
                href={`/gallery/${m.slug}`}
                className={`group relative aspect-square overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200 transition hover:ring-zinc-400 ${
                  i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                }`}
                style={{ ["--accent" as string]: m.accent }}
              >
                <Image
                  src={`/gallery/${m.slug}/${m.file}`}
                  alt={m.title}
                  fill
                  sizes="(min-width: 1024px) 280px, 50vw"
                  className="object-contain p-2 transition duration-500 group-hover:scale-105"
                  priority={i < 3}
                />
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-md bg-white/85 px-2 py-1 text-[11px] font-medium text-zinc-700 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                  <span>{m.title}</span>
                  <span className="font-mono text-[10px] text-zinc-500">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</dt>
      <dd className="font-display mt-1 text-2xl font-semibold text-zinc-950">{value}</dd>
    </div>
  );
}
