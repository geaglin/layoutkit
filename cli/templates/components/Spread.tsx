import { forwardRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";
import { alignMap, paddingMap, type Align, type Padding } from "./types";

interface SpreadProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  align?: Align;
  padding?: Padding;
  as?: ElementType;
}

export const Spread = forwardRef<HTMLElement, SpreadProps>(
  ({ children, align = "center", padding = "none", as: Tag = "div", className, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          "flex flex-row",
          "justify-between",
          alignMap[align],
          padding !== "none" && paddingMap[padding],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Spread.displayName = "Spread";
