#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const COMPONENT_FILES = [
    "Center.tsx", "Stack.tsx", "Row.tsx", "Box.tsx", "Spread.tsx",
    "Grid.tsx", "Spacer.tsx", "Divider.tsx", "AspectRatio.tsx", "ScrollArea.tsx",
    "types.ts", "utils.ts", "index.ts",
];
const ADDON_MAP = {
    eslint: {
        files: ["eslint-plugin.ts"],
        targetDir: "lib",
        description: "ESLint plugin with 6 layout lint rules",
    },
    safelist: {
        files: ["safelist.ts"],
        targetDir: "lib",
        description: "Tailwind safelist export for PurgeCSS/JIT",
    },
    compiler: {
        files: ["html-compiler.ts"],
        targetDir: "lib",
        description: "HTML template compiler (framework-agnostic)",
    },
};
function detectSrcDir() {
    if ((0, fs_1.existsSync)("src/components"))
        return "src/components/layout";
    if ((0, fs_1.existsSync)("components"))
        return "components/layout";
    if ((0, fs_1.existsSync)("app/components"))
        return "app/components/layout";
    return "src/components/layout";
}
function detectLibDir() {
    if ((0, fs_1.existsSync)("src/lib"))
        return "src/lib";
    if ((0, fs_1.existsSync)("lib"))
        return "lib";
    if ((0, fs_1.existsSync)("src/utils"))
        return "src/utils";
    return "src/lib";
}
function banner() {
    console.log(`
${CYAN}${BOLD}  ╔═══════════════════════════════════════╗
  ║         LayoutKit v0.1.0              ║
  ║   The first layout language for web   ║
  ╚═══════════════════════════════════════╝${RESET}
`);
}
function init() {
    banner();
    const targetDir = detectSrcDir();
    const templatesDir = (0, path_1.resolve)(__dirname, "..", "templates", "components");
    if (!(0, fs_1.existsSync)(templatesDir)) {
        console.error(`${YELLOW}Error: Template files not found. Reinstall layoutkit.${RESET}`);
        process.exit(1);
    }
    console.log(`${DIM}  Detected target: ${targetDir}${RESET}`);
    (0, fs_1.mkdirSync)(targetDir, { recursive: true });
    let copied = 0;
    for (const file of COMPONENT_FILES) {
        const src = (0, path_1.join)(templatesDir, file);
        const dest = (0, path_1.join)(targetDir, file);
        if ((0, fs_1.existsSync)(src)) {
            // Adjust import paths based on project structure
            let content = (0, fs_1.readFileSync)(src, "utf-8");
            // Keep relative imports within the layout directory
            (0, fs_1.cpSync)(src, dest);
            copied++;
            console.log(`  ${GREEN}✓${RESET} ${file}`);
        }
    }
    console.log(`
${GREEN}${BOLD}  ✓ Installed ${copied} components to ${targetDir}${RESET}

  ${DIM}Usage:${RESET}
  ${CYAN}import { Stack, Center, Row } from "@/components/layout"${RESET}

  ${DIM}Add-ons:${RESET}
  ${DIM}  npx layoutkit add eslint     ${RESET}${DIM}# ESLint plugin${RESET}
  ${DIM}  npx layoutkit add safelist   ${RESET}${DIM}# Tailwind safelist${RESET}
  ${DIM}  npx layoutkit add compiler   ${RESET}${DIM}# HTML compiler${RESET}
`);
}
function add(addon) {
    banner();
    const config = ADDON_MAP[addon];
    if (!config) {
        console.error(`${YELLOW}  Unknown add-on: ${addon}${RESET}`);
        console.log(`  Available: ${Object.keys(ADDON_MAP).join(", ")}`);
        process.exit(1);
    }
    const targetDir = detectLibDir();
    const templatesDir = (0, path_1.resolve)(__dirname, "..", "templates", config.targetDir);
    (0, fs_1.mkdirSync)(targetDir, { recursive: true });
    for (const file of config.files) {
        const src = (0, path_1.join)(templatesDir, file);
        const dest = (0, path_1.join)(targetDir, file);
        if ((0, fs_1.existsSync)(src)) {
            (0, fs_1.cpSync)(src, dest);
            console.log(`  ${GREEN}✓${RESET} ${file} → ${targetDir}/`);
        }
    }
    console.log(`\n${GREEN}${BOLD}  ✓ Added ${config.description}${RESET}\n`);
}
function help() {
    banner();
    console.log(`  ${BOLD}Commands:${RESET}

  ${CYAN}layoutkit init${RESET}              Install layout components
  ${CYAN}layoutkit add <addon>${RESET}       Add optional tooling
  ${CYAN}layoutkit help${RESET}              Show this help

  ${BOLD}Add-ons:${RESET}

  ${CYAN}eslint${RESET}      ESLint plugin with 6 layout lint rules
  ${CYAN}safelist${RESET}    Tailwind safelist export for PurgeCSS/JIT
  ${CYAN}compiler${RESET}    HTML template compiler (framework-agnostic)

  ${DIM}Docs: https://github.com/geaglin/layoutkit${RESET}
`);
}
// CLI entry
const args = process.argv.slice(2);
const command = args[0] || "help";
switch (command) {
    case "init":
        init();
        break;
    case "add":
        add(args[1] || "");
        break;
    case "help":
    case "--help":
    case "-h":
        help();
        break;
    default:
        console.error(`Unknown command: ${command}`);
        help();
        process.exit(1);
}
