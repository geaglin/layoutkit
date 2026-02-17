import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";

interface AspectRatioProps extends ComponentPropsWithoutRef<"div"> {
  ratio?: number;
  children: ReactNode;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
        {...props}
      >
        <div className="absolute inset-0">
          {children}
        </div>
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";
