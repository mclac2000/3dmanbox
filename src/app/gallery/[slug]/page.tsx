import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Masonry } from "@/components/gallery/Masonry";
import { StickyBuy } from "@/components/gallery/StickyBuy";
import { getCategories, getCategory } from "@/lib/gallery";
import { getDict, getLocale } from "@/lib/i18n";
import { categoryPrice, categorySku } from "@/lib/site";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) notFound();
  const locale = await getLocale();
  const dict = await getDict(locale);
  const name = dict.categories.names[slug as keyof typeof dict.categories.names] ?? cat.title;
  const desc = dict.categories.descriptions[slug as keyof typeof dict.categories.descriptions] ?? "";
  const price = categoryPrice(slug);
  const sku = categorySku(slug);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-24">
        <section className="wrap pt-10">
          <Link href="/gallery" className="font-mono text-xs text-zinc-500 transition hover:text-zinc-900">
            {dict.gallery.back}
          </Link>
          <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: cat.accent }}>
                {cat.count} renders
              </p>
              <h1 className="font-display mt-2 text-4xl text-zinc-950 md:text-6xl">{name}</h1>
              <p className="mt-3 max-w-xl text-zinc-600">{desc}</p>
            </div>
            <div className="flex items-end gap-4">
              <div className="text-right">
                <p className="font-display text-3xl font-semibold text-zinc-950">{price}€</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.pricing.oneTime}</p>
              </div>
              <a
                href={`/api/stripe/checkout?sku=${sku}`}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {dict.categories.buy}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className="wrap mt-10">
          <Masonry slug={slug} images={cat.images} />
        </section>

        <StickyBuy sku={sku} label={name} altLabel={`${cat.count} renders · ${dict.pricing.oneTime}`} price={price} />
      </main>
      <SiteFooter />
    </>
  );
}
