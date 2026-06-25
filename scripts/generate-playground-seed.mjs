import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(__dirname, '..');
const outputPath = resolve(docsRoot, 'docs/.vitepress/theme/playground/generated-seed.json');

function optionValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;

  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value`);
  }

  return value;
}

const frameworkRoot = resolve(docsRoot, optionValue('--framework-root', '../experiment-framework-v2'));
const requireFromFramework = createRequire(join(frameworkRoot, 'package.json'));
const nodePlop = (await import(requireFromFramework.resolve('node-plop'))).default;
const { normalizeAnswers } = await import(pathToFileURL(join(frameworkRoot, 'lib/answers.js')).href);

const targetDir = mkdtempSync(join(tmpdir(), 'experiment-playground-seed-'));
const projectName = 'framework-playground';

function readFiles(root) {
  const files = {};
  const ignored = new Set(['node_modules', 'dist', '.git']);

  function walk(dir) {
    for (const entry of readdirSync(dir).sort()) {
      if (ignored.has(entry)) continue;

      const fullPath = join(dir, entry);
      const relativePath = relative(root, fullPath).replaceAll('\\', '/');
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        files[relativePath] = readFileSync(fullPath, 'utf-8');
      }
    }
  }

  walk(root);
  return files;
}

function withPreviewHarness(files) {
  return {
    ...files,
    'playground/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Experiment Playground Preview</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; background: #f5f7fb; color: #111827; }
      main { max-width: 960px; margin: 0 auto; padding: 32px; }
      .hero { border: 1px solid #d8dee9; background: white; padding: 24px; }
      .target-selector, .alternate-selector { min-height: 120px; border: 1px dashed #9ca3af; padding: 16px; margin-top: 16px; }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <h1>Playground target page</h1>
        <p>This fixture gives the generated experiment selectors real DOM to mount into.</p>
        <div class="target-selector">Primary target selector</div>
        <div class="alternate-selector">Fallback selector</div>
      </section>
    </main>
    <script type="module" src="/playground/preview.js"></script>
  </body>
</html>
`,
    'playground/preview.js': `const bundlePath = '/dist/v1-index.jsx';

async function loadBundle() {
  const response = await fetch(bundlePath + '?t=' + Date.now());
  if (!response.ok) {
    console.warn('Generated bundle is not ready yet: ' + bundlePath);
    return;
  }

  const bundle = await response.text();

  const previous = document.querySelector('[data-playground-bundle]');
  if (previous) previous.remove();

  for (const node of document.querySelectorAll('[data-experiment="framework-playground"]')) {
    node.remove();
  }

  const script = document.createElement('script');
  script.textContent = bundle;
  script.dataset.playgroundBundle = 'true';
  document.body.append(script);
}

async function pollBundle() {
  try {
    await loadBundle();
  } catch (error) {
    console.error(error);
  } finally {
    window.setTimeout(pollBundle, 1500);
  }
}

pollBundle();
`,
  };
}

try {
  const plop = await nodePlop(join(frameworkRoot, 'generator/index.js'));
  const generator = plop.getGenerator('experiment');
  const data = normalizeAnswers({
    targetDir,
    experimentName: projectName,
    classPrefix: projectName,
    globalObject: 'sgd',
    includeEmergencyBrake: true,
    boilerplateType: 'minimal',
    variationCount: 1,
    variationName: 'v1',
    useE2ETesting: false,
  });

  const result = await generator.runActions(data);
  if (result.failures.length > 0) {
    throw new Error(`Generator failed: ${JSON.stringify(result.failures, null, 2)}`);
  }

  const artifact = {
    generatedAt: new Date().toISOString(),
    source: {
      frameworkRoot: relative(docsRoot, frameworkRoot).replaceAll('\\', '/'),
      projectName,
      boilerplateType: 'minimal',
      variationCount: 1,
    },
    files: withPreviewHarness(readFiles(targetDir)),
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf-8');
  console.log(`Wrote ${outputPath}`);
} finally {
  rmSync(targetDir, { recursive: true, force: true });
}
