import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "navy" | "outline" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
};

const base =
  "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  gold:
    "bg-gold-shine text-navy-900 hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5 focus-visible:ring-gold-400",
  navy:
    "bg-navy-800 text-white hover:bg-navy-700 hover:-translate-y-0.5 focus-visible:ring-navy-500",
  outline:
    "border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white focus-visible:ring-navy-500",
  ghost:
    "text-navy-800 hover:bg-navy-50 focus-visible:ring-navy-300",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-7 text-base",
  xl: "h-16 px-10 text-lg",
};

function classes(props: CommonProps) {
  return cn(
    base,
    variants[props.variant ?? "gold"],
    sizes[props.size ?? "lg"],
    props.fullWidth && "w-full",
    props.className,
  );
}

export function Button(
  props: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { variant, size, fullWidth, className, children, ...rest } = props;
  return (
    <button className={classes({ variant, size, fullWidth, className, children })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink(
  props: CommonProps & { href: string; external?: boolean },
) {
  const { variant, size, fullWidth, className, children, href, external } = props;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes({ variant, size, fullWidth, className, children })}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes({ variant, size, fullWidth, className, children })}>
      {children}
    </Link>
  );
}
