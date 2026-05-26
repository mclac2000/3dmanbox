import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n";

export async function SiteFooter() {
  const locale = await getLocale();
  const dict = await getDict(locale);

  return (
    <footer className="mt-24 border-t border-zinc-100 bg-zinc-50">
      <div className="wrap py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-zinc-950 text-white">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 4l5-3 5 3v8l-5 3-5-3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M3 4l5 3 5-3M8 7v8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <span>3D Man Box</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-zinc-600">{dict.footer.tagline}</p>
            <p className="mt-4 inline-flex max-w-md items-start gap-2 rounded-xl bg-white px-3 py-2 text-xs text-zinc-600 ring-1 ring-zinc-200">
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-700">pixabay</span>
              <span>{dict.footer.fromPixabay}</span>
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.footer.product}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/gallery" className="text-zinc-700 hover:text-zinc-950">{dict.footer.links.gallery}</Link></li>
              <li><Link href="/pricing" className="text-zinc-700 hover:text-zinc-950">{dict.footer.links.pricing}</Link></li>
              <li><Link href="/try" className="text-zinc-700 hover:text-zinc-950">{dict.footer.links.tryAi}</Link></li>
              <li><a href="https://3dman.club" className="text-zinc-700 hover:text-zinc-950">{dict.footer.links.club}</a></li>
              <li><Link href="/donate" className="text-zinc-700 hover:text-zinc-950">{dict.footer.links.donate}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{dict.footer.legal}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/imprint" className="text-zinc-700 hover:text-zinc-950">{dict.footer.links.imprint}</Link></li>
              <li><Link href="/privacy" className="text-zinc-700 hover:text-zinc-950">{dict.footer.links.privacy}</Link></li>
              <li><Link href="/terms" className="text-zinc-700 hover:text-zinc-950">{dict.footer.links.terms}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>{dict.footer.rights}</p>
          <p className="font-mono">
            3dmanbox.com · <a href="https://3dman.club" className="hover:text-zinc-900">3dman.club</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
