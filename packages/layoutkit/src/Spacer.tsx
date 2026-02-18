import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";
import { type GapSize } from "./types";

const sizeToHeightMap: Record<GapSize, string> = {
  none: "h-0",
  px: "h-px",
  "0.5": "h-0.5",
  "1": "h-1",
  "1.5": "h-1.5",
  "2": "h-2",
  "2.5": "h-2.5",
  "3": "h-3",
  "3.5": "h-3.5",
  "4": "h-4",
  "5": "h-5",
  "6": "h-6",
  "7": "h-7",
  "8": "h-8",
  "9": "h-9",
  "10": "h-10",
  "11": "h-11",
  "12": "h-12",
  "14": "h-14",
  "16": "h-16",
  // Semantic aliases
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
