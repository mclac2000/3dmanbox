import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function ClubHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-100 bg-white/80 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-navy-gradient text-gold-400 font-display text-lg font-bold">
            3D
          </div>
          <span className="font-display text-lg font-semibold text-navy-800">3D Man Club</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/galerie" className="text-sm font-medium text-navy-700 hover:text-navy-900">
            Galerie
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-navy-700 hover:text-navy-900">
            Preise
          </Link>
          <Link href="/about" className="text-sm font-medium text-navy-700 hover:text-navy-900">
            Über uns
          </Link>
          <a
            href="https://3dmanbox.com"
            className="text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            Master Box
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-navy-700 hover:text-navy-900 md:inline"
          >
            Login
          </Link>
          <ButtonLink href="/pricing" variant="gold" size="sm">
            Kostenlos starten
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
