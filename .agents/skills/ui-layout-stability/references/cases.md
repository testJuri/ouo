# UI Layout Stability Cases

## Case 001: ObjectCreator model dropdown shifts the right edge

### Symptom

In the object creation drawer, opening the "选择模型" dropdown made the right side feel unstable. The nearby edge and scrollbar behavior visibly changed when the list opened.

### Root cause

The page used the shared `Select` primitive for model picking inside a custom fixed drawer with an internal scroll container. Opening the select introduced scroll-lock or scrollbar-compensation behavior that changed perceived width and caused right-edge jitter.

### Fix

Replace the model picker in `src/pages/project/ObjectCreator.tsx` from `Select` to the project's `DropdownMenu` pattern. Keep the same visual styling and selected-state feedback, but avoid the heavier interaction primitive that was affecting layout stability.

### Why this fix fit the project

- The interaction only needed simple single-choice selection.
- The project already had a native `DropdownMenu` wrapper configured with `modal={false}` semantics.
- The visual design could be preserved without keeping the problematic primitive.

### Implementation reference

- `src/pages/project/ObjectCreator.tsx`

## How to add future cases

For each new case, append another numbered section using the same structure:

- `Case 00X: <short title>`
- `Symptom`
- `Root cause`
- `Fix`
- `Why this fix fit the project`
- `Implementation reference`

## Case 002: Profile identity submenu feels misplaced on hover

### Symptom

In the project header profile menu, hovering "切换身份" opened a second floating panel that felt visually detached from the main menu. The submenu direction and hover behavior made the interaction look offset and unstable.

### Root cause

The menu used a nested `DropdownMenuSub` for a very small two-option identity switch. That added another positioned floating layer where the interaction did not need one, creating a portal-style alignment mismatch instead of a clear in-panel choice list.

### Fix

Keep the nested submenu in `src/components/layout/ProjectHeader.tsx`, but tune the submenu trigger and panel positioning. Add a small `sideOffset` and `alignOffset` to `DropdownMenuSubContent`, and use the project's regular hover surface styles for `DropdownMenuSubTrigger` so the submenu feels attached instead of overlapping awkwardly.

### Why this fix fit the project

- The product still wanted a true hover submenu for identity switching.
- The issue was visual attachment and hover feel, not the existence of the submenu itself.
- Adjusting the submenu's spacing and styling fixed the interaction without changing the menu architecture.

### Implementation reference

- `src/components/layout/ProjectHeader.tsx`

## Case 003: Project workspace dialogs squeeze the viewport horizontally

### Symptom

In the project workspace, opening confirmation dialogs or creator drawers made the right edge jump. The page looked like it was being squeezed horizontally when the overlay appeared.

### Root cause

The workspace uses a fixed-height shell with an inner `overflow-y-auto` content pane, while shared `Dialog` and `Sheet` primitives still lock body scroll. That body-level scroll lock introduced scrollbar compensation on `body`, even though the visible scrolling happened inside the workspace container.

### Fix

Add a global override in `src/index.css` for `body[data-scroll-locked]` so body keeps `overflow-y: scroll` and does not add right-margin compensation. This preserves the existing modal behavior without letting the viewport width change.

### Why this fix fit the project

- The unstable edge came from shared primitive behavior, not one specific page component.
- The application shell already uses internal scroll containers, so body scrollbar compensation was unnecessary.
- A global guard fixes dialogs and drawers consistently without rewriting every overlay.

### Implementation reference

- `src/index.css`
- `src/pages/project/index.tsx`
- `src/components/feedback/FeedbackProvider.tsx`
