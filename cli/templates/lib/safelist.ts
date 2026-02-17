// All Tailwind classes used by LayoutKit components
export const LAYOUTKIT_SAFELIST: string[] = [
  // Flexbox layout
  "flex",
  "flex-col",
  "flex-row",
  "flex-row-reverse",
  "inline-flex",
  "flex-1",
  "flex-wrap",

  // Grid layout
  "grid",
  "grid-flow-col",
  "grid-flow-row",

  // Grid columns (1-12)
  "grid-cols-1",
  "grid-cols-2",
  "grid-cols-3",
  "grid-cols-4",
  "grid-cols-5",
  "grid-cols-6",
  "grid-cols-7",
  "grid-cols-8",
  "grid-cols-9",
  "grid-cols-10",
  "grid-cols-11",
  "grid-cols-12",

  // Alignment
  "items-start",
  "items-center",
  "items-end",
  "items-stretch",
  "items-baseline",

  // Justification
  "justify-start",
  "justify-center",
  "justify-end",
  "justify-between",
  "justify-around",
  "justify-evenly",

  // Gap
  "gap-0",
  "gap-1",
  "gap-2",
  "gap-4",
  "gap-6",
  "gap-8",
  "gap-12",
  "gap-16",

  // Padding
  "p-0",
  "p-1",
  "p-2",
  "p-4",
  "p-6",
  "p-8",
  "p-12",

  // Sizing
  "min-h-screen",
  "w-full",
  "h-full",

  // Overflow
  "overflow-y-auto",
  "overflow-x-auto",
  "overflow-auto",

  // Borders
  "border-t",
  "border-l",
  "border-gray-200",

  // Position
  "relative",
];

// Helper to add to tailwind.config.ts
export function withLayoutKit(config: Record<string, unknown>): Record<string, unknown> {
  const existing = (config.safelist as string[] | undefined) || [];
  return {
    ...config,
    safelist: [...existing, ...LAYOUTKIT_SAFELIST],
  };
}

// For Tailwind v4 CSS-first config
export const LAYOUTKIT_SAFELIST_CSS = LAYOUTKIT_SAFELIST
  .map(cls => `@utility ${cls};`)
  .join("\n");
