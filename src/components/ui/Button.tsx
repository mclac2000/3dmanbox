import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "accent";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-zinc-950 text-white hover:bg-zinc-800 active:bg-zinc-900",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
  outline: "bg-white text-zinc-950 border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50",
  accent: "bg-accent-300 text-zinc-950 hover:bg-accent-400 active:bg-accent-500 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs font-medium",
  md: "px-4 py-2.5 text-sm font-semibold",
  lg: "px-6 py-3.5 text-base font-semibold",
};

function classes(variant: Variant, size: Size, extra?: string) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full transition",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2",
    variants[variant],
    sizes[size],
    extra ?? "",
  ].join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a href={href} className={classes(variant, size, className)} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}
