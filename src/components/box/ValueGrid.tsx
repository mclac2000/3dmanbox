import { getDict, getLocale } from "@/lib/i18n";

export async function ValueGrid() {
  const locale = await getLocale();
  const dict = await getDict(locale);
  const items = [
    { key: "scale", icon: "▣" },
    { key: "royaltyFree", icon: "∞" },
    { key: "hiRes", icon: "8K" },
    { key: "ai", icon: "AI" },
    { key: "support", icon: "60d" },
    { key: "instant", icon: "↓" },
  ] as const;

  return (
    <section className="wrap py-20">
      <h2 className="font-display max-w-2xl text-3xl text-zinc-950 md:text-5xl">{dict.value.title}</h2>
      <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ key, icon }) => {
          const it = dict.value.items[key];
          return (
            <li key={key} className="bg-white p-6 md:p-8">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-100 font-mono text-sm font-semibold text-accent-700">
                {icon}
              </div>
              <h3 className="font-display mt-4 text-xl text-zinc-950">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{it.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
