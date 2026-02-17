import { forwardRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";
import { gapMap, type GapSize } from "./types";

const colsMap: Record<number, string> = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3",
  4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6",
  7: "grid-cols-7", 8: "grid-cols-8", 9: "grid-cols-9",
  10: "grid-cols-10", 11: "grid-cols-11", 12: "grid-cols-12",
};

const gapXMap: Record<GapSize, string> = {
  none: "gap-x-0", xs: "gap-x-1", sm: "gap-x-2", md: "gap-x-4",
  lg: "gap-x-6", xl: "gap-x-8", "2xl": "gap-x-12", "3xl": "gap-x-16",
};

const gapYMap: Record<GapSize, string> = {
  none: "gap-y-0", xs: "gap-y-1", sm: "gap-y-2", md: "gap-y-4",
  lg: "gap-y-6", xl: "gap-y-8", "2xl": "gap-y-12", "3xl": "gap-y-16",
};

interface GridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  cols?: number;
  rows?: number;
  gap?: GapSize;
  colGap?: GapSize;
  rowGap?: GapSize;
  flow?: "row" | "col" | "dense";
  placeItems?: "start" | "center" | "end" | "stretch";
  responsive?: boolean;
  minChildWidth?: string;
  as?: ElementType;
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  ({ children, cols = 1, rows, gap = "md", colGap, rowGap, flow, placeItems, responsive, minChildWidth = "250px", as: Tag = "div", className, ...props }, ref) => {
    // Use Tailwind arbitrary value class instead of inline style for CSP compliance
    const responsiveColsClass = responsive
      ? `grid-cols-[repeat(auto-fit,minmax(${minChildWidth},1fr))]`
      : colsMap[cols];

    return (
      <Tag
        ref={ref}
        className={cn(
          "grid",
          responsiveColsClass,
          rows && `grid-rows-${rows}`,
          !colGap && !rowGap && gapMap[gap],
          colGap && gapXMap[colGap],
          rowGap && gapYMap[rowGap],
          flow === "col" && "grid-flow-col",
          flow === "dense" && "grid-flow-dense",
          placeItems && `place-items-${placeItems}`,
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Grid.displayName = "Grid";
