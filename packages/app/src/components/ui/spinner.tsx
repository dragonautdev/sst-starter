import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "inherit";
  variant?: "default" | "primary" | "secondary" | "destructive";
}

export function Spinner({
  className,
  size = "md",
  variant = "primary",
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16",
    inherit: "w-full h-full",
  };

  const variantClasses = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    destructive: "text-destructive",
  };

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
        aria-hidden="true"
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}

// Usage example:
// <Spinner /> - Default medium size, primary color
// <Spinner size="xs" /> - Extra small spinner
// <Spinner size="inherit" className="h-[50px] w-[50px]" /> - Custom size
// <Spinner variant="secondary" /> - Different color variant
