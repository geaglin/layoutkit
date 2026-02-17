const COMPONENT_MAP: Record<string, {
  base: string;
  props: Record<string, string | { replace: [string, string] }>;
  gapDefault?: string;
  alignDefault?: string;
  justifyDefault?: string;
  defaults?: Record<string, string>;
  selfClosing?: boolean;
}> = {
  Center: {
    base: "flex flex-col",
    props: {
      fill: "min-h-screen",
      horizontal: "items-center",
      vertical: "justify-center",
      inline: { replace: ["flex", "inline-flex"] },
    },
    defaults: { both: "items-center justify-center" },
  },
  Stack: {
    base: "flex flex-col",
    props: {
      fill: "min-h-screen",
      center: "items-center justify-center",
      wrap: "flex-wrap",
    },
    gapDefault: "md",
    alignDefault: "stretch",
    justifyDefault: "start",
  },
  Row: {
    base: "flex flex-row",
    props: {
      fill: "min-h-screen",
      center: "items-center justify-center",
      wrap: "flex-wrap",
      reverse: { replace: ["flex-row", "flex-row-reverse"] },
    },
    gapDefault: "md",
    alignDefault: "center",
    justifyDefault: "start",
  },
  Box: {
    base: "",
    props: {
      fill: "flex-1",
      center: "flex items-center justify-center",
    },
  },
  Spread: {
    base: "flex flex-row justify-between",
    props: {},
    alignDefault: "center",
  },
  Grid: {
    base: "grid",
    props: {},
    gapDefault: "md",
  },
  Spacer: { base: "flex-1", props: {}, selfClosing: true },
  Divider: { base: "w-full border-t border-gray-200", props: {}, selfClosing: true },
  ScrollArea: { base: "overflow-y-auto", props: {} },
  AspectRatio: { base: "relative", props: {} },
};

const GAP_MAP: Record<string, string> = {
  none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-4",
  lg: "gap-6", xl: "gap-8", "2xl": "gap-12", "3xl": "gap-16",
};

const PADDING_MAP: Record<string, string> = {
  none: "", xs: "p-1", sm: "p-2", md: "p-4",
  lg: "p-6", xl: "p-8", "2xl": "p-12",
};

const ALIGN_MAP: Record<string, string> = {
  start: "items-start", center: "items-center", end: "items-end",
  stretch: "items-stretch", baseline: "items-baseline",
};

const JUSTIFY_MAP: Record<string, string> = {
  start: "justify-start", center: "justify-center", end: "justify-end",
  between: "justify-between", around: "justify-around", evenly: "justify-evenly",
};

const COLS_MAP: Record<string, string> = {
  "1": "grid-cols-1", "2": "grid-cols-2", "3": "grid-cols-3", "4": "grid-cols-4",
  "5": "grid-cols-5", "6": "grid-cols-6", "7": "grid-cols-7", "8": "grid-cols-8",
  "9": "grid-cols-9", "10": "grid-cols-10", "11": "grid-cols-11", "12": "grid-cols-12",
};

function parseBooleanProps(propsStr: string): string[] {
  const found: string[] = [];
  const allMatches = propsStr.matchAll(/\b(\w+)\b(?!\s*=)/g);
  for (const m of allMatches) {
    found.push(m[1]);
  }
  return found;
}

function parseStringProps(propsStr: string): Array<[string, string]> {
  const found: Array<[string, string]> = [];
  const allMatches = propsStr.matchAll(/(\w+)="([^"]+)"/g);
  for (const m of allMatches) {
    found.push([m[1], m[2]]);
  }
  return found;
}

function parseNumericProps(propsStr: string): Array<[string, number]> {
  const found: Array<[string, number]> = [];
  const allMatches = propsStr.matchAll(/(\w+)=\{(\d+)\}/g);
  for (const m of allMatches) {
    found.push([m[1], parseInt(m[2], 10)]);
  }
  return found;
}

function compileTag(tagName: string, propsStr: string): string {
  const comp = COMPONENT_MAP[tagName];
  if (!comp) return "";

  let classes = comp.base ? comp.base.split(" ") : [];
  const propsFound: Record<string, string | number | boolean> = {};

  // Boolean props
  for (const prop of parseBooleanProps(propsStr)) {
    if (comp.props[prop]) {
      propsFound[prop] = true;
      const val = comp.props[prop];
      if (typeof val === "string") {
        classes.push(val);
      } else if (val.replace) {
        classes = classes.map(c => c === val.replace[0] ? val.replace[1] : c);
      }
    }
  }

  // String props
  for (const [prop, val] of parseStringProps(propsStr)) {
    propsFound[prop] = val;
    if (prop === "gap" && GAP_MAP[val]) classes.push(GAP_MAP[val]);
    else if (prop === "align" && ALIGN_MAP[val]) classes.push(ALIGN_MAP[val]);
    else if (prop === "justify" && JUSTIFY_MAP[val]) classes.push(JUSTIFY_MAP[val]);
    else if (prop === "padding" && PADDING_MAP[val]) classes.push(PADDING_MAP[val]);
    else if (prop === "cols" && COLS_MAP[val]) classes.push(COLS_MAP[val]);
    else if (prop === "className") classes.push(val);
  }

  // Numeric props
  for (const [prop, val] of parseNumericProps(propsStr)) {
    propsFound[prop] = val;
    if (prop === "cols" && COLS_MAP[String(val)]) classes.push(COLS_MAP[String(val)]);
  }

  // Apply defaults
  if (tagName === "Center" && !propsFound.horizontal && !propsFound.vertical) {
    classes.push("items-center", "justify-center");
  }
  if (comp.gapDefault && !propsFound.gap && !propsFound.center) {
    classes.push(GAP_MAP[comp.gapDefault]);
  }
  if (comp.alignDefault && !propsFound.align && !propsFound.center) {
    classes.push(ALIGN_MAP[comp.alignDefault]);
  }
  if (comp.justifyDefault && !propsFound.justify && !propsFound.center) {
    classes.push(JUSTIFY_MAP[comp.justifyDefault]);
  }

  classes = [...new Set(classes.filter(Boolean))];

  // Handle self-closing tags with special attributes
  if (comp.selfClosing) {
    if (tagName === "Spacer") {
      return `<div class="${classes.join(" ")}" aria-hidden="true"></div>`;
    }
    if (tagName === "Divider") {
      return `<div class="${classes.join(" ")}" role="separator"></div>`;
    }
  }

  return `<div class="${classes.join(" ")}">`;
}

/**
 * Compiles LayoutKit custom tags in HTML to standard divs with Tailwind classes.
 * Works with nested components and preserves non-LayoutKit HTML.
 */
export function compileLayoutKitHTML(html: string): string {
  let result = html;

  // Process self-closing tags first
  const selfClosingPattern = /<(Spacer|Divider)([^>]*)\s*\/>/g;
  const selfClosingMatches = [...result.matchAll(selfClosingPattern)];
  for (const match of selfClosingMatches) {
    const [fullMatch, tagName, propsStr] = match;
    const compiled = compileTag(tagName, propsStr);
    result = result.replace(fullMatch, compiled);
  }

  // Process opening tags
  const openingPattern = /<(Center|Stack|Row|Box|Spread|Grid|ScrollArea|AspectRatio)([^>]*)>/g;
  const openingMatches = [...result.matchAll(openingPattern)];
  for (const match of openingMatches) {
    const [fullMatch, tagName, propsStr] = match;
    const compiled = compileTag(tagName, propsStr);
    result = result.replace(fullMatch, compiled);
  }

  // Process closing tags
  const closingPattern = /<\/(Center|Stack|Row|Box|Spread|Grid|ScrollArea|AspectRatio)>/g;
  result = result.replace(closingPattern, "</div>");

  return result;
}

/**
 * Vite plugin that transforms LayoutKit tags in HTML files during build.
 */
export function layoutkitVitePlugin(): { name: string; transformIndexHtml(html: string): string } {
  return {
    name: "layoutkit-html",
    transformIndexHtml(html: string): string {
      return compileLayoutKitHTML(html);
    },
  };
}

/**
 * Generic file transform for build scripts.
 * Only processes .html and .htm files.
 */
export function transformFile(content: string, filename: string): string {
  if (filename.endsWith(".html") || filename.endsWith(".htm")) {
    return compileLayoutKitHTML(content);
  }
  return content;
}
