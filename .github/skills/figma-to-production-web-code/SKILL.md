---
name: figma-design
description: Guide for interpreting and translating Figma design files into production-ready web code. Use this when working with Figma URLs, design tokens, components, layouts, and assets.
---

# Figma Design Skill

## Description

This skill provides guidance for interpreting and translating Figma design files into production-ready web code. Use it when working with Figma URLs, design tokens, components, layouts, and assets.

## When to Use This Skill

- User provides a Figma URL or file key
- User asks to implement, replicate, or inspect a Figma design
- User needs to extract colors, typography, spacing, or assets from Figma
- User wants to build a component or page that matches a Figma frame

---

## Workflow

### 1. Fetch the Figma Design

Use the `figma` MCP tool to retrieve the design file data:

```
mcp_figma_get_figma_data({ fileKey: "<key>", nodeId: "<node-id>" })
```

- Extract the `fileKey` from the Figma URL: `figma.com/design/<fileKey>/...`
- Extract `nodeId` from the URL parameter `?node-id=<nodeId>` when targeting a specific frame or component
- If no `nodeId` is provided, fetch the full file and identify the relevant frames

### 2. Analyze the Design Structure

From the returned data, extract and document:

| Element | What to Look For |
|---|---|
| **Layout** | Frame dimensions, auto-layout direction, padding, gap, alignment |
| **Colors** | Fill colors (hex/rgba), opacity, gradient definitions |
| **Typography** | Font family, font size, font weight, line height, letter spacing |
| **Spacing** | Padding, margin, gap values (treat as `px` unless specified otherwise) |
| **Components** | Reusable component names and their variants |
| **Images/Icons** | Image fills and vector nodes that need to be exported |

### 3. Download Assets

For image fills and icon vectors, use:

```
mcp_figma_download_figma_images({
  fileKey: "<key>",
  nodes: [{ nodeId: "<id>", fileName: "icon-name.svg" }],
  localPath: "<absolute-path-to-assets-folder>"
})
```

- Use `.svg` for icons and vector graphics
- Use `.png` (scale 2×) for raster images and illustrations
- Save assets to `assets/images/` or `assets/icons/` within the project

### 4. Map Design Tokens to CSS Custom Properties

Convert extracted values into CSS variables:

```css
:root {
  /* Colors */
  --color-primary: #;
  --color-secondary: #;
  --color-background: #;
  --color-text: #;

  /* Typography */
  --font-family-base: '', sans-serif;
  --font-size-base: px;
  --font-weight-regular: ;
  --font-weight-bold: ;
  --line-height-base: ;

  /* Spacing (from Figma padding/gap values) */
  --spacing-xs: px;
  --spacing-sm: px;
  --spacing-md: px;
  --spacing-lg: px;
  --spacing-xl: px;

  /* Border Radius */
  --radius-sm: px;
  --radius-md: px;
  --radius-lg: px;
}
```

### 5. Implement the Layout

- Match the Figma frame dimensions at their designed breakpoint (usually desktop: 1440px or 1280px)
- Use **CSS Grid** for page-level layout structure
- Use **Flexbox** for component-level alignment
- Apply `auto-layout` gap values directly as `gap` in CSS
- Replicate padding values from Figma frames as `padding` on the corresponding HTML element

### 6. Implement Typography

- Match font families exactly (ensure the font is available via Google Fonts or loaded locally)
- Map Figma text styles to semantic HTML elements (`h1`–`h6`, `p`, `span`, `label`)
- Apply `font-size`, `font-weight`, `line-height`, and `letter-spacing` from Figma values

### 7. Implement Components

For each Figma component:

1. Create a dedicated HTML structure matching the component hierarchy in Figma
2. Name CSS classes using **BEM** based on the Figma component name
3. Implement all visible variants (e.g., hover, active, disabled states) if described in the design
4. Make the component self-contained — scoped styles, no global side effects

---
