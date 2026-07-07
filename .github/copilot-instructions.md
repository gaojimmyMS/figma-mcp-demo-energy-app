# Copilot Instructions

This repository is a demo showing how to turn any **Figma design into production web code** using the Figma MCP server and a custom **web-developer** agent.

## How this works

- **Figma MCP server** is configured in [.vscode/mcp.json](../.vscode/mcp.json). It connects to `https://mcp.figma.com/mcp` and exposes tools like `mcp_figma_get_figma_data` and `mcp_figma_download_figma_images`.
- **web-developer agent** ([.github/agents/web-developer.md](agents/web-developer.md)) is the agent that drives Figma-to-code generation.
- **figma-design skill** ([.github/skills/figma-to-production-web-code/SKILL.md](skills/figma-to-production-web-code/SKILL.md)) contains the step-by-step workflow for extracting design tokens, downloading assets, and generating HTML/CSS.

## Conventions

- When a user provides a **Figma URL**, use the `figma` MCP tools to fetch the design and follow the `figma-design` skill workflow.
- Generate **semantic HTML5**, modern **CSS3** (Grid, Flexbox, custom properties), and **vanilla ES6+ JavaScript**. No CSS frameworks unless requested.
- Use **BEM** naming and **2-space indentation**.
- Follow **WCAG 2.1 AA** accessibility guidelines.
- Never place API keys or secrets in client-side code.

## File structure for generated output

```
index.html
css/
  reset.css
  variables.css
  styles.css
js/
  main.js
assets/
  images/
  icons/
```
