import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
  spinnerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  spinnerClassName?: string;
}

export function LoadingButton({
  children,
  loading = false,
  loadingText,
  spinnerSize = "sm",
  spinnerClassName,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  // Map spinner sizes to appropriate width and height classes
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Button
      className={cn(className, 'cursor-pointer')}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2
            className={cn(
              "animate-spin",
              sizeClasses[spinnerSize],
              spinnerClassName
            )}
            aria-hidden="true"
          />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

