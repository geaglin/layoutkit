"use client";

import { COMPONENT_DOCS } from "@/lib/docs-data";
import type { Section } from "./Navbar";

interface HomePageProps {
  onNavigate: (section: Section) => void;
  onSelectComponent: (index: number) => void;
}

export function HomePage({ onNavigate, onSelectComponent }: HomePageProps) {
  return (
    <div className="mx-auto max-w-[840px] px-6 py-20">
      {/* Hero */}
      <div className="mb-20 text-center">
        <div className="mb-6 inline-block rounded-full border border-accent/20 bg-gradient-to-r from-accent/15 to-purple/15 px-3 py-1 text-[11px] font-semibold text-accent">
          REACT LAYOUT PRIMITIVES &rarr; TAILWIND CSS
        </div>
        <h1 className="mb-5 bg-gradient-to-br from-zinc-100 to-zinc-400 bg-clip-text text-[56px] font-extrabold leading-[1.05] tracking-tighter text-transparent">
          Stop memorizing
          <br />
          Tailwind layout classes.
        </h1>
        <p className="mx-auto mb-10 max-w-[520px] font-sans text-[17px] leading-relaxed text-muted">
          10 React components that compile to the exact Tailwind CSS you&apos;d
          write by hand. Zero runtime. Zero dependencies. You own the code.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate("playground")}
            className="rounded-lg bg-gradient-to-br from-accent to-purple px-6 py-2.5 text-[13px] font-bold text-background transition-opacity hover:opacity-90"
          >
            Try the Compiler &rarr;
          </button>
          <button
            onClick={() => onNavigate("docs")}
            className="rounded-lg border border-zinc-700 px-6 py-2.5 text-[13px] font-bold text-foreground transition-colors hover:border-zinc-500"
          >
            Read the Docs
          </button>
        </div>
      </div>

      {/* Comparison grid */}
      <div className="mb-16 grid grid-cols-3 gap-4">
        {[
          {
            label: "Raw CSS",
            lines: [
              "display: flex;",
              "flex-direction: column;",
              "align-items: center;",
              "justify-content: center;",
              "min-height: 100vh;",
            ],
            count: "5 properties",
          },
          {
            label: "Tailwind",
            lines: ["flex flex-col", "items-center", "justify-center", "min-h-screen"],
            count: "4 classes",
          },
          {
            label: "LayoutKit",
            lines: ["<Center fill>"],
            count: "2 words",
            highlight: true,
          },
        ].map((col) => (
          <div
            key={col.label}
            className={`rounded-xl p-5 ${
              col.highlight
                ? "border border-accent/30 bg-accent/5"
                : "border border-border bg-surface"
            }`}
          >
            <div
              className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${
                col.highlight ? "text-accent" : "text-zinc-600"
              }`}
            >
              {col.label}
            </div>
            <div className="mb-3">
              {col.lines.map((l) => (
                <div
                  key={l}
                  className={`text-xs leading-7 ${
                    col.highlight ? "font-bold text-accent" : "text-zinc-400"
                  }`}
                >
                  {l}
                </div>
              ))}
            </div>
            <div
              className={`text-[11px] font-semibold ${
                col.highlight ? "text-accent" : "text-zinc-600"
              }`}
            >
              {col.count}
            </div>
          </div>
        ))}
      </div>

      {/* Component grid */}
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-zinc-100">
        10 components. Every layout.
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        {COMPONENT_DOCS.map((comp, i) => (
          <button
            key={comp.name}
            onClick={() => {
              onSelectComponent(i);
              onNavigate("docs");
            }}
            className="flex items-center gap-3.5 rounded-lg border border-border bg-surface p-4 text-left transition-colors hover:border-zinc-600"
          >
            <span className="text-[13px] font-bold text-accent">
              &lt;{comp.name} /&gt;
            </span>
            <span className="font-sans text-[11px] text-zinc-600">
              {comp.tagline}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
