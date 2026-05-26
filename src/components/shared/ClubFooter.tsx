import Link from "next/link";

export function ClubFooter() {
  return (
    <footer className="border-t border-navy-100 bg-navy-900 py-12 text-navy-100">
      <div className="container-wide grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-shine text-navy-900 font-display text-lg font-bold">
              3D
            </div>
            <span className="font-display text-lg font-semibold text-white">3D Man Club</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-navy-200">
            Dein KI-Studio für unbegrenzte 3D-Charaktere — perfekt für Marketing, Produkte und Inhalte, die wirklich auffallen.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Produkt</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/galerie" className="hover:text-gold-300">Galerie</Link></li>
            <li><Link href="/pricing" className="hover:text-gold-300">Preise</Link></li>
            <li><a href="https://3dmanbox.com" className="hover:text-gold-300">Master Box (197€)</a></li>
            <li><Link href="/about" className="hover:text-gold-300">Über uns</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Rechtliches</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/impressum" className="hover:text-gold-300">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:text-gold-300">Datenschutz</Link></li>
            <li><Link href="/agb" className="hover:text-gold-300">AGB</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-wide mt-10 flex flex-col gap-3 border-t border-navy-700 pt-6 text-xs text-navy-300 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} 3D Man Club. Alle Rechte vorbehalten.</p>
        <p>Made in Switzerland 🇨🇭</p>
      </div>
    </footer>
  );
}
