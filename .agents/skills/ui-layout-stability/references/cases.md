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
