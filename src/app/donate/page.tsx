import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DonateForm } from "@/components/donate/DonateForm";
import { getDict, getLocale } from "@/lib/i18n";

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const { amount } = await searchParams;
  const locale = await getLocale();
  const dict = await getDict(locale);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.nav.donate}</p>
              <h1 className="font-display mt-3 text-4xl text-zinc-950 md:text-6xl">{dict.donate.title}</h1>
              <p className="mt-4 max-w-md text-zinc-600">{dict.donate.body}</p>
              <p className="mt-6 inline-flex max-w-md items-start gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600 ring-1 ring-zinc-200">
                <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-700">pixabay</span>
                <span>{dict.footer.fromPixabay}</span>
              </p>
            </div>
            <div>
              <DonateForm t={dict.donate} initial={amount} />
              <p className="mt-3 text-xs text-zinc-500">Stripe · secure payment · cards accepted worldwide</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
