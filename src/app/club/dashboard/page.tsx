import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Box, Sparkles, Download } from "@/components/ui/Icon";

export const metadata = {
  title: "Dashboard — 3D Man Club",
};

export default function Dashboard() {
  return (
    <Section background="soft" className="min-h-[calc(100vh-4rem)]">
      <div className="container-wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="gold">Dashboard</Badge>
            <h1 className="h-display mt-3 text-3xl text-navy-900 md:text-4xl">
              Hallo zurück 👋
            </h1>
          </div>
          <div className="rounded-xl bg-white px-5 py-3 shadow-soft">
            <div className="text-xs uppercase tracking-wider text-navy-500">Verbleibende Credits</div>
            <div className="font-display text-2xl font-bold text-navy-900">100</div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Link href="/galerie" className="group rounded-2xl bg-white p-6 shadow-soft transition hover:shadow-card">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-navy-100 text-navy-700">
              <Box size={20} />
            </div>
            <div className="mt-5 font-display text-lg font-semibold text-navy-900">
              Galerie öffnen
            </div>
            <p className="mt-1 text-sm text-navy-600">Browse durch 1.000+ Charaktere</p>
          </Link>

          <Link href="/dashboard/generator" className="group rounded-2xl bg-white p-6 shadow-soft transition hover:shadow-card">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-100 text-gold-700">
              <Sparkles size={20} />
            </div>
            <div className="mt-5 font-display text-lg font-semibold text-navy-900">
              KI-Generator
            </div>
            <p className="mt-1 text-sm text-navy-600">In Kürze verfügbar — Phase 2</p>
          </Link>

          <Link href="/dashboard/downloads" className="group rounded-2xl bg-white p-6 shadow-soft transition hover:shadow-card">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <Download size={20} />
            </div>
            <div className="mt-5 font-display text-lg font-semibold text-navy-900">
              Master Box ZIP
            </div>
            <p className="mt-1 text-sm text-navy-600">Direkt-Download (2,4 GB)</p>
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-7 md:p-10">
          <h2 className="font-display text-xl font-semibold text-navy-900">Letzte Aktivität</h2>
          <p className="mt-3 text-sm text-navy-500">
            Du hast noch keine Generierungen. Lege gleich mit deinem ersten Charakter los.
          </p>
        </div>
      </div>
    </Section>
  );
}
