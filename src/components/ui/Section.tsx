import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  className?: string;
  background?: "white" | "soft" | "navy" | "gold";
  children: React.ReactNode;
};

const bg: Record<NonNullable<Props["background"]>, string> = {
  white: "bg-white",
  soft: "bg-navy-50",
  navy: "bg-navy-gradient text-white",
  gold: "bg-gold-50",
};

export function Section({ id, className, background = "white", children }: Props) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", bg[background], className)}
    >
      {children}
    </section>
  );
}
