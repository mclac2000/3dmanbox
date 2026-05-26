import { cn } from "@/lib/utils";

type Props = {
  size?: "narrow" | "base" | "wide";
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "main" | "article";
};

export function Container({ size = "base", className, children, as = "div" }: Props) {
  const cls = size === "narrow"
    ? "container-narrow"
    : size === "wide"
      ? "container-wide"
      : "container-base";
  const Tag = as;
  return <Tag className={cn(cls, className)}>{children}</Tag>;
}
