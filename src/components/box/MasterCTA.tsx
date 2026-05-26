import Link from "next/link";
import Image from "next/image";
import { getDict, getLocale } from "@/lib/i18n";
import { getCategories, getCategory } from "@/lib/gallery";
import { PRICING } from "@/lib/site";

export async function MasterCTA() {
  const locale = await getLocale();
  const dict = await getDict(locale);
  const cats = await getCategories();
  const featured = await Promise.all(cats.slice(0, 5).map((c) => getCategory(c.slug)));

  return (
    <section className="wrap py-20">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-14 text-white md:px-12 md:py-20">
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-accent-300/10 blur-3xl" />
        </div>
        <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent-300">
              {dict.pricing.masterTitle} · {dict.pricing.popular}
            </p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">
              All 10 categories. <br /> One file. <br /> <span className="text-accent-300">One payment.</span>
            </h2>
            <p className="mt-4 max-w-md text-zinc-300">{dict.pricing.masterTagline}</p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-display text-5xl font-semibold">{PRICING.masterBox.price}€</span>
              <span className="text-zinc-400 line-through">{PRICING.masterBox.originalPrice}€</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent-300">
                −{Math.round((1 - PRICING.masterBox.price / PRICING.masterBox.originalPrice) * 100)}%
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/api/stripe/checkout?sku=MASTER_BOX"
                className="inline-flex items-center gap-2 rounded-full bg-accent-300 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-400"
              >
                {dict.pricing.buyMaster}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {dict.pricing.categoryBoxes}
              </Link>
            </div>
            <p className="mt-3 text-xs text-zinc-500">{dict.pricing.vatNote}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3">
            {featured.flatMap((cat) =>
              cat
                ? cat.images.slice(0, 3).map((img, i) => (
                    <div key={`${cat.slug}-${i}`} className="relative aspect-square overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                      <Image
                        src={`/gallery/${cat.slug}/${img.file}`}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-contain p-2"
                        loading="lazy"
                      />
                    </div>
                  ))
                : [],
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
