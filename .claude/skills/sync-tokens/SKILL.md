---
name: sync-tokens
description: Sync design tokens from the Keel Figma file into this repo and Storybook. Pulls every Figma variable, verifies the copy is exact, regenerates the CSS tokens, makes sure every token appears on a Storybook page, and reports what changed. Use when the user says "sync tokens", "update tokens from Figma", "I changed variables in Figma", or runs /sync-tokens.
---

# Sync tokens from Figma

Source of truth: the Figma file whose key is in `src/tokens/figma/variables.json` → `source.fileKey`
(Keel, `8IEdts3bNiwKEwISZ9Md9D`). The repo keeps an exact snapshot of its variables;
everything else is generated from it.

## Steps

1. **Branch.** If on `master`, create `figma-sync-<YYYY-MM-DD>` first. Never commit or push unless asked.

2. **Export from Figma** (read-only).
   - Load the `figma:figma-use` skill, then `create_session` with the file key.
   - Read `scripts/figma/export-variables.js` and pass its contents **verbatim** as the `code` of one `use_figma` call.
   - It returns `{ fingerprint, problems, snapshot }`.

3. **Compare.** Run `node scripts/fingerprint.mjs`. If `count` and `hash` equal the Figma `fingerprint`,
   the repo is already in sync: say so and stop.

4. **Write the snapshot.** Write `snapshot` to `src/tokens/figma/variables.json` as JSON with 2-space
   indentation and a trailing newline. Run `node scripts/fingerprint.mjs` again: it **must** equal the
   Figma fingerprint. If not, the copy is wrong; rewrite it. Never hand-edit values to make it match.

5. **Report `problems`.** Each one is a variable aliasing something outside the file's collections
   (usually a deleted variable). The raw value was inlined; tell the user which variable to fix in Figma.

6. **Regenerate.** `npm run tokens`. If it fails because a collection other than `Theme` has several modes,
   stop and ask the user how those modes should map to CSS (e.g. Desktop/Mobile → media queries).
   Don't guess.

7. **Summarize.** `npm run tokens:diff` lists added, removed and changed variables and collections.

8. **Storybook coverage.** `npm run tokens:check`.
   - Tokens matching an existing entry in `src/docs/foundations/coverage.ts` appear automatically.
   - For uncovered tokens: add an entry to `coverage.ts` and render it on the right Foundations page,
     following that page's existing patterns (new primitive group → new section on Primitives; new
     collection → ask the user whether it gets its own page).
   - If a collection was renamed, update its name in `coverage.ts`.

9. **Breakage.** For each removed or renamed variable, `git grep` its old CSS variable
   (e.g. `--keel-color-surface-card`) outside `src/tokens/generated/`. Fix the reference if the replacement is
   obvious; otherwise list it for the user.

10. **Verify.** `npx tsc -b`, `npm run lint`, `npm run tokens:check`, `npm run test-storybook`. If Storybook
    is running, screenshot the affected Foundations pages and look at them.

11. **Report.** The diff summary, any `problems`, coverage changes, breakage, and check results.

## Rules

- Figma is the source of truth. Don't edit `src/tokens/generated/` or invent values. If something
  looks wrong in Figma, report it rather than patching it in code.
- Every Figma call in this flow is read-only. Never write to the Figma file.
