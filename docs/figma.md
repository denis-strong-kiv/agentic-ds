# Figma Workflow

→ See `docs/tokens.md` for token mapping rules.
→ See `docs/components.md` for component authoring rules.

---

## Workflow Steps

1. **Fetch design context** from Figma MCP before implementing any component
2. **Confirm token mapping** with the user before deviating from design system tokens
3. **Verify final implementation** against Figma screenshot before closing a task

---

## Key Rules

- Inverted variants (for dark surfaces) use white-alpha (`oklch(100% 0 0 / alpha)`), not a separate colour token
- If Figma uses hardcoded values, map them to the nearest design system token — do not copy the raw value
- If no matching token exists, flag it before implementing

---

## MCP Tools

| Tool | When to use |
|---|---|
| `get_design_context` | Primary tool — fetch component code, screenshot, and hints |
| `get_screenshot` | Verify final implementation visually |
| `get_metadata` | Inspect node structure or layer names |
