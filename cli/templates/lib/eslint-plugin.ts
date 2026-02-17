/**
 * ESLint Plugin for LayoutKit
 *
 * Detects raw Tailwind CSS patterns that could be replaced with LayoutKit components.
 */

import type { Rule } from "eslint";

// JSXAttribute type from ESTree
interface JSXAttribute {
  type: "JSXAttribute";
  name: {
    type: string;
    name?: string;
  };
  value?: {
    type: string;
    value?: string;
    expression?: {
      type: string;
      quasis?: Array<{ value: { cooked?: string } }>;
    };
  } | null;
}

// Utility to extract className value from JSXAttribute node
function getClassNameValue(node: JSXAttribute): string | null {
  if (!node.value) return null;

  // String literal: className="flex flex-col"
  if (node.value.type === "Literal" && typeof node.value.value === "string") {
    return node.value.value;
  }

  // Template literal: className={`flex flex-col`}
  if (node.value.type === "JSXExpressionContainer" &&
      node.value.expression &&
      node.value.expression.type === "TemplateLiteral") {
    const { quasis } = node.value.expression;
    // Only handle simple template literals without expressions
    if (quasis && quasis.length === 1) {
      return quasis[0].value.cooked || null;
    }
  }

  return null;
}

// prefer-stack: flex flex-col [gap-*]
const preferStackRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Suggest <Stack> component instead of flex flex-col",
      recommended: true,
    },
    messages: {
      useStack: 'Raw Tailwind "{{ classes }}" detected. Consider using <Stack{{ props }}> for better semantics.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSXAttribute(node: any) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "className") {
          return;
        }

        const classes = getClassNameValue(node);
        if (!classes) return;

        const hasFlexCol = /\bflex\s+flex-col\b/.test(classes);
        if (!hasFlexCol) return;

        // Extract gap if present
        const gapMatch = classes.match(/\bgap-(\w+)\b/);
        const props = gapMatch ? ` gap="${gapMatch[1]}"` : "";

        context.report({
          node,
          messageId: "useStack",
          data: {
            classes: classes.trim(),
            props,
          },
        });
      },
    };
  },
};

// prefer-row: flex flex-row [gap-*]
const preferRowRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Suggest <Row> component instead of flex flex-row",
      recommended: true,
    },
    messages: {
      useRow: 'Raw Tailwind "{{ classes }}" detected. Consider using <Row{{ props }}> for better semantics.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSXAttribute(node: any) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "className") {
          return;
        }

        const classes = getClassNameValue(node);
        if (!classes) return;

        const hasFlexRow = /\bflex\s+flex-row\b/.test(classes) ||
                          (/\bflex\b/.test(classes) && /\bgap-\w+\b/.test(classes) && !/\bflex-col\b/.test(classes));
        if (!hasFlexRow) return;

        // Extract gap if present
        const gapMatch = classes.match(/\bgap-(\w+)\b/);
        const props = gapMatch ? ` gap="${gapMatch[1]}"` : "";

        context.report({
          node,
          messageId: "useRow",
          data: {
            classes: classes.trim(),
            props,
          },
        });
      },
    };
  },
};

// prefer-center: flex items-center justify-center
const preferCenterRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Suggest <Center> component instead of flex items-center justify-center",
      recommended: true,
    },
    messages: {
      useCenter: 'Raw Tailwind "{{ classes }}" detected. Consider using <Center> for better semantics.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSXAttribute(node: any) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "className") {
          return;
        }

        const classes = getClassNameValue(node);
        if (!classes) return;

        const hasCenterPattern = /\bflex\b/.test(classes) &&
                                /\bitems-center\b/.test(classes) &&
                                /\bjustify-center\b/.test(classes);
        if (!hasCenterPattern) return;

        context.report({
          node,
          messageId: "useCenter",
          data: {
            classes: classes.trim(),
          },
        });
      },
    };
  },
};

// prefer-spread: flex justify-between
const preferSpreadRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Suggest <Spread> component instead of flex justify-between",
      recommended: true,
    },
    messages: {
      useSpread: 'Raw Tailwind "{{ classes }}" detected. Consider using <Spread> for better semantics.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSXAttribute(node: any) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "className") {
          return;
        }

        const classes = getClassNameValue(node);
        if (!classes) return;

        const hasSpreadPattern = /\bflex\b/.test(classes) && /\bjustify-between\b/.test(classes);
        if (!hasSpreadPattern) return;

        context.report({
          node,
          messageId: "useSpread",
          data: {
            classes: classes.trim(),
          },
        });
      },
    };
  },
};

// prefer-grid: grid grid-cols-*
const preferGridRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Suggest <Grid> component instead of grid grid-cols-*",
      recommended: true,
    },
    messages: {
      useGrid: 'Raw Tailwind "{{ classes }}" detected. Consider using <Grid cols={{ cols }}> for better semantics.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSXAttribute(node: any) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "className") {
          return;
        }

        const classes = getClassNameValue(node);
        if (!classes) return;

        const gridColsMatch = classes.match(/\bgrid\s+grid-cols-(\w+)\b/);
        if (!gridColsMatch) return;

        const cols = gridColsMatch[1];

        context.report({
          node,
          messageId: "useGrid",
          data: {
            classes: classes.trim(),
            cols,
          },
        });
      },
    };
  },
};

// prefer-spacer: flex-1 on empty div
const preferSpacerRule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Suggest <Spacer /> instead of flex-1 on empty div",
      recommended: true,
    },
    messages: {
      useSpacer: 'Empty element with "flex-1" detected. Consider using <Spacer /> for better semantics.',
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSXAttribute(node: any) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "className") {
          return;
        }

        const classes = getClassNameValue(node);
        if (!classes) return;

        const hasFlex1 = /\bflex-1\b/.test(classes);
        if (!hasFlex1) return;

        // Check if parent JSXElement is empty (this is a simplification)
        // In a real implementation, we'd need to traverse up and check children
        context.report({
          node,
          messageId: "useSpacer",
          data: {
            classes: classes.trim(),
          },
        });
      },
    };
  },
};

// Rule definitions
const rules = {
  "prefer-stack": preferStackRule,
  "prefer-row": preferRowRule,
  "prefer-center": preferCenterRule,
  "prefer-spread": preferSpreadRule,
  "prefer-grid": preferGridRule,
  "prefer-spacer": preferSpacerRule,
};

// Flat config plugin export
export const layoutkitPlugin = {
  meta: {
    name: "eslint-plugin-layoutkit",
    version: "0.1.0"
  },
  rules,
};

// Recommended config preset
export const recommended = {
  plugins: { layoutkit: layoutkitPlugin },
  rules: {
    "layoutkit/prefer-stack": "warn",
    "layoutkit/prefer-row": "warn",
    "layoutkit/prefer-center": "warn",
    "layoutkit/prefer-spread": "warn",
    "layoutkit/prefer-grid": "warn",
    "layoutkit/prefer-spacer": "warn",
  },
};
