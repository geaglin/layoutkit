import * as vscode from "vscode";

// Class mappings for hover info
const COMPONENT_CLASSES: Record<string, { base: string; props: Record<string, string> }> = {
  Center: {
    base: "flex flex-col items-center justify-center",
    props: {
      fill: "+ min-h-screen",
      horizontal: "items-center (x-axis only)",
      vertical: "justify-center (y-axis only)",
      inline: "replaces flex → inline-flex",
    },
  },
  Stack: {
    base: "flex flex-col gap-4 items-stretch justify-start",
    props: {
      "gap=\"xs\"": "gap-1", "gap=\"sm\"": "gap-2", "gap=\"md\"": "gap-4",
      "gap=\"lg\"": "gap-6", "gap=\"xl\"": "gap-8",
      center: "+ items-center justify-center",
      fill: "+ min-h-screen",
      wrap: "+ flex-wrap",
    },
  },
  Row: {
    base: "flex flex-row gap-4 items-center justify-start",
    props: {
      reverse: "flex-row → flex-row-reverse",
      center: "+ items-center justify-center",
      wrap: "+ flex-wrap",
    },
  },
  Box: {
    base: "(no base classes)",
    props: {
      fill: "flex-1",
      center: "flex items-center justify-center",
    },
  },
  Spread: {
    base: "flex flex-row justify-between items-center",
    props: {},
  },
  Grid: {
    base: "grid gap-4",
    props: {
      "cols={n}": "grid-cols-{n}",
      responsive: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
    },
  },
  Spacer: { base: "flex-1", props: { "size=\"md\"": "h-4 (fixed height)" } },
  Divider: { base: "w-full border-t border-gray-200", props: { "orientation=\"vertical\"": "h-full border-l" } },
  AspectRatio: { base: "relative + padding-bottom percentage", props: { "ratio={16/9}": "56.25% padding-bottom" } },
  ScrollArea: { base: "overflow-y-auto", props: { "direction=\"horizontal\"": "overflow-x-auto", "direction=\"both\"": "overflow-auto" } },
};

export function activate(context: vscode.ExtensionContext) {
  // Hover provider — shows Tailwind classes on hover
  const hoverProvider = vscode.languages.registerHoverProvider(
    [
      { language: "typescriptreact" },
      { language: "javascriptreact" },
      { language: "html" },
    ],
    {
      provideHover(document, position) {
        const range = document.getWordRangeAtPosition(position, /<?\w+/);
        if (!range) return;

        const word = document.getText(range).replace(/^</, "");
        const comp = COMPONENT_CLASSES[word];
        if (!comp) return;

        const md = new vscode.MarkdownString();
        md.isTrusted = true;
        md.appendMarkdown(`### LayoutKit: \`<${word}>\`\n\n`);
        md.appendMarkdown(`**Base classes:** \`${comp.base}\`\n\n`);

        if (Object.keys(comp.props).length > 0) {
          md.appendMarkdown("**Props → Classes:**\n\n");
          md.appendMarkdown("| Prop | Tailwind |\n|---|---|\n");
          for (const [prop, cls] of Object.entries(comp.props)) {
            md.appendMarkdown(`| \`${prop}\` | \`${cls}\` |\n`);
          }
        }

        md.appendMarkdown(`\n---\n*[LayoutKit](https://github.com/geaglin/layoutkit)*`);
        return new vscode.Hover(md, range);
      },
    }
  );

  // Completion provider for HTML files
  const htmlCompletionProvider = vscode.languages.registerCompletionItemProvider(
    { language: "html" },
    {
      provideCompletionItems(document, position) {
        const lineText = document.lineAt(position).text;
        const charBefore = lineText.substring(0, position.character);

        if (!charBefore.endsWith("<")) return [];

        return Object.keys(COMPONENT_CLASSES).map((name) => {
          const comp = COMPONENT_CLASSES[name];
          const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class);
          item.detail = `LayoutKit: ${comp.base}`;
          item.documentation = new vscode.MarkdownString(
            `**LayoutKit \`<${name}>\`**\n\nCompiles to: \`${comp.base}\``
          );
          item.insertText = new vscode.SnippetString(`${name}$1>$2</${name}>`);
          return item;
        });
      },
    },
    "<"
  );

  context.subscriptions.push(hoverProvider, htmlCompletionProvider);
}

export function deactivate() {}
