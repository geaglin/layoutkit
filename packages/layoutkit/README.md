# layoutkit-css

The first layout language for the web. 10 semantic components that compile to Tailwind CSS.

## Install

```bash
npm install layoutkit-css
```

## Usage

```tsx
import { Stack, Row, Center, Grid } from "layoutkit-css";

function App() {
  return (
    <Stack gap="lg" padding="md">
      <Row gap="sm" align="center">
        <h1>Hello</h1>
        <span>World</span>
      </Row>
      <Center fullHeight>
        <p>Centered content</p>
      </Center>
      <Grid cols={3} gap="md">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Grid>
    </Stack>
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| `Stack` | Vertical flex layout |
| `Row` | Horizontal flex layout |
| `Center` | Centers content horizontally and/or vertically |
| `Box` | Basic container with padding |
| `Spread` | Pushes children to opposite ends (space-between) |
| `Grid` | CSS Grid with responsive columns |
| `Spacer` | Flexible space between elements |
| `Divider` | Horizontal or vertical divider line |
| `AspectRatio` | Constrains children to an aspect ratio |
| `ScrollArea` | Scrollable container |

## Props

All components support:
- `as` — Render as a different HTML element
- `className` — Additional Tailwind/CSS classes
- `ref` — Forwarded ref
- All native HTML div props

### Gap & Padding Sizes

Numeric: `"none"`, `"px"`, `"0.5"`, `"1"` through `"16"`

Semantic: `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`, `"3xl"`

### Align & Justify

- **align**: `"start"`, `"center"`, `"end"`, `"stretch"`, `"baseline"`
- **justify**: `"start"`, `"center"`, `"end"`, `"between"`, `"around"`, `"evenly"`

## Requirements

- React 18+
- Tailwind CSS (classes are generated at build time)

## License

MIT
