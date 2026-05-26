import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "Über uns — 3D Man Club",
  description: "Wer wir sind, warum wir das machen, und wofür wir stehen.",
};

export default function About() {
  return (
    <>
      <section className="bg-navy-gradient text-white">
        <div className="container-narrow py-20 text-center">
          <Badge variant="gold" className="bg-gold-400/10 border-gold-400/30 text-gold-200">
            Über uns
          </Badge>
          <h1 className="h-display mt-5 text-3xl text-white md:text-5xl">
            Wir bauen Visuals, die niemand mehr verstecken muss.
          </h1>
          <p className="mt-5 text-lg text-navy-100">
            Statt 80% Stockfoto-Klischees liefern wir konsistente, hochwertige 3D-Charaktere für die Inhalte, die du wirklich produzieren willst.
          </p>
        </div>
      </section>

      <Section background="white">
        <div className="container-narrow space-y-10 text-navy-700">
          <div>
            <h2 className="h-display text-2xl text-navy-900 md:text-3xl">Wer wir sind</h2>
            <p className="mt-4">
              3D Man wurde 2024 in Zürich gegründet — von einem Team aus 3D-Artists, KI-Engineers und Marketern, die zu oft selbst auf der Suche nach passenden Visuals saßen. Wir haben uns gefragt: Warum gibt es keine Bibliothek, die professionell aussieht, lebenslang gehört und nicht klischeehaft wirkt?
            </p>
            <p className="mt-3">
              Die Antwort war: Es gab keine. Also haben wir sie gebaut. Heute nutzen Marketingteams, Solopreneure und Agenturen aus 38 Ländern die 3D Man Box täglich.
            </p>
          </div>

          <div>
            <h2 className="h-display text-2xl text-navy-900 md:text-3xl">Wofür wir stehen</h2>
            <ul className="mt-4 space-y-3">
              <li><strong className="text-navy-900">Konsistenz vor Quantität:</strong> Lieber 1.000 perfekt aufeinander abgestimmte Charaktere als 10.000 zufällige.</li>
              <li><strong className="text-navy-900">Klarheit beim Preis:</strong> Einmalige Investition, lebenslange Nutzung, keine versteckten Lizenzgebühren.</li>
              <li><strong className="text-navy-900">EU first:</strong> Server in Falkenstein, DSGVO-konform, AVV auf Anfrage.</li>
              <li><strong className="text-navy-900">Menschlicher Support:</strong> Du schreibst uns — und kein Bot antwortet dir.</li>
            </ul>
          </div>

          <div>
            <h2 className="h-display text-2xl text-navy-900 md:text-3xl">Made in Switzerland 🇨🇭</h2>
            <p className="mt-4">
              Wir produzieren aus Zürich. Wir hosten in Falkenstein. Wir reden auf Augenhöhe mit dir. Wenn du Fragen hast, antwortet ein Mensch — und meistens innerhalb weniger Stunden.
            </p>
          </div>

          <div className="rounded-2xl bg-navy-50 p-7 text-center">
            <h3 className="h-display text-xl text-navy-900 md:text-2xl">Bereit, loszulegen?</h3>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="https://3dmanbox.com" external variant="gold" size="lg">
                Master Box · 197€
              </ButtonLink>
              <ButtonLink href="/pricing" variant="outline" size="lg">
                Preise ansehen
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
