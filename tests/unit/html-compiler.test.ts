import { describe, it, expect } from "vitest";
import { compileLayoutKitHTML, layoutkitVitePlugin } from "@/lib/html-compiler";

describe("HTML Compiler", () => {
  it("compiles <Center> to flex centering div", () => {
    const result = compileLayoutKitHTML("<Center>hello</Center>");
    expect(result).toContain('class="flex flex-col items-center justify-center"');
    expect(result).toContain("hello");
    expect(result).not.toContain("<Center");
  });

  it("compiles <Stack> with default gap", () => {
    const result = compileLayoutKitHTML("<Stack>content</Stack>");
    expect(result).toContain("flex-col");
    expect(result).toContain("gap-4");
  });

  it("compiles <Stack gap=\"lg\"> with gap-6", () => {
    const result = compileLayoutKitHTML('<Stack gap="lg">content</Stack>');
    expect(result).toContain("gap-6");
  });

  it("compiles <Row> with flex-row", () => {
    const result = compileLayoutKitHTML("<Row>content</Row>");
    expect(result).toContain("flex-row");
    expect(result).toContain("gap-4");
  });

  it("compiles <Row reverse>", () => {
    const result = compileLayoutKitHTML("<Row reverse>content</Row>");
    expect(result).toContain("flex-row-reverse");
  });

  it("compiles <Spread>", () => {
    const result = compileLayoutKitHTML("<Spread>content</Spread>");
    expect(result).toContain("justify-between");
  });

  it("compiles <Grid cols={3}>", () => {
    const result = compileLayoutKitHTML("<Grid cols={3}>content</Grid>");
    expect(result).toContain("grid-cols-3");
  });

  it("compiles <Grid cols=\"3\">", () => {
    const result = compileLayoutKitHTML('<Grid cols="3">content</Grid>');
    expect(result).toContain("grid-cols-3");
  });

  it("compiles self-closing <Spacer />", () => {
    const result = compileLayoutKitHTML("<Spacer />");
    expect(result).toContain("flex-1");
    expect(result).toContain('aria-hidden="true"');
  });

  it("compiles self-closing <Divider />", () => {
    const result = compileLayoutKitHTML("<Divider />");
    expect(result).toContain("border-t");
    expect(result).toContain('role="separator"');
  });

  it("preserves non-LayoutKit HTML", () => {
    const html = '<div class="foo"><span>bar</span></div>';
    expect(compileLayoutKitHTML(html)).toBe(html);
  });

  it("handles nested LayoutKit components", () => {
    const result = compileLayoutKitHTML("<Stack><Center>hi</Center></Stack>");
    expect(result).toContain("flex-col");
    expect(result).toContain("items-center");
    expect(result).not.toContain("<Stack");
    expect(result).not.toContain("<Center");
  });

  it("merges className prop", () => {
    const result = compileLayoutKitHTML('<Stack className="my-class">x</Stack>');
    expect(result).toContain("my-class");
    expect(result).toContain("flex-col");
  });

  it("handles padding prop", () => {
    const result = compileLayoutKitHTML('<Box padding="lg">x</Box>');
    expect(result).toContain("p-6");
  });

  it("exports Vite plugin", () => {
    const plugin = layoutkitVitePlugin();
    expect(plugin.name).toBe("layoutkit-html");
    expect(typeof plugin.transformIndexHtml).toBe("function");
  });
});
