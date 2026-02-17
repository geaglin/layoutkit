import { forwardRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";

interface CenterProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  fill?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  inline?: boolean;
  as?: ElementType;
}

export const Center = forwardRef<HTMLElement, CenterProps>(
  ({ children, fill, horizontal, vertical, inline, as: Tag = "div", className, ...props }, ref) => {
    const bothAxes = !horizontal && !vertical;

    return (
      <Tag
        ref={ref}
        className={cn(
          inline ? "inline-flex" : "flex",
          "flex-col",
          (bothAxes || horizontal) && "items-center",
          (bothAxes || vertical) && "justify-center",
          fill && "min-h-screen",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Center.displayName = "Center";
