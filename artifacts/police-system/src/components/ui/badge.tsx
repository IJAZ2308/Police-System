import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.2)]",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive/20 text-destructive border border-destructive/30 shadow-[0_0_10px_hsl(var(--destructive)/0.2)]",
    warning: "border-transparent bg-warning/20 text-warning border border-warning/30 shadow-[0_0_10px_hsl(var(--warning)/0.2)]",
    success: "border-transparent bg-success/20 text-success border border-success/30 shadow-[0_0_10px_hsl(var(--success)/0.2)]",
    outline: "text-foreground border-white/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wider font-display",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
