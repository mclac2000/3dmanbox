import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCategories, getCategory } from "@/lib/gallery";
import { getDict, getLocale } from "@/lib/i18n";
import { PRICING, categoryPrice, categorySku } from "@/lib/site";

export default async function PricingPage() {
  const locale = await getLocale();
  const dict = await getDict(locale);
  const cats = await getCategories();
  const detailed = await Promise.all(cats.map(async (c) => ({ ...c, cat: await getCategory(c.slug) })));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap py-16">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.nav.pricing}</p>
          <h1 className="font-display mt-2 text-4xl text-zinc-950 md:text-6xl">{dict.pricing.title}</h1>
          <p className="mt-3 max-w-xl text-zinc-600">{dict.pricing.subtitle}</p>
        </section>

        {/* Two-column: Static pack vs. AI Club */}
        <section className="wrap pb-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.pricing.static}</p>
              <h2 className="font-display mt-2 text-2xl text-zinc-950">{dict.pricing.masterTitle}</h2>
              <p className="mt-1 text-sm text-zinc-600">{dict.pricing.masterTagline}</p>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-5xl font-semibold text-zinc-950">{PRICING.masterBox.price}€</span>
                <span className="text-zinc-400 line-through">{PRICING.masterBox.originalPrice}€</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.pricing.oneTime}</span>
              </div>
              <a
                href="/api/stripe/checkout?sku=MASTER_BOX"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {dict.pricing.buyMaster}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </a>
              <ul className="mt-6 space-y-2.5 text-sm text-zinc-700">
                {[
                  "15,000+ renders · 10 categories",
                  "8K PNG with transparency",
                  "Lifetime commercial license",
                  "60-day money-back",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent-300">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M3 6l2 2 4-5" stroke="currentColor" strokeWidth="1.75" />
                      </svg>
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-accent-300 bg-zinc-950 p-8 text-white">
              <div className="absolute inset-x-0 top-0 flex justify-center">
                <span className="rounded-b-md bg-accent-300 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-950">
                  {dict.pricing.popular}
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent-300">{dict.pricing.ai}</p>
              <h2 className="font-display mt-2 text-2xl">Pro</h2>
              <p className="mt-1 text-sm text-zinc-300">500 AI generations per month · all renders included</p>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-5xl font-semibold">29€</span>
                <span className="text-zinc-400">{dict.pricing.perMonth}</span>
              </div>
              <a
                href="https://3dman.club/pricing"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-300 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-400"
              >
                {dict.pricing.joinClub}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </a>
              <ul className="mt-6 space-y-2.5 text-sm text-zinc-200">
                {[
                  "Everything in Master Box",
                  "500 AI generations / month",
                  "LoRA fine-tuning",
                  "Cancel anytime",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-accent-300 text-zinc-950">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M3 6l2 2 4-5" stroke="currentColor" strokeWidth="1.75" />
                      </svg>
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Category boxes */}
        <section className="wrap py-12">
          <h2 className="font-display text-2xl text-zinc-950 md:text-3xl">{dict.pricing.categoryBoxes}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {detailed.map((d) => {
              const name = dict.categories.names[d.slug as keyof typeof dict.categories.names] ?? d.title;
              const cover = d.cat?.images[0]?.file ?? d.cover;
              return (
                <li key={d.slug} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                  <Link href={`/gallery/${d.slug}`} className="block">
                    <div className="relative aspect-square bg-zinc-50">
                      <Image src={`/gallery/${d.slug}/${cover}`} alt={name} fill sizes="200px" className="object-contain p-3" loading="lazy" />
                    </div>
                  </Link>
                  <div className="border-t border-zinc-100 p-4">
                    <p className="font-display text-base text-zinc-950">{name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{d.count} renders</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-display text-xl font-semibold text-zinc-950">{categoryPrice(d.slug)}€</span>
                      <a
                        href={`/api/stripe/checkout?sku=${categorySku(d.slug)}`}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
                      >
                        {dict.categories.buy}
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.pricing.vatNote}</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
