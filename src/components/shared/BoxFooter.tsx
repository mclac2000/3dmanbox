import Link from "next/link";

export function BoxFooter() {
  return (
    <footer className="border-t border-navy-100 bg-navy-900 py-12 text-navy-100">
      <div className="container-wide grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-shine text-navy-900 font-display text-lg font-bold">
              3D
            </div>
            <span className="font-display text-lg font-semibold text-white">3D Man Box</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-navy-200">
            Premium 3D-Charaktere für Präsentationen, Webseiten und Marketing. Einmal kaufen, lebenslang nutzen.
          </p>
          <p className="mt-2 text-xs text-navy-300">
            Teil der{" "}
            <a href="https://3dman.club" className="underline hover:text-gold-300">
              3D Man Club Familie
            </a>
            .
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Produkt</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#mechanism" className="hover:text-gold-300">So funktioniert&apos;s</a></li>
            <li><a href="#wert" className="hover:text-gold-300">Was enthalten ist</a></li>
            <li><a href="#garantie" className="hover:text-gold-300">Garantie</a></li>
            <li><a href="#faq" className="hover:text-gold-300">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Rechtliches</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/impressum" className="hover:text-gold-300">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:text-gold-300">Datenschutz</Link></li>
            <li><Link href="/agb" className="hover:text-gold-300">AGB</Link></li>
            <li><Link href="/widerruf" className="hover:text-gold-300">Widerruf</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-wide mt-10 flex flex-col gap-3 border-t border-navy-700 pt-6 text-xs text-navy-300 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} 3D Man Box. Alle Rechte vorbehalten.</p>
        <p>Made in Switzerland 🇨🇭 — Hosted in EU 🇩🇪</p>
      </div>
    </footer>
  );
}
