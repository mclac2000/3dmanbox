import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader context="club" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
