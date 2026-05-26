import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n";

export async function DonateBanner() {
  const locale = await getLocale();
  const dict = await getDict(locale);

  return (
    <section className="wrap py-12">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.nav.donate}</p>
          <h3 className="font-display mt-1 text-xl text-zinc-950 md:text-2xl">{dict.donate.title}</h3>
          <p className="mt-1 max-w-xl text-sm text-zinc-600">{dict.donate.body}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {dict.donate.amounts.map((a) => (
            <Link
              key={a}
              href={`/donate?amount=${a}`}
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {a}€
            </Link>
          ))}
          <Link
            href="/donate"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
          >
            {dict.donate.custom}
          </Link>
        </div>
      </div>
    </section>
  );
}
