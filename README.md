# Borskonomicon Recipes

This repository collects family-favorite recipes from around the internet so they remain easy to find and survive link rot. Each recipe is vendored with full ingredients and instructions so it can be reproduced even if the source site disappears. When possible, the original source link is noted to give credit and allow deeper reading.

The site is built with [Zola](https://www.getzola.org/) and published through GitHub Pages. The landing page highlights the archive and includes on-page search for quickly jumping to a recipe.

## Repository layout
- `content/recipes/` — individual recipe files in Markdown, each including ingredients, instructions, yield, and notes.
- `config.toml` — site settings and metadata used during generation.

## Adding a recipe
1. Create a new Markdown file inside `content/recipes/` named for the dish (e.g., `chocolate-chip-banana-bread.md`).
2. Add front matter with a `title`, short `description`, and optional `extra` fields like `yield`, `time`, `source`, and `tags` so the landing page can surface useful context.
3. Include the recipe title in the front matter, then list the yield, prep/bake times if available, ingredients, and step-by-step instructions in the body of the file.
4. Preserve ingredient amounts exactly and keep instructions clear so the recipe remains faithfully reproducible. Track the source link in `extra.source` to credit the origin.

## Accuracy checklist (important for LLM agents)
- Always cross-check the vendored ingredient amounts against the upstream source. Use the site’s JSON-LD `recipeIngredient` list (e.g., `curl -L <url> | rg -n "recipeIngredient"`) or the printable recipe card instead of guessing from prose.
- Mirror units and weights exactly as published (cups, grams, teaspoons, etc.). Do not “improve” or round numbers.
- Copy prep/cook times, yield/servings, and oven temperature directly from the source.
- If the source gives alternate ingredients (e.g., Greek yogurt or sour cream), keep the wording consistent with the source.
- After editing, reread the source to confirm every quantity and instruction step matches before committing.
