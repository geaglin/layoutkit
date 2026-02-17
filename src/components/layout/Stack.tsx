import { forwardRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";
import { gapMap, alignMap, justifyMap, paddingMap, type GapSize, type Align, type Justify, type Padding } from "./types";

interface StackProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  gap?: GapSize;
  align?: Align;
  justify?: Justify;
  center?: boolean;
  fill?: boolean;
  padding?: Padding;
  wrap?: boolean;
  as?: ElementType;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
  ({ children, gap = "md", align = "stretch", justify = "start", center, fill, padding = "none", wrap, as: Tag = "div", className, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          "flex flex-col",
          gapMap[gap],
          center ? "items-center justify-center" : cn(alignMap[align], justifyMap[justify]),
          fill && "min-h-screen",
          padding !== "none" && paddingMap[padding],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Stack.displayName = "Stack";
