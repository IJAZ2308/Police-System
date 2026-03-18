import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-primary/90 text-primary-foreground hover:bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.5)] border border-primary/50",
      destructive: "bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-[0_0_15px_hsl(var(--destructive)/0.3)] hover:shadow-[0_0_25px_hsl(var(--destructive)/0.5)] border border-destructive/50",
      outline: "border border-border bg-background hover:bg-secondary hover:text-secondary-foreground hover:border-primary/50",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/5",
      ghost: "hover:bg-secondary hover:text-secondary-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-display uppercase tracking-wider",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
