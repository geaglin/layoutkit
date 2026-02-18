import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "./utils";

const thicknessMap = {
  thin: "border-t",
  medium: "border-t-2",
  thick: "border-t-4",
} as const;

const verticalThicknessMap = {
  thin: "border-l",
  medium: "border-l-2",
  thick: "border-l-4",
} as const;

interface DividerProps extends ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
  color?: string;
  thickness?: "thin" | "medium" | "thick";
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", color = "border-gray-200", thickness = "thin", className, ...props }, ref) => {
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          isHorizontal
            ? cn("w-full", thicknessMap[thickness])
            : cn("h-full self-stretch", verticalThicknessMap[thickness]),
          color,
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
