# Editor Setup

Generated projects include VSCode configuration out of the box. Other editors require manual setup.

## VSCode

### Extensions

The generated `.vscode/extensions.json` recommends:

```json
{
    "recommendations": [
        "biomejs.biome",
        "stylelint.vscode-stylelint"
    ]
}
```

Open VSCode and accept the prompt to install recommended extensions, or install them manually:

- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) — Biome LSP for real-time linting and formatting
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) — SCSS linting in the editor

### Workspace settings

The generated `.vscode/settings.json` configures format-on-save for all file types:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "biomejs.biome",
    "[scss]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "stylelint.validate": ["scss"]
}
```

With these settings:
- Saving a `.js` or `.jsx` file runs the Biome formatter automatically
- Stylelint validates `.scss` files in real-time

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

For SCSS, WebStorm has built-in Stylelint support. Go to **Settings → Languages & Frameworks → Style Sheets → Stylelint** and enable it.
