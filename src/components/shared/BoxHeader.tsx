import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function BoxHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-100 bg-white/80 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-navy-gradient text-gold-400 font-display text-lg font-bold">
            3D
          </div>
          <span className="font-display text-lg font-semibold text-navy-800">
            3D Man Box
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#mechanism" className="text-sm font-medium text-navy-700 hover:text-navy-900">
            So funktioniert&apos;s
          </a>
          <a href="#wert" className="text-sm font-medium text-navy-700 hover:text-navy-900">
            Was du bekommst
          </a>
          <a href="#faq" className="text-sm font-medium text-navy-700 hover:text-navy-900">
            FAQ
          </a>
        </nav>
        <ButtonLink href="#angebot" variant="gold" size="sm">
          Jetzt sichern
        </ButtonLink>
      </div>
    </header>
  );
}
