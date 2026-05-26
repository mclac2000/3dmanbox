import { BoxHeader } from "@/components/shared/BoxHeader";
import { BoxFooter } from "@/components/shared/BoxFooter";

export default function BoxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BoxHeader />
      <main className="flex-1">{children}</main>
      <BoxFooter />
    </>
  );
}
