import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCategories, getCategory } from "@/lib/gallery";
import { getDict, getLocale } from "@/lib/i18n";
import { categoryPrice } from "@/lib/site";

export const dynamic = "force-static";

export default async function GalleryOverview() {
  const locale = await getLocale();
  const dict = await getDict(locale);
  const cats = await getCategories();
  const detailed = await Promise.all(
    cats.map(async (c) => ({ ...c, cat: await getCategory(c.slug) })),
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap pt-12 pb-6">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            {detailed.reduce((s, d) => s + (d.cat?.count ?? 0), 0).toLocaleString("en-US")} renders · 10 categories
          </p>
          <h1 className="font-display mt-2 text-4xl text-zinc-950 md:text-6xl">{dict.gallery.title}</h1>
          <p className="mt-3 max-w-xl text-zinc-600">{dict.gallery.subtitle}</p>
        </section>

        <section className="wrap pb-20">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {detailed.map((d) => {
              const name = dict.categories.names[d.slug as keyof typeof dict.categories.names] ?? d.title;
              const previews = d.cat?.images.slice(0, 6) ?? [];
              return (
                <li key={d.slug}>
                  <Link
                    href={`/gallery/${d.slug}`}
                    className="group block overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition hover:ring-zinc-400"
                  >
                    <div className="grid grid-cols-3 gap-px bg-zinc-100">
                      {previews.map((img, i) => (
                        <div key={i} className="relative aspect-square bg-white">
                          <Image
                            src={`/gallery/${d.slug}/${img.file}`}
                            alt={img.title}
                            fill
                            sizes="180px"
                            className="object-contain p-2"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between p-5">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: d.accent }}>
                          {d.count} renders
                        </p>
                        <h2 className="font-display mt-1 text-xl text-zinc-950">{name}</h2>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-xl font-semibold text-zinc-950">{categoryPrice(d.slug)}€</p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.pricing.oneTime}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
