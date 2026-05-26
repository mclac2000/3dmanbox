import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroMosaic } from "@/components/box/HeroMosaic";
import { MarqueeStrip } from "@/components/box/MarqueeStrip";
import { CategoriesGrid } from "@/components/box/CategoriesGrid";
import { ValueGrid } from "@/components/box/ValueGrid";
import { MasterCTA } from "@/components/box/MasterCTA";
import { TryAITeaser } from "@/components/box/TryAITeaser";
import { DonateBanner } from "@/components/box/DonateBanner";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroMosaic />
        <MarqueeStrip />
        <CategoriesGrid />
        <ValueGrid />
        <MasterCTA />
        <TryAITeaser />
        <DonateBanner />
      </main>
      <SiteFooter />
    </>
  );
}
