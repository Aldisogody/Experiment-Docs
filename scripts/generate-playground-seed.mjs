import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const sampleRoot = resolve(repoRoot, 'docs/playground/sample');
const outputPath = resolve(repoRoot, 'docs/.vitepress/theme/playground/generated-seed.json');
const frameworkPackageName = '@sogody/experiment-framework';
const publishedFrameworkRange = '^2.0.0';

function readFiles(root) {
  const files = {};
  const ignored = new Set([
    '.DS_Store',
    '.git',
    '.playground-cache',
    '.turbo',
    '.vite',
    'dist',
    'node_modules',
  ]);

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

function withSandboxPackageMetadata(files) {
  const packageJson = JSON.parse(files['package.json']);
  delete packageJson.scripts?.['playground:preview'];
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    [frameworkPackageName]: packageJson.devDependencies?.[frameworkPackageName] || publishedFrameworkRange,
  };
  delete packageJson.devDependencies['@biomejs/biome'];

  if (Array.isArray(packageJson.pnpm?.onlyBuiltDependencies)) {
    packageJson.pnpm.onlyBuiltDependencies = packageJson.pnpm.onlyBuiltDependencies.filter(
      (dependency) => dependency !== '@biomejs/biome',
    );
  }

  return {
    ...files,
    'package.json': `${JSON.stringify(packageJson, null, 2)}\n`,
  };
}

const artifact = {
  source: {
    sampleRoot: relative(repoRoot, sampleRoot).replaceAll('\\', '/'),
    frameworkPackageName,
    frameworkVersion: publishedFrameworkRange,
  },
  files: withSandboxPackageMetadata(readFiles(sampleRoot)),
  binaryFiles: {},
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf-8');
console.log(`Wrote ${outputPath}`);
