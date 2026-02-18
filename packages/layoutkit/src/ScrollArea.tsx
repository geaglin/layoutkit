import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";

interface ScrollAreaProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  direction?: "vertical" | "horizontal" | "both";
  maxHeight?: string;
  maxWidth?: string;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, direction = "vertical", maxHeight, maxWidth, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          direction === "vertical" && "overflow-y-auto",
          direction === "horizontal" && "overflow-x-auto",
          direction === "both" && "overflow-auto",
          maxHeight,
          maxWidth,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";
