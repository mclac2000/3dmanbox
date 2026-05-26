import Image from "next/image";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n";
import { getCategories, getCategory } from "@/lib/gallery";
import { categoryPrice } from "@/lib/site";

export async function CategoriesGrid() {
  const locale = await getLocale();
  const dict = await getDict(locale);
  const cats = await getCategories();
  const detailed = await Promise.all(
    cats.map(async (c) => {
      const cat = await getCategory(c.slug);
      return { ...c, preview: cat?.images.slice(0, 4) ?? [] };
    }),
  );

  return (
    <section className="wrap py-20" id="categories">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">10 / 10</p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl text-zinc-950 md:text-5xl">{dict.categories.title}</h2>
          <p className="mt-3 max-w-xl text-zinc-600">{dict.categories.subtitle}</p>
        </div>
        <Link
          href="/gallery"
          className="hidden shrink-0 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 md:inline-block"
        >
          {dict.categories.viewAll} →
        </Link>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {detailed.map((cat) => {
          const name = dict.categories.names[cat.slug as keyof typeof dict.categories.names] ?? cat.title;
          const desc = dict.categories.descriptions[cat.slug as keyof typeof dict.categories.descriptions] ?? "";
          return (
            <li key={cat.slug} className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 transition hover:ring-zinc-400">
              <Link href={`/gallery/${cat.slug}`} className="block">
                <div className="grid grid-cols-2 gap-px bg-zinc-100" aria-hidden="true">
                  {cat.preview.map((img, i) => (
                    <div key={i} className="relative aspect-square bg-white">
                      <Image
                        src={`/gallery/${cat.slug}/${img.file}`}
                        alt={img.title}
                        fill
                        sizes="240px"
                        className="object-contain p-3"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: cat.accent }}>
                      {cat.count} {dict.categories.imagesIn}
                    </p>
                    <h3 className="font-display mt-1 text-xl text-zinc-950">{name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold text-zinc-950">{categoryPrice(cat.slug)}€</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.pricing.oneTime}</p>
                  </div>
                </div>
                <div className="absolute inset-x-5 bottom-5 hidden">
                  <span className="rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white">{dict.categories.buy} →</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
