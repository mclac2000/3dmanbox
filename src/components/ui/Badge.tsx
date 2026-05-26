import { cn } from "@/lib/utils";

type Props = {
  variant?: "navy" | "gold" | "soft" | "success";
  className?: string;
  children: React.ReactNode;
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  navy: "bg-navy-800 text-white",
  gold: "bg-gold-100 text-gold-700 border border-gold-300",
  soft: "bg-navy-50 text-navy-700 border border-navy-100",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export function Badge({ variant = "soft", className, children }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
