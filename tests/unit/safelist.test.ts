import { describe, it, expect } from "vitest";
import { LAYOUTKIT_SAFELIST, withLayoutKit } from "@/lib/safelist";

describe("Safelist", () => {
  it("exports a non-empty array of classes", () => {
    expect(LAYOUTKIT_SAFELIST.length).toBeGreaterThan(0);
  });

  it("includes core flex classes", () => {
    expect(LAYOUTKIT_SAFELIST).toContain("flex");
    expect(LAYOUTKIT_SAFELIST).toContain("flex-col");
    expect(LAYOUTKIT_SAFELIST).toContain("flex-row");
  });

  it("includes all gap sizes", () => {
    expect(LAYOUTKIT_SAFELIST).toContain("gap-0");
    expect(LAYOUTKIT_SAFELIST).toContain("gap-4");
    expect(LAYOUTKIT_SAFELIST).toContain("gap-16");
  });

  it("includes all grid-cols", () => {
    for (let i = 1; i <= 12; i++) {
      expect(LAYOUTKIT_SAFELIST).toContain(`grid-cols-${i}`);
    }
  });

  it("has no duplicates", () => {
    const unique = new Set(LAYOUTKIT_SAFELIST);
    expect(unique.size).toBe(LAYOUTKIT_SAFELIST.length);
  });

  it("withLayoutKit merges safelist into config", () => {
    const config = withLayoutKit({ theme: {} });
    expect(Array.isArray(config.safelist)).toBe(true);
    expect((config.safelist as string[]).length).toBe(LAYOUTKIT_SAFELIST.length);
  });

  it("withLayoutKit preserves existing safelist", () => {
    const config = withLayoutKit({ safelist: ["custom-class"] });
    expect((config.safelist as string[])).toContain("custom-class");
    expect((config.safelist as string[])).toContain("flex");
  });
});
