import { ClubHeader } from "@/components/shared/ClubHeader";
import { ClubFooter } from "@/components/shared/ClubFooter";

export default function ClubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClubHeader />
      <main className="flex-1">{children}</main>
      <ClubFooter />
    </>
  );
}
