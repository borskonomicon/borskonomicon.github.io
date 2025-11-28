# Agent Guidance

These instructions are for LLM-based contributors working in this repository. They apply to all files unless a more specific `AGENTS.md` is added in a subdirectory.

## Project context
- Static recipe site built with [Zola](https://www.getzola.org/) and published via GitHub Pages.
- Recipe content lives in `content/recipes/` as Markdown with front matter metadata.
- The landing page surfaces recipe metadata (title, description, yield, time, tags, source link) and supports on-page search.

## When adding or updating recipes
- Create or edit a Markdown file in `content/recipes/` named for the dish (e.g., `chocolate-chip-banana-bread.md`).
- Front matter must include:
  - `title` (string)
  - `description` (short summary)
  - Optional `extra` table with `yield`, `time`, `source`, and `tags` (array).
- Body should contain the recipe title, yield and timing details if available, an ingredients list, and step-by-step instructions.
- Preserve ingredient amounts, units, and wording exactly as published; do not round, localize, or adjust.
- Attribute the source in `extra.source` using the canonical URL when possible.

## Accuracy checklist (follow for every recipe change)
- Cross-check ingredient quantities against the source’s structured data (e.g., JSON-LD `recipeIngredient`) or printable card rather than prose.
- Mirror units and temperatures exactly (cups vs. grams, °F/°C, teaspoons/tablespoons). Include ranges if present.
- Copy prep/cook times, yields/servings, and oven temperatures verbatim from the source.
- Preserve alternate ingredient wording (e.g., “Greek yogurt or sour cream”) without consolidation.
- After editing, reread the source and confirm every quantity and instruction step matches.

## Working practices
- Keep README human-focused; agent-specific guidance belongs here.
- Prefer minimal diffs: avoid reformatting unrelated text or whitespace.
- Before committing, ensure Markdown front matter remains valid TOML and Zola-compatible.
- If you touch templates or config, run `zola build` when feasible to catch template errors.
