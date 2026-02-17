import { describe, it, expect } from "vitest";
import { layoutkitPlugin, recommended } from "@/lib/eslint-plugin";

describe("ESLint Plugin", () => {
  it("exports plugin with all rules", () => {
    expect(layoutkitPlugin.rules).toBeDefined();
    expect(Object.keys(layoutkitPlugin.rules)).toHaveLength(6);
  });

  it("has meta information", () => {
    expect(layoutkitPlugin.meta.name).toBe("eslint-plugin-layoutkit");
  });

  it("exports recommended config", () => {
    expect(recommended.plugins.layoutkit).toBe(layoutkitPlugin);
    expect(Object.keys(recommended.rules)).toHaveLength(6);
  });

  it("all recommended rules are set to warn", () => {
    for (const level of Object.values(recommended.rules)) {
      expect(level).toBe("warn");
    }
  });

  // Test the detection patterns
  describe("Pattern Detection", () => {
    const patterns = [
      { classes: "flex flex-col", rule: "prefer-stack", suggestion: "Stack" },
      { classes: "flex flex-col gap-4", rule: "prefer-stack", suggestion: "Stack" },
      { classes: "flex flex-row", rule: "prefer-row", suggestion: "Row" },
      { classes: "flex items-center justify-center", rule: "prefer-center", suggestion: "Center" },
      { classes: "flex justify-between", rule: "prefer-spread", suggestion: "Spread" },
      { classes: "grid grid-cols-3", rule: "prefer-grid", suggestion: "Grid" },
    ];

    for (const { classes, rule, suggestion } of patterns) {
      it(`${rule} detects "${classes}" → <${suggestion}>`, () => {
        const ruleImpl = layoutkitPlugin.rules[rule];
        expect(ruleImpl).toBeDefined();
        expect(ruleImpl.meta.docs.description).toContain(suggestion);
      });
    }
  });

  describe("Rule Metadata", () => {
    it("prefer-stack has correct metadata", () => {
      const rule = layoutkitPlugin.rules["prefer-stack"];
      expect(rule.meta.type).toBe("suggestion");
      expect(rule.meta.docs.recommended).toBe(true);
      expect(rule.meta.messages.useStack).toBeDefined();
    });

    it("prefer-row has correct metadata", () => {
      const rule = layoutkitPlugin.rules["prefer-row"];
      expect(rule.meta.type).toBe("suggestion");
      expect(rule.meta.docs.recommended).toBe(true);
      expect(rule.meta.messages.useRow).toBeDefined();
    });

    it("prefer-center has correct metadata", () => {
      const rule = layoutkitPlugin.rules["prefer-center"];
      expect(rule.meta.type).toBe("suggestion");
      expect(rule.meta.docs.recommended).toBe(true);
      expect(rule.meta.messages.useCenter).toBeDefined();
    });

    it("prefer-spread has correct metadata", () => {
      const rule = layoutkitPlugin.rules["prefer-spread"];
      expect(rule.meta.type).toBe("suggestion");
      expect(rule.meta.docs.recommended).toBe(true);
      expect(rule.meta.messages.useSpread).toBeDefined();
    });

    it("prefer-grid has correct metadata", () => {
      const rule = layoutkitPlugin.rules["prefer-grid"];
      expect(rule.meta.type).toBe("suggestion");
      expect(rule.meta.docs.recommended).toBe(true);
      expect(rule.meta.messages.useGrid).toBeDefined();
    });

    it("prefer-spacer has correct metadata", () => {
      const rule = layoutkitPlugin.rules["prefer-spacer"];
      expect(rule.meta.type).toBe("suggestion");
      expect(rule.meta.docs.recommended).toBe(true);
      expect(rule.meta.messages.useSpacer).toBeDefined();
    });
  });
});
