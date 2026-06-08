# Editor Setup

Generated projects include `biome.json`. The active templates do not generate `.vscode/` workspace settings, so configure your editor manually if you want format-on-save.

## VSCode

### Extensions

Install [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for real-time JavaScript, JSX, and JSON linting and formatting.

### Workspace settings

Add workspace settings if you want VSCode to format source files on save:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "biomejs.biome",
    "[javascript]": { "editor.defaultFormatter": "biomejs.biome" },
    "[javascriptreact]": { "editor.defaultFormatter": "biomejs.biome" },
    "[json]": { "editor.defaultFormatter": "biomejs.biome" }
}
```

With these settings, saving a `.js`, `.jsx`, or `.json` file runs the Biome formatter automatically.

### Prettier conflict

If you have the Prettier extension installed globally, it may compete with Biome for JS/JSX formatting. Disable Prettier for this workspace:

```json
// .vscode/settings.json — add this line
{
    "[javascript]": { "editor.defaultFormatter": "biomejs.biome" },
    "[javascriptreact]": { "editor.defaultFormatter": "biomejs.biome" }
}
```

Or disable Prettier entirely for the workspace via **Extensions → Prettier → Disable (Workspace)**.

## JetBrains (WebStorm / IntelliJ)

Install the [Biome plugin](https://plugins.jetbrains.com/plugin/22761-biome) from the JetBrains Marketplace.

After installation:
1. Go to **Settings → Languages & Frameworks → Biome**
2. Set the Biome executable path to `node_modules/.bin/biome`
3. Enable **Run on Save**

## SCSS

Biome does not format or lint SCSS. Use your editor's Sass support for syntax highlighting, but keep formatting changes aligned with the generated 4-space style and the [SCSS Modules guide](/linting/stylelint).
