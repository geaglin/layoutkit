import { describe, it, expect } from "vitest";
import { parseJSXToTailwind } from "@/lib/compiler";

describe("Compiler", () => {
  it("compiles <Center> to flex with centering classes", () => {
    const { results } = parseJSXToTailwind("<Center>");
    expect(results).toHaveLength(1);
    expect(results[0].tailwindClasses).toContain("flex");
    expect(results[0].tailwindClasses).toContain("items-center");
    expect(results[0].tailwindClasses).toContain("justify-center");
  });

  it("compiles <Center fill> with min-h-screen", () => {
    const { results } = parseJSXToTailwind("<Center fill>");
    expect(results[0].tailwindClasses).toContain("min-h-screen");
  });

  it("compiles <Stack> with default gap and align", () => {
    const { results } = parseJSXToTailwind("<Stack>");
    expect(results[0].tailwindClasses).toContain("flex-col");
    expect(results[0].tailwindClasses).toContain("gap-4");
    expect(results[0].tailwindClasses).toContain("items-stretch");
  });

  it('compiles <Stack gap="lg"> with gap-6', () => {
    const { results } = parseJSXToTailwind('<Stack gap="lg">');
    expect(results[0].tailwindClasses).toContain("gap-6");
  });

  it("compiles <Stack center> with centering classes", () => {
    const { results } = parseJSXToTailwind("<Stack center>");
    expect(results[0].tailwindClasses).toContain("items-center");
    expect(results[0].tailwindClasses).toContain("justify-center");
  });

  it("compiles <Row> with flex-row", () => {
    const { results } = parseJSXToTailwind("<Row>");
    expect(results[0].tailwindClasses).toContain("flex-row");
    expect(results[0].tailwindClasses).toContain("items-center");
  });

  it("compiles <Row reverse> with flex-row-reverse", () => {
    const { results } = parseJSXToTailwind("<Row reverse>");
    expect(results[0].tailwindClasses).toContain("flex-row-reverse");
  });

  it("compiles <Box fill> with flex-1", () => {
    const { results } = parseJSXToTailwind("<Box fill>");
    expect(results[0].tailwindClasses).toContain("flex-1");
  });

  it("compiles <Spread> with justify-between", () => {
    const { results } = parseJSXToTailwind("<Spread>");
    expect(results[0].tailwindClasses).toContain("justify-between");
    expect(results[0].tailwindClasses).toContain("items-center");
  });

  it("compiles <Grid cols={3}> with grid-cols-3", () => {
    const { results } = parseJSXToTailwind("<Grid cols={3}>");
    expect(results[0].tailwindClasses).toContain("grid");
    expect(results[0].tailwindClasses).toContain("grid-cols-3");
  });

  it("compiles <Spacer> with flex-1", () => {
    const { results } = parseJSXToTailwind("<Spacer>");
    expect(results[0].tailwindClasses).toBe("flex-1");
  });

  it("compiles <Divider> with border-t", () => {
    const { results } = parseJSXToTailwind("<Divider>");
    expect(results[0].tailwindClasses).toContain("border-t");
    expect(results[0].tailwindClasses).toContain("w-full");
  });

  it("handles multiple components in input", () => {
    const { results } = parseJSXToTailwind("<Stack>\n  <Center>\n  </Center>\n</Stack>");
    expect(results).toHaveLength(2);
    expect(results[0].component).toBe("Stack");
    expect(results[1].component).toBe("Center");
  });

  it("merges className prop", () => {
    const { results } = parseJSXToTailwind('<Stack className="border-b">');
    expect(results[0].tailwindClasses).toContain("border-b");
  });

  it("generates HTML output", () => {
    const { results } = parseJSXToTailwind("<Center>");
    expect(results[0].htmlOutput).toMatch(/^<div class="/);
  });

  it("ignores non-LayoutKit components", () => {
    const { results } = parseJSXToTailwind("<div><span>hello</span></div>");
    expect(results).toHaveLength(0);
  });
});

describe("Compiler Linting", () => {
  it("warns on redundant Center axes", () => {
    const { lintWarnings } = parseJSXToTailwind("<Center horizontal vertical>");
    expect(lintWarnings).toHaveLength(1);
    expect(lintWarnings[0].severity).toBe("warning");
    expect(lintWarnings[0].message).toContain("Redundant");
  });

  it('suggests Spread for Row justify="between"', () => {
    const { lintWarnings } = parseJSXToTailwind('<Row justify="between">');
    expect(lintWarnings).toHaveLength(1);
    expect(lintWarnings[0].severity).toBe("suggestion");
    expect(lintWarnings[0].message).toContain("Spread");
  });

  it("warns on conflicting center and align", () => {
    const { lintWarnings } = parseJSXToTailwind('<Stack center align="start">');
    expect(lintWarnings).toHaveLength(1);
    expect(lintWarnings[0].message).toContain("Conflicting");
  });

  it('warns on unnecessary gap="none"', () => {
    const { lintWarnings } = parseJSXToTailwind('<Stack gap="none">');
    expect(lintWarnings).toHaveLength(1);
    expect(lintWarnings[0].severity).toBe("suggestion");
  });

  it("reports no warnings for clean code", () => {
    const { lintWarnings } = parseJSXToTailwind('<Stack gap="lg" center>');
    expect(lintWarnings).toHaveLength(0);
  });
});
