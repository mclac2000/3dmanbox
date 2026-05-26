import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Check } from "@/components/ui/Icon";
import { PRICING } from "@/lib/site";
import { formatEUR } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const cat = PRICING.categoryBoxes.find((c) => c.slug === slug);
  if (!cat) return { title: "Kategorie nicht gefunden" };
  return {
    title: `${cat.name} — ${cat.count} 3D-Charaktere`,
    description: `Premium ${cat.name}-Charaktere für nur ${formatEUR(cat.price)}. Sofort-Download, kommerzielle Lizenz, 60-Tage-Garantie.`,
  };
}

export async function generateStaticParams() {
  return PRICING.categoryBoxes.map((c) => ({ slug: c.slug }));
}

const VISUAL_EMOJIS: Record<string, string[]> = {
  business: ["👨‍💼","👩‍💼","🧑‍💼","👨‍💻"],
  tech: ["👩‍💻","🧑‍💻","👨‍🚀","👩‍🔬"],
  healthcare: ["🧑‍⚕️","👩‍⚕️","👨‍⚕️","🧬"],
  education: ["👨‍🏫","👩‍🏫","🧑‍🎓","📚"],
  lifestyle: ["🧑‍🎨","👩‍🎤","🧘","🏃"],
  creative: ["👨‍🎨","🎭","🎬","🎸"],
};

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const cat = PRICING.categoryBoxes.find((c) => c.slug === slug);
  if (!cat) notFound();

  const emojis = VISUAL_EMOJIS[slug] || ["🧑","👤","👥","🧍"];

  return (
    <>
      <section className="bg-navy-gradient text-white">
        <div className="container-wide py-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <Badge variant="gold" className="bg-gold-400/10 border-gold-400/30 text-gold-200">
                Kategorie · {cat.count} Charaktere
              </Badge>
              <h1 className="h-display mt-5 text-4xl text-white md:text-5xl">
                {cat.name}
              </h1>
              <p className="mt-4 text-lg text-navy-100">
                Ein fokussiertes Paket für deine {cat.name}-Inhalte — konsistenter Stil, sofort einsetzbar, lebenslange Lizenz.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={`/api/stripe/checkout?sku=CAT_${slug.toUpperCase()}`}
                  variant="gold"
                  size="xl"
                >
                  Paket sichern · {formatEUR(cat.price)}
                </ButtonLink>
                <ButtonLink href="/" variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-navy-900">
                  Master Box · 197€
                </ButtonLink>
              </div>
              <ul className="mt-8 grid gap-2 text-navy-100">
                <li className="flex items-start gap-2"><Check size={18} className="mt-0.5 text-gold-300" /> {cat.count} 4K-Charaktere</li>
                <li className="flex items-start gap-2"><Check size={18} className="mt-0.5 text-gold-300" /> Lebenslange kommerzielle Lizenz</li>
                <li className="flex items-start gap-2"><Check size={18} className="mt-0.5 text-gold-300" /> 60-Tage-Geld-zurück-Garantie</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {emojis.map((e, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white/10 backdrop-blur grid place-items-center text-6xl ring-1 ring-white/10 md:text-7xl">
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section background="white">
        <div className="container-base text-center">
          <h2 className="h-display text-2xl text-navy-900 md:text-3xl">
            Brauchst du auch andere Kategorien?
          </h2>
          <p className="mt-3 text-navy-700">
            Statt jede Kategorie einzeln zu kaufen, hol dir die Master Box mit 1.000+ Charakteren aus allen 6 Bereichen für nur 197€.
          </p>
          <ButtonLink href="/" variant="navy" size="lg" className="mt-6">
            Master Box ansehen
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
