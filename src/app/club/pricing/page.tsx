import { PRICING } from "@/lib/site";
import { getDict, getLocale } from "@/lib/i18n";

export default async function ClubPricing() {
  const locale = await getLocale();
  const dict = await getDict(locale);

  return (
    <section className="wrap py-16">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.nav.pricing}</p>
      <h1 className="font-display mt-2 text-4xl text-zinc-950 md:text-6xl">Club plans</h1>
      <p className="mt-3 max-w-xl text-zinc-600">{dict.pricing.subtitle}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING.credits.map((p) => (
          <div
            key={p.slug}
            className={`relative rounded-2xl border bg-white p-6 ${
              p.featured ? "border-accent-300 ring-2 ring-accent-100" : "border-zinc-200"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-300 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-950">
                {dict.pricing.popular}
              </span>
            )}
            <h2 className="font-display text-xl text-zinc-950">{p.name}</h2>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-semibold text-zinc-950">{p.price}€</span>
              {p.interval && <span className="text-sm text-zinc-500">{dict.pricing.perMonth}</span>}
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              {p.credits === -1 ? "Unlimited generations" : `${p.credits} AI generations`}
            </p>
            <a
              href={`/api/stripe/checkout?sku=${p.sku}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Get started
            </a>
          </div>
        ))}
      </div>

      <p className="mt-12 font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.pricing.vatNote}</p>
    </section>
  );
}
