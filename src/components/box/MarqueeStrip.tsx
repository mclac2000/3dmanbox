import Image from "next/image";
import { getCategories, getCategory } from "@/lib/gallery";

export async function MarqueeStrip() {
  const cats = await getCategories();
  const all = await Promise.all(cats.map((c) => getCategory(c.slug)));
  // Take 6 images from each category
  const items: { slug: string; file: string; title: string }[] = [];
  for (const cat of all) {
    if (!cat) continue;
    for (const img of cat.images.slice(0, 6)) {
      items.push({ slug: cat.slug, file: img.file, title: img.title });
    }
  }
  // duplicate for the seamless marquee
  const doubled = [...items, ...items];

  return (
    <section className="overflow-hidden border-y border-zinc-100 bg-zinc-50 py-6">
      <div className="flex animate-marquee items-center gap-3" style={{ width: "max-content" }}>
        {doubled.map((it, i) => (
          <div
            key={i}
            className="relative grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-zinc-200 sm:h-24 sm:w-24"
            aria-hidden="true"
          >
            <Image
              src={`/gallery/${it.slug}/${it.file}`}
              alt=""
              fill
              sizes="96px"
              className="object-contain p-2"
              loading={i < 24 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
