import { Hero } from "@/components/box/Hero";
import { Problem } from "@/components/box/Problem";
import { Mechanism } from "@/components/box/Mechanism";
import { ValueStack } from "@/components/box/ValueStack";
import { SocialProof } from "@/components/box/SocialProof";
import { Authority } from "@/components/box/Authority";
import { Guarantee } from "@/components/box/Guarantee";
import { FAQ } from "@/components/box/FAQ";
import { ScarcityCTA } from "@/components/box/ScarcityCTA";
import { PostScriptum } from "@/components/box/PostScriptum";

export const metadata = {
  title: "3D Man Box — 1.000+ Premium 3D-Charaktere für nur 197€",
  description:
    "Stoppe die Stockfoto-Suche. 1.000+ konsistente, hochwertige 3D-Charaktere für Business-Visuals — einmal kaufen, lebenslang nutzen. 60 Tage Geld-zurück-Garantie.",
};

export default function BoxLanding() {
  return (
    <>
      <Hero />
      <Problem />
      <Mechanism />
      <ValueStack />
      <SocialProof />
      <Authority />
      <Guarantee />
      <FAQ />
      <ScarcityCTA />
      <PostScriptum />
    </>
  );
}
