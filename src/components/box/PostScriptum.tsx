import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export function PostScriptum() {
  return (
    <Section id="ps" background="white" className="py-12 md:py-16">
      <div className="container-narrow">
        <div className="rounded-2xl border-l-4 border-gold-400 bg-navy-50 p-7 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500">
            P.S.
          </p>
          <p className="mt-3 text-lg leading-relaxed text-navy-800 md:text-xl">
            Lass mich ehrlich sein: Du bist heute hier, weil du dir Visuals wünschst, die dein Business endlich professionell aussehen lassen — ohne dass du jedes Mal stundenlang suchst, Designer beauftragst oder Lizenzgebühren zahlst.
          </p>
          <p className="mt-4 text-navy-700">
            Du kannst diese Seite jetzt schließen und in 2 Wochen wieder genau dasselbe Problem haben. Oder du investierst 197€ — weniger, als dich ein einziger Designer-Auftrag kosten würde — und löst es <em>einmal und für immer</em>.
          </p>
          <p className="mt-4 text-navy-700">
            Die 60-Tage-Garantie nimmt dir jedes Risiko. Wenn die Box nicht hält, was wir versprechen, bekommst du jeden Cent zurück. Du hast also nichts zu verlieren — außer einer weiteren Woche ohne professionelle Visuals.
          </p>
          <p className="mt-5 font-display text-xl font-semibold text-navy-900">
            Klick unten. In 5 Minuten hast du die Box in der Hand.
          </p>

          <div className="mt-7">
            <ButtonLink href="#angebot" variant="gold" size="lg">
              Ja, ich will die Box — 197€
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm text-navy-500">
            — Marco &amp; das 3D Man Team
          </p>
        </div>
      </div>
    </Section>
  );
}
