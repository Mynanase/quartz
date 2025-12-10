---
title: Typst Package Test
---

This page tests if Typst packages are correctly loaded via the `typstPreamble` configuration.

## Configuration

Ensure your `quartz.config.ts` has the following configuration:

```typescript
Plugin.Latex({
  renderEngine: "typst",
  typstPreamble: '#import "@preview/fletcher:0.5.1" as fletcher: node, edge',
}),
```

## Test Case: Preamble File

This test verifies that `preamble.typ` is loaded correctly. It should import `physica` and define a custom function `mycustom`.

```math
// Using physica from preamble file
div bold(B) = 0
```

## Test Case: Standard Math

Standard math should still work.ß
