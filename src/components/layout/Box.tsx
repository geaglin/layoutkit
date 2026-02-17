import { forwardRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";
import { paddingMap, type Padding } from "./types";

interface BoxProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  fill?: boolean;
  padding?: Padding;
  center?: boolean;
  as?: ElementType;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ children, fill, padding = "none", center, as: Tag = "div", className, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          fill && "flex-1",
          center && "flex items-center justify-center",
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

Box.displayName = "Box";
