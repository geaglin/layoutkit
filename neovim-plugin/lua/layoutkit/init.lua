-- layoutkit.nvim — LayoutKit snippets and utilities for Neovim
-- 10 semantic layout components that compile to Tailwind CSS

local M = {}

M.components = {
  Stack = {
    prefix = "lkstack",
    body = '<Stack gap="${1:md}" ${2:padding="${3:none}"}>\n  $0\n</Stack>',
    description = "Vertical flex layout",
    props = { "gap", "align", "justify", "center", "fill", "fullHeight", "padding", "wrap", "as" },
  },
  Row = {
    prefix = "lkrow",
    body = '<Row gap="${1:md}" ${2:align="${3:center}"}>\n  $0\n</Row>',
    description = "Horizontal flex layout",
    props = { "gap", "align", "justify", "center", "fill", "padding", "wrap", "reverse", "as" },
  },
  Center = {
    prefix = "lkcenter",
    body = "<Center${1: fill}>\n  $0\n</Center>",
    description = "Center content horizontally and vertically",
    props = { "fill", "fullHeight", "horizontal", "vertical", "inline", "as" },
  },
  Box = {
    prefix = "lkbox",
    body = '<Box padding="${1:md}">\n  $0\n</Box>',
    description = "Basic container with padding",
    props = { "fill", "padding", "center", "as" },
  },
  Grid = {
    prefix = "lkgrid",
    body = '<Grid cols={${1:3}} gap="${2:md}">\n  $0\n</Grid>',
    description = "CSS Grid with responsive columns",
    props = { "cols", "rows", "gap", "colGap", "rowGap", "flow", "placeItems", "responsive", "minChildWidth", "as" },
  },
  Spread = {
    prefix = "lkspread",
    body = "<Spread${1: align=\"${2:center}\"}>\n  $0\n</Spread>",
    description = "Push children to opposite ends (space-between)",
    props = { "align", "padding", "as" },
  },
  Spacer = {
    prefix = "lkspacer",
    body = '<Spacer size="${1:md}" />',
    description = "Flexible space between elements",
    props = { "size" },
  },
  Divider = {
    prefix = "lkdivider",
    body = '<Divider${1: orientation="${2:horizontal}"} />',
    description = "Horizontal or vertical divider line",
    props = { "orientation", "color", "thickness" },
  },
  AspectRatio = {
    prefix = "lkaspect",
    body = "<AspectRatio ratio={${1:16 / 9}}>\n  $0\n</AspectRatio>",
    description = "Constrain children to an aspect ratio",
    props = { "ratio" },
  },
  ScrollArea = {
    prefix = "lkscroll",
    body = '<ScrollArea${1: direction="${2:vertical}"} maxHeight="${3:400px}">\n  $0\n</ScrollArea>',
    description = "Scrollable container",
    props = { "direction", "maxHeight", "maxWidth" },
  },
}

-- Import statement snippet
M.import_snippet = {
  prefix = "lkimport",
  body = 'import { ${1:Stack, Row, Center} } from "layoutkit-css"',
  description = "Import LayoutKit components",
}

--- Setup function
---@param opts? table
function M.setup(opts)
  opts = opts or {}

  -- Register snippets with LuaSnip if available
  local has_luasnip, ls = pcall(require, "luasnip")
  if has_luasnip then
    local s = ls.snippet
    local t = ls.text_node
    local i = ls.insert_node

    local snippets = {}

    -- Import snippet
    table.insert(snippets, s("lkimport", {
      t('import { '), i(1, "Stack, Row, Center"), t(' } from "layoutkit-css"'),
    }))

    -- Component snippets
    for name, comp in pairs(M.components) do
      table.insert(snippets, s(comp.prefix, {
        t("<" .. name), i(1, ""), t(">"),
        t({ "", "  " }), i(2),
        t({ "", "</" .. name .. ">" }),
      }))
    end

    ls.add_snippets("typescriptreact", snippets)
    ls.add_snippets("javascriptreact", snippets)
  end

  -- Register completion source for nvim-cmp if available
  local has_cmp, cmp = pcall(require, "cmp")
  if has_cmp then
    local source = {}
    source.new = function()
      return setmetatable({}, { __index = source })
    end
    source.get_trigger_characters = function()
      return { "<", '"' }
    end
    source.complete = function(self, request, callback)
      local items = {}

      -- Component name completions (after <)
      for name, comp in pairs(M.components) do
        table.insert(items, {
          label = name,
          kind = cmp.lsp.CompletionItemKind.Module,
          detail = "LayoutKit: " .. comp.description,
          documentation = "Props: " .. table.concat(comp.props, ", "),
        })
      end

      -- Gap/padding size completions (after ")
      local sizes = {
        "none", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4",
        "5", "6", "7", "8", "9", "10", "11", "12", "14", "16",
        "xs", "sm", "md", "lg", "xl", "2xl", "3xl",
      }
      for _, size in ipairs(sizes) do
        table.insert(items, {
          label = size,
          kind = cmp.lsp.CompletionItemKind.Value,
          detail = "LayoutKit gap/padding size",
        })
      end

      callback({ items = items })
    end

    cmp.register_source("layoutkit", source.new())
  end

  -- User commands
  vim.api.nvim_create_user_command("LayoutKitList", function()
    local lines = { "LayoutKit Components:", "" }
    for name, comp in pairs(M.components) do
      table.insert(lines, string.format("  <%s> — %s", name, comp.description))
      table.insert(lines, string.format("    Props: %s", table.concat(comp.props, ", ")))
      table.insert(lines, "")
    end
    vim.api.nvim_echo({{ table.concat(lines, "\n"), "Normal" }}, true, {})
  end, { desc = "List all LayoutKit components and props" })

  vim.api.nvim_create_user_command("LayoutKitImport", function()
    local line = vim.api.nvim_win_get_cursor(0)[1]
    vim.api.nvim_buf_set_lines(0, line - 1, line - 1, false, {
      'import { Stack, Row, Center, Grid, Box, Spread, Spacer, Divider, AspectRatio, ScrollArea } from "layoutkit-css"',
    })
  end, { desc = "Insert LayoutKit import statement at cursor" })
end

return M
