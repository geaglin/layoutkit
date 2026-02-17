import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Center,
  Stack,
  Row,
  Box,
  Spread,
  Grid,
  Spacer,
  Divider,
  AspectRatio,
  ScrollArea,
} from "@/components/layout";

// ─── Center ─────────────────────────────────────────────────
describe("Center", () => {
  it("centers both axes by default", () => {
    render(<Center data-testid="c">content</Center>);
    const el = screen.getByTestId("c");
    expect(el.className).toContain("flex");
    expect(el.className).toContain("items-center");
    expect(el.className).toContain("justify-center");
  });

  it("adds min-h-screen when fill is true", () => {
    render(<Center fill data-testid="c">content</Center>);
    expect(screen.getByTestId("c").className).toContain("min-h-screen");
  });

  it("centers only x-axis with horizontal", () => {
    render(<Center horizontal data-testid="c">content</Center>);
    const cls = screen.getByTestId("c").className;
    expect(cls).toContain("items-center");
    expect(cls).not.toContain("justify-center");
  });

  it("centers only y-axis with vertical", () => {
    render(<Center vertical data-testid="c">content</Center>);
    const cls = screen.getByTestId("c").className;
    expect(cls).toContain("justify-center");
    expect(cls).not.toContain("items-center");
  });

  it("uses inline-flex when inline is true", () => {
    render(<Center inline data-testid="c">content</Center>);
    expect(screen.getByTestId("c").className).toContain("inline-flex");
  });

  it("renders custom element with as prop", () => {
    render(<Center as="section" data-testid="c">content</Center>);
    expect(screen.getByTestId("c").tagName).toBe("SECTION");
  });

  it("merges custom className", () => {
    render(<Center className="bg-red-500" data-testid="c">content</Center>);
    expect(screen.getByTestId("c").className).toContain("bg-red-500");
  });
});

// ─── Stack ──────────────────────────────────────────────────
describe("Stack", () => {
  it("renders flex-col with default gap", () => {
    render(<Stack data-testid="s">child</Stack>);
    const cls = screen.getByTestId("s").className;
    expect(cls).toContain("flex");
    expect(cls).toContain("flex-col");
    expect(cls).toContain("gap-4");
  });

  it("applies custom gap", () => {
    render(<Stack gap="lg" data-testid="s">child</Stack>);
    expect(screen.getByTestId("s").className).toContain("gap-6");
  });

  it("centers when center prop is true", () => {
    render(<Stack center data-testid="s">child</Stack>);
    const cls = screen.getByTestId("s").className;
    expect(cls).toContain("items-center");
    expect(cls).toContain("justify-center");
  });

  it("applies padding", () => {
    render(<Stack padding="lg" data-testid="s">child</Stack>);
    expect(screen.getByTestId("s").className).toContain("p-6");
  });

  it("applies flex-wrap", () => {
    render(<Stack wrap data-testid="s">child</Stack>);
    expect(screen.getByTestId("s").className).toContain("flex-wrap");
  });

  it("defaults align to stretch", () => {
    render(<Stack data-testid="s">child</Stack>);
    expect(screen.getByTestId("s").className).toContain("items-stretch");
  });
});

// ─── Row ────────────────────────────────────────────────────
describe("Row", () => {
  it("renders flex-row with default gap", () => {
    render(<Row data-testid="r">child</Row>);
    const cls = screen.getByTestId("r").className;
    expect(cls).toContain("flex");
    expect(cls).toContain("flex-row");
    expect(cls).toContain("gap-4");
  });

  it("defaults align to center", () => {
    render(<Row data-testid="r">child</Row>);
    expect(screen.getByTestId("r").className).toContain("items-center");
  });

  it("reverses direction", () => {
    render(<Row reverse data-testid="r">child</Row>);
    expect(screen.getByTestId("r").className).toContain("flex-row-reverse");
  });

  it("applies justify between", () => {
    render(<Row justify="between" data-testid="r">child</Row>);
    expect(screen.getByTestId("r").className).toContain("justify-between");
  });
});

// ─── Box ────────────────────────────────────────────────────
describe("Box", () => {
  it("applies flex-1 when fill is true", () => {
    render(<Box fill data-testid="b">content</Box>);
    expect(screen.getByTestId("b").className).toContain("flex-1");
  });

  it("centers content when center is true", () => {
    render(<Box center data-testid="b">content</Box>);
    const cls = screen.getByTestId("b").className;
    expect(cls).toContain("flex");
    expect(cls).toContain("items-center");
    expect(cls).toContain("justify-center");
  });

  it("applies padding", () => {
    render(<Box padding="xl" data-testid="b">content</Box>);
    expect(screen.getByTestId("b").className).toContain("p-8");
  });

  it("renders minimal markup with no props", () => {
    render(<Box data-testid="b">content</Box>);
    const cls = screen.getByTestId("b").className;
    expect(cls).toBe("");
  });
});

// ─── Spread ─────────────────────────────────────────────────
describe("Spread", () => {
  it("applies justify-between", () => {
    render(<Spread data-testid="sp">child</Spread>);
    expect(screen.getByTestId("sp").className).toContain("justify-between");
  });

  it("defaults align to center", () => {
    render(<Spread data-testid="sp">child</Spread>);
    expect(screen.getByTestId("sp").className).toContain("items-center");
  });

  it("applies padding", () => {
    render(<Spread padding="md" data-testid="sp">child</Spread>);
    expect(screen.getByTestId("sp").className).toContain("p-4");
  });
});

// ─── Grid ───────────────────────────────────────────────────
describe("Grid", () => {
  it("renders grid with column count", () => {
    render(<Grid cols={3} data-testid="g">child</Grid>);
    const cls = screen.getByTestId("g").className;
    expect(cls).toContain("grid");
    expect(cls).toContain("grid-cols-3");
  });

  it("applies default gap", () => {
    render(<Grid data-testid="g">child</Grid>);
    expect(screen.getByTestId("g").className).toContain("gap-4");
  });

  it("supports responsive mode with arbitrary value class (CSP-safe)", () => {
    render(<Grid responsive minChildWidth="300px" data-testid="g">child</Grid>);
    const el = screen.getByTestId("g");
    expect(el.className).toContain("grid");
    expect(el.className).toContain("grid-cols-[repeat(auto-fit,minmax(300px,1fr))]");
    expect(el.style.gridTemplateColumns).toBe("");
  });

  it("applies grid flow", () => {
    render(<Grid flow="col" data-testid="g">child</Grid>);
    expect(screen.getByTestId("g").className).toContain("grid-flow-col");
  });
});

// ─── Spacer ─────────────────────────────────────────────────
describe("Spacer", () => {
  it("renders flex-1 by default (auto)", () => {
    render(<Spacer data-testid="sp" />);
    expect(screen.getByTestId("sp").className).toContain("flex-1");
  });

  it("renders fixed height for specific size", () => {
    render(<Spacer size="lg" data-testid="sp" />);
    expect(screen.getByTestId("sp").className).toContain("h-6");
  });

  it("is aria-hidden", () => {
    render(<Spacer data-testid="sp" />);
    expect(screen.getByTestId("sp")).toHaveAttribute("aria-hidden", "true");
  });
});

// ─── Divider ────────────────────────────────────────────────
describe("Divider", () => {
  it("renders horizontal divider by default", () => {
    render(<Divider data-testid="d" />);
    const cls = screen.getByTestId("d").className;
    expect(cls).toContain("w-full");
    expect(cls).toContain("border-t");
  });

  it("renders vertical divider", () => {
    render(<Divider orientation="vertical" data-testid="d" />);
    const cls = screen.getByTestId("d").className;
    expect(cls).toContain("h-full");
    expect(cls).toContain("border-l");
  });

  it("has separator role", () => {
    render(<Divider data-testid="d" />);
    expect(screen.getByTestId("d")).toHaveAttribute("role", "separator");
  });

  it("applies custom color", () => {
    render(<Divider color="border-red-500" data-testid="d" />);
    expect(screen.getByTestId("d").className).toContain("border-red-500");
  });
});

// ─── AspectRatio ────────────────────────────────────────────
describe("AspectRatio", () => {
  it("applies padding-bottom for 16:9 ratio", () => {
    render(<AspectRatio ratio={16 / 9} data-testid="ar"><div /></AspectRatio>);
    const el = screen.getByTestId("ar");
    expect(el.className).toContain("relative");
    const pb = parseFloat(el.style.paddingBottom);
    expect(pb).toBeCloseTo(56.25, 1);
  });

  it("defaults to 1:1 ratio", () => {
    render(<AspectRatio data-testid="ar"><div /></AspectRatio>);
    expect(screen.getByTestId("ar").style.paddingBottom).toBe("100%");
  });
});

// ─── ScrollArea ─────────────────────────────────────────────
describe("ScrollArea", () => {
  it("applies overflow-y-auto by default", () => {
    render(<ScrollArea data-testid="sa">content</ScrollArea>);
    expect(screen.getByTestId("sa").className).toContain("overflow-y-auto");
  });

  it("applies overflow-x-auto for horizontal", () => {
    render(<ScrollArea direction="horizontal" data-testid="sa">content</ScrollArea>);
    expect(screen.getByTestId("sa").className).toContain("overflow-x-auto");
  });

  it("applies overflow-auto for both", () => {
    render(<ScrollArea direction="both" data-testid="sa">content</ScrollArea>);
    expect(screen.getByTestId("sa").className).toContain("overflow-auto");
  });

  it("applies maxHeight class", () => {
    render(<ScrollArea maxHeight="max-h-96" data-testid="sa">content</ScrollArea>);
    expect(screen.getByTestId("sa").className).toContain("max-h-96");
  });
});
