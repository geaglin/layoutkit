import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";
import { gapMap, type GapSize } from "./types";

const sizeToHeightMap: Record<GapSize, string> = {
  none: "h-0",
  xs: "h-1",
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
  xl: "h-8",
  "2xl": "h-12",
  "3xl": "h-16",
};

interface SpacerProps extends ComponentPropsWithoutRef<"div"> {
  size?: GapSize | "auto";
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = "auto", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          size === "auto" ? "flex-1" : sizeToHeightMap[size],
          className
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Spacer.displayName = "Spacer";
