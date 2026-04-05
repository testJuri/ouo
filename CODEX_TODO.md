# Codex Handoff Todo

## Current State

- Infinite canvas has been integrated into `jurilu` as a first-pass migration.
- Entry point from episode detail is already wired:
  - [src/pages/project/EpisodeDetail.tsx](/Users/hanqian/My_/my_code/jurilu/src/pages/project/EpisodeDetail.tsx)
- Canvas route is already registered:
  - [src/App.tsx](/Users/hanqian/My_/my_code/jurilu/src/App.tsx)
- Canvas wrapper page:
  - [src/pages/project/EpisodeCanvas.tsx](/Users/hanqian/My_/my_code/jurilu/src/pages/project/EpisodeCanvas.tsx)
- Migrated canvas subsystem lives here:
  - [src/features/infinite-canvas](/Users/hanqian/My_/my_code/jurilu/src/features/infinite-canvas)
- Build passed successfully with:
  - `npm run build`

## What Was Done

- Migrated the infinite canvas codebase from:
  - `/Users/hanqian/My_/my_code/ali_flow/infinite-canvas-gg4c-webui`
- Added required runtime deps in:
  - [package.json](/Users/hanqian/My_/my_code/jurilu/package.json)
- Adapted canvas routing from standalone `/canvas/:projectId` style to episode-based route:
  - `/project/:projectId/episode/:episodeId/canvas`
- Adapted canvas persistence so each episode gets its own local canvas key:
  - `episode-${projectId}-${episodeId}`
- Adjusted canvas back navigation to return to episode detail instead of the old external project pages.

## Important Notes

- This is still a "functional migration" version, not yet visually aligned with MangaCanvas.
- `antd` is currently present mainly for the infinite canvas subsystem.
- Canvas data is still stored in its own IndexedDB model, just keyed by episode identity.
- The current canvas header/UI still contains visual language from the source project.
- Git remote has already been pushed to:
  - `git@github.com:testJuri/juri.git`

## Goal For Next Codex

Do a "light productization pass" so the canvas feels like part of MangaCanvas, without rewriting the whole subsystem.

## Priority Tasks

### 1. Visual Alignment

Make the canvas look closer to MangaCanvas instead of the original dark external tool.

Primary files:

- [src/features/infinite-canvas/Canvas.tsx](/Users/hanqian/My_/my_code/jurilu/src/features/infinite-canvas/Canvas.tsx)
- [src/features/infinite-canvas/canvas.css](/Users/hanqian/My_/my_code/jurilu/src/features/infinite-canvas/canvas.css)
- [src/features/infinite-canvas/styles/design-system.css](/Users/hanqian/My_/my_code/jurilu/src/features/infinite-canvas/styles/design-system.css)

Suggested changes:

- Replace the current dark header feel with MangaCanvas brand colors.
- Tune button styles, surfaces, borders, radius, and spacing to match existing project pages.
- Reduce the "external product" feeling from the top bar and floating controls.

### 2. Product Language Alignment

Update wording so it matches episode creation workflow.

Suggested changes:

- Header title should reflect current episode context.
- Replace generic "项目" language with "片段" or "创作画布" where appropriate.
- Remove or rename old source-project actions that do not belong in MangaCanvas.
- Keep "返回片段" behavior intact.

### 3. Interaction Simplification

Trim obviously inherited UI that is not useful in this product yet.

Candidates to review:

- API settings entry in canvas header
- Any legacy menu items that do not map to MangaCanvas
- Overly heavy imported modal/panel styling

Do not over-refactor the engine yet. Keep this pass UI-focused.

### 4. Episode Context Injection

If time allows, start making the canvas feel episode-aware.

Good first step:

- Read episode mock data from [src/pages/project/EpisodeDetail.tsx](/Users/hanqian/My_/my_code/jurilu/src/pages/project/EpisodeDetail.tsx)
- Use episode name/code in canvas header
- Optionally pre-seed starter nodes from storyboard data

This is optional for the first cleanup pass, but highly valuable.

## Recommended Approach

1. Keep the current canvas engine and node logic intact.
2. Focus on `Canvas.tsx` shell, header, toolbar appearance, and wording first.
3. Only change node internals if visual inconsistency is severe.
4. Avoid deleting `antd` in this pass.
5. Re-run `npm run build` before finishing.

## Risks

- A full rewrite away from `antd` will balloon scope.
- Deep persistence refactor is not needed yet.
- Over-editing node internals may introduce regressions in generation flows.

## Definition Of Done For Next Pass

- Clicking "继续创作" still opens the canvas.
- Canvas still builds and runs.
- Header, toolbar, and wording feel consistent with MangaCanvas.
- No obvious leftover navigation or language from the source project.
- Preferably the episode title is visible in the canvas shell.
