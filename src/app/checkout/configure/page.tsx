import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Stripe-Konfiguration ausstehend",
};

export default async function ConfigureNotice({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string }>;
}) {
  const { sku } = await searchParams;
  return (
    <Section background="soft" className="min-h-screen">
      <div className="container-narrow">
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-8 shadow-soft md:p-10">
          <Badge variant="gold" className="bg-amber-100 text-amber-800 border-amber-200">
            ⚠️ Stripe-Konfiguration ausstehend
          </Badge>
          <h1 className="h-display mt-4 text-2xl text-navy-900 md:text-3xl">
            Checkout noch nicht aktiviert
          </h1>
          <p className="mt-4 text-navy-700">
            Damit der Kauf funktioniert, müssen folgende Stripe-Daten in der Server-Konfiguration gesetzt sein:
          </p>
          <ul className="mt-4 space-y-2 font-mono text-sm text-navy-800">
            <li>STRIPE_SECRET_KEY=sk_live_…</li>
            <li>STRIPE_WEBHOOK_SECRET=whsec_…</li>
            <li>STRIPE_PRICE_{sku ?? "MASTER_BOX"}=price_…</li>
          </ul>
          <p className="mt-6 text-sm text-navy-600">
            Sobald die Werte gesetzt sind, ist der Kauf sofort live — kein Deploy nötig.
          </p>
        </div>
      </div>
    </Section>
  );
}
