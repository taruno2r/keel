---
name: sync-icons
description: Sync icons from the Keel Figma "Icons (core)" page into this repo and Storybook. Exports every Icon/<name> component as SVG, verifies the copy is exact, regenerates the typed icon set used by <Icon />, and reports what changed. Use when the user says "sync icons", "update icons from Figma", "I added/changed an icon in Figma", or runs /sync-icons.
---

# Sync icons from Figma

Source of truth: the "Icons (core)" page in the Keel Figma file (`8IEdts3bNiwKEwISZ9Md9D`).
Every icon is a component named `Icon/<name>`. The repo keeps an exact snapshot of their
geometry in `src/icons/figma/icons.json`; `src/icons/generated/icons.ts` is built from it.

## Steps

1. **Branch.** If on `master`, create `icons-sync-<YYYY-MM-DD>` first. Never commit or push unless asked.

2. **List icons in Figma** (read-only).
   - Load the `figma:figma-use` skill, then `create_session` with the file key.
   - Read `scripts/figma/export-icons.js` and pass its contents **verbatim** as the `code` of one `use_figma` call.
   - It returns `{ fingerprint, nodes }` (icon name → node id).

3. **Compare.** Run `node scripts/icons-fingerprint.mjs`. If it equals the Figma `fingerprint`, the repo is
   already in sync: say so and stop.

4. **Download.** For every entry in `nodes`, call `download_assets` with that `nodeId` and
   `defaultFormat: "svg"`, and save its `export.url` as `<scratchpad>/icons-raw/<name>.svg` with
   `curl -f -L` straight away (the URLs are short-lived). Use a fresh, empty folder.

5. **Import.** `npm run icons:import -- <scratchpad>/icons-raw`. It fails if a file's Figma layer id
   doesn't match its name, or an icon isn't plain single-colour paths: report that rather than editing SVGs.
   Then `node scripts/icons-fingerprint.mjs` **must** equal the Figma fingerprint. If not, re-download.

6. **Regenerate.** `npm run icons`, then `git diff --stat src/icons` and list added, removed and changed icons.

7. **Breakage.** For each removed or renamed icon, `git grep` its old name (e.g. `name="trash-2"`) in `src/`.
   Fix the reference if the replacement is obvious; otherwise list it for the user.

8. **Verify.** `npx tsc -b`, `npm run lint`, `npm run icons:check`, `npm run test-storybook`. If Storybook is
   running, screenshot Foundations/Icons and look at it.

9. **Report.** Icons added / removed / changed, any breakage, and check results.

## Rules

- Figma is the source of truth. Don't edit `src/icons/generated/` or hand-edit path data.
- Every Figma call in this flow is read-only. Never write to the Figma file.
- Icons are filled with `currentColor` in code; their default colour is `--keel-icon-default` (Icon.css).
