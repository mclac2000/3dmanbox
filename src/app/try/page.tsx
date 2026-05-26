import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TryForm } from "@/components/try/TryForm";
import { getDict, getLocale } from "@/lib/i18n";

export default async function TryPage() {
  const locale = await getLocale();
  const dict = await getDict(locale);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent-700">{dict.common.free} · AI</p>
              <h1 className="font-display mt-3 text-4xl text-zinc-950 md:text-6xl">{dict.try.title}</h1>
              <p className="mt-4 max-w-md text-zinc-600">{dict.try.subtitle}</p>
              <ul className="mt-8 space-y-3 text-sm text-zinc-700">
                {[
                  "Generated in ~10 seconds",
                  "Same style as our 15,000 renders",
                  "Watermarked preview · download with Club account",
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
            <div>
              <TryForm t={dict.try} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
