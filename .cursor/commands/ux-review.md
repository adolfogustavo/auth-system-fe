# ux-review

Visual UX review using browser MCP to navigate, screenshot, and evaluate UI.

## Prerequisites

- Dev server running (`npm start` in terminal)
- Browser MCP already configured (cursor-browser-extension tools available)

## Browser MCP Tools Available

- `browser_navigate` - Navigate to URL
- `browser_snapshot` - Get page accessibility tree (for element refs)
- `browser_take_screenshot` - Capture visual state
- `browser_click` - Click elements by ref
- `browser_type` - Type text in inputs
- `browser_wait_for` - Wait for text/time
- `browser_tabs` - Manage browser tabs

## Steps

1. **Verify server is running**:
   - Check terminal logs for active Vite server
   - Default URL: `http://localhost:5173`

2. **Navigate and capture screenshots**:
   - Use `browser_navigate` to go to each page
   - Use `browser_snapshot` to get element references
   - Use `browser_take_screenshot` to capture current state
   - Use `browser_click` / `browser_type` to interact with UI

3. **Test flow** (adjust based on feature):
   ```
   Landing page → Main features → Forms → Modals/Dialogs
   ```

4. **For each screen, evaluate**:
   - Layout and spacing consistency
   - Typography hierarchy
   - Color contrast and theme (light/dark)
   - Interactive elements (buttons, inputs, links)
   - Loading states
   - Error states
   - Modal/dialog behavior (backdrop, close, animations)

5. **Report findings**:
   - List screenshots taken with descriptions
   - Note any UI issues found
   - Confirm working features

## Example Flow

```
1. browser_navigate → http://localhost:5173
2. browser_take_screenshot → 01-landing.png
3. browser_snapshot → get element refs
4. browser_click → main CTA button ref
5. browser_wait_for → 2 seconds
6. browser_take_screenshot → 02-main-page.png
7. browser_click → theme toggle
8. browser_take_screenshot → 03-dark-mode.png
```

## Output Format

| # | Screen | Status | Notes |
|---|--------|--------|-------|
| 1 | Landing | ✅/❌ | Description |
| 2 | Main Page | ✅/❌ | Description |
| ... | ... | ... | ... |

## Checklist

- [ ] Backdrop blur on modals
- [ ] Button states (hover, disabled, loading)
- [ ] Form validation feedback
- [ ] Empty states
- [ ] Dark/light theme consistency
- [ ] Animation smoothness
- [ ] Keyboard navigation (Escape to close modals)
- [ ] Mobile responsiveness (use browser_resize)

