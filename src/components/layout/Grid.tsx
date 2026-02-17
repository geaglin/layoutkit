import { forwardRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";
import { gapMap, type GapSize } from "./types";

const colsMap: Record<number, string> = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3",
  4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6",
  7: "grid-cols-7", 8: "grid-cols-8", 9: "grid-cols-9",
  10: "grid-cols-10", 11: "grid-cols-11", 12: "grid-cols-12",
};

// Derived from gapMap — replace "gap-" prefix with "gap-x-" / "gap-y-"
const gapXMap: Record<GapSize, string> = Object.fromEntries(
  Object.entries(gapMap).map(([k, v]) => [k, v.replace("gap-", "gap-x-")])
) as Record<GapSize, string>;

const gapYMap: Record<GapSize, string> = Object.fromEntries(
  Object.entries(gapMap).map(([k, v]) => [k, v.replace("gap-", "gap-y-")])
) as Record<GapSize, string>;

type ResponsiveCols = {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
};

const breakpointColsMap: Record<string, Record<number, string>> = {
  base: colsMap,
  sm: Object.fromEntries(Object.entries(colsMap).map(([k, v]) => [k, `sm:${v}`])),
  md: Object.fromEntries(Object.entries(colsMap).map(([k, v]) => [k, `md:${v}`])),
  lg: Object.fromEntries(Object.entries(colsMap).map(([k, v]) => [k, `lg:${v}`])),
  xl: Object.fromEntries(Object.entries(colsMap).map(([k, v]) => [k, `xl:${v}`])),
  "2xl": Object.fromEntries(Object.entries(colsMap).map(([k, v]) => [k, `2xl:${v}`])),
};

interface GridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  /** Column count — number for static, object for responsive breakpoints */
  cols?: number | ResponsiveCols;
  rows?: number;
  gap?: GapSize;
  colGap?: GapSize;
  rowGap?: GapSize;
  flow?: "row" | "col" | "dense";
  placeItems?: "start" | "center" | "end" | "stretch";
  /** Use auto-fit responsive grid instead of fixed cols */
  responsive?: boolean;
  minChildWidth?: string;
  as?: ElementType;
}

function resolveColsClasses(cols: number | ResponsiveCols): string {
  if (typeof cols === "number") return colsMap[cols] || `grid-cols-${cols}`;
  return Object.entries(cols)
    .map(([bp, n]) => breakpointColsMap[bp]?.[n] || (bp === "base" ? `grid-cols-${n}` : `${bp}:grid-cols-${n}`))
    .join(" ");
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  ({ children, cols = 1, rows, gap = "md", colGap, rowGap, flow, placeItems, responsive, minChildWidth = "250px", as: Tag = "div", className, ...props }, ref) => {
    const colsClass = responsive
      ? `grid-cols-[repeat(auto-fit,minmax(${minChildWidth},1fr))]`
      : resolveColsClasses(cols);

    return (
      <Tag
        ref={ref}
        className={cn(
          "grid",
          colsClass,
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
