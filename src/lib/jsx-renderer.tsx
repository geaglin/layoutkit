"use client";

import React, { type ReactNode } from "react";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

// Component registry mapping names to actual components
const COMPONENT_REGISTRY: Record<string, AnyComponent> = {
  Center, Stack, Row, Box, Spread, Grid, Spacer, Divider, AspectRatio, ScrollArea,
};

interface ParsedNode {
  type: "component" | "html" | "text";
  tag: string;
  props: Record<string, string | number | boolean>;
  children: ParsedNode[];
}

function extractProps(propsStr: string): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {};

  // String props: key="value"
  for (const m of propsStr.matchAll(/(\w+)="([^"]+)"/g)) {
    props[m[1]] = m[2];
  }

  // Numeric props: key={123}
  for (const m of propsStr.matchAll(/(\w+)=\{(\d+)\}/g)) {
    props[m[1]] = parseInt(m[2]);
  }

  // Boolean props: standalone words not part of key=value
  for (const m of propsStr.matchAll(/\b(\w+)\b(?!\s*=)/g)) {
    if (!(m[1] in props)) {
      props[m[1]] = true;
    }
  }

  return props;
}

function tokenize(input: string): ParsedNode[] {
  const nodes: ParsedNode[] = [];
  const stack: ParsedNode[] = [];
  let pos = 0;

  while (pos < input.length) {
    // Find the next tag
    const nextTagIdx = input.indexOf("<", pos);

    if (nextTagIdx === -1) {
      // Rest is text
      const text = input.slice(pos).trim();
      if (text) {
        const textNode: ParsedNode = { type: "text", tag: "", props: {}, children: [] };
        textNode.tag = text;
        const parent = stack.length > 0 ? stack[stack.length - 1] : null;
        if (parent) {
          parent.children.push(textNode);
        } else {
          nodes.push(textNode);
        }
      }
      break;
    }

    // Text before the tag
    if (nextTagIdx > pos) {
      const text = input.slice(pos, nextTagIdx).trim();
      if (text) {
        const textNode: ParsedNode = { type: "text", tag: text, props: {}, children: [] };
        const parent = stack.length > 0 ? stack[stack.length - 1] : null;
        if (parent) {
          parent.children.push(textNode);
        } else {
          nodes.push(textNode);
        }
      }
    }

    // Find end of tag
    const tagEnd = input.indexOf(">", nextTagIdx);
    if (tagEnd === -1) {
      pos = nextTagIdx + 1;
      continue;
    }

    const tagContent = input.slice(nextTagIdx + 1, tagEnd);
    pos = tagEnd + 1;

    // Closing tag: </TagName>
    if (tagContent.startsWith("/")) {
      if (stack.length > 0) {
        const completed = stack.pop()!;
        const parent = stack.length > 0 ? stack[stack.length - 1] : null;
        if (parent) {
          parent.children.push(completed);
        } else {
          nodes.push(completed);
        }
      }
      continue;
    }

    // Self-closing tag: <TagName ... />
    const isSelfClosing = tagContent.endsWith("/");
    const cleanContent = isSelfClosing ? tagContent.slice(0, -1).trim() : tagContent.trim();

    // Extract tag name
    const spaceIdx = cleanContent.indexOf(" ");
    const tagName = spaceIdx === -1 ? cleanContent : cleanContent.slice(0, spaceIdx);
    const propsStr = spaceIdx === -1 ? "" : cleanContent.slice(spaceIdx);

    const isLayoutComponent = tagName in COMPONENT_REGISTRY;
    const node: ParsedNode = {
      type: isLayoutComponent ? "component" : "html",
      tag: tagName,
      props: extractProps(propsStr),
      children: [],
    };

    if (isSelfClosing) {
      const parent = stack.length > 0 ? stack[stack.length - 1] : null;
      if (parent) {
        parent.children.push(node);
      } else {
        nodes.push(node);
      }
    } else {
      stack.push(node);
    }
  }

  // Flush remaining stack
  while (stack.length > 0) {
    const completed = stack.pop()!;
    const parent = stack.length > 0 ? stack[stack.length - 1] : null;
    if (parent) {
      parent.children.push(completed);
    } else {
      nodes.push(completed);
    }
  }

  return nodes;
}

function renderNode(node: ParsedNode, key: number): ReactNode {
  if (node.type === "text") {
    return (
      <span key={key} className="text-sm text-zinc-300">
        {node.tag}
      </span>
    );
  }

  const children = node.children.map((child, i) => renderNode(child, i));

  if (node.type === "component") {
    const Component = COMPONENT_REGISTRY[node.tag];
    if (!Component) return null;

    const cleanProps: Record<string, unknown> = { ...node.props };
    // Add a visible border so layouts are visible in preview
    const debugClass = `border border-dashed border-zinc-700/60 rounded-md ${String(cleanProps.className || "")}`.trim();
    cleanProps.className = debugClass;

    return (
      <Component key={key} {...cleanProps}>
        {children.length > 0 ? children : (
          <span className="text-[11px] text-zinc-600 italic px-2 py-1">
            &lt;{node.tag}&gt;
          </span>
        )}
      </Component>
    );
  }

  // HTML elements — render as styled placeholder blocks
  const htmlTag = node.tag.toLowerCase();
  const isHeading = htmlTag.startsWith("h") && htmlTag.length === 2;
  const isLink = htmlTag === "a";

  return (
    <div
      key={key}
      className={`rounded px-2 py-1 ${
        isHeading
          ? "bg-accent/10 text-accent font-bold text-lg"
          : isLink
            ? "text-purple underline text-sm cursor-pointer"
            : "bg-zinc-800/50 text-zinc-300 text-sm"
      }`}
    >
      {children.length > 0 ? children : (
        <span className="text-zinc-500">
          &lt;{node.tag}&gt;
        </span>
      )}
    </div>
  );
}

export function LivePreview({ code }: { code: string }) {
  if (!code.trim()) {
    return (
      <div className="flex h-full items-center justify-center text-[13px] italic text-zinc-700">
        Type LayoutKit JSX to see a live preview...
      </div>
    );
  }

  try {
    const nodes = tokenize(code);
    return (
      <div className="min-h-[200px] rounded-lg border border-border bg-zinc-900/50 p-4">
        {nodes.map((node, i) => renderNode(node, i))}
      </div>
    );
  } catch {
    return (
      <div className="flex h-full items-center justify-center text-[13px] text-red-400">
        Could not parse JSX — check your syntax
      </div>
    );
  }
}
