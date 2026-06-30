import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const sampleRoot = resolve(repoRoot, 'docs/playground/sample');
const outputPath = resolve(repoRoot, 'docs/.vitepress/theme/playground/generated-seed.json');
const tarballName = 'create-experiment-2.0.2.tgz';

function optionValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;

  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value`);
  }

  return value;
}

const frameworkRoot = resolve(repoRoot, optionValue('--framework-root', '../experiment-framework-v2'));

function readFiles(root) {
  const files = {};
  const ignored = new Set([
    '.DS_Store',
    '.git',
    '.playground-cache',
    '.turbo',
    '.vite',
    tarballName,
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

function withLocalCreateExperimentTarball(files) {
  const packageJson = JSON.parse(files['package.json']);
  delete packageJson.scripts?.['playground:preview'];
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    'create-experiment': `file:./${tarballName}`,
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

function packFrameworkTarball() {
  const packageJsonPath = resolve(frameworkRoot, 'package.json');
  if (!existsSync(packageJsonPath)) {
    throw new Error(
      `create-experiment framework not found at ${frameworkRoot}. Set --framework-root or clone experiment-framework-v2 next to this repo.`,
    );
  }

  const packDir = mkdtemp();
  try {
    execFileSync('npm', ['pack', '--pack-destination', packDir], {
      cwd: frameworkRoot,
      env: {
        ...process.env,
        npm_config_cache: join(packDir, '.npm-cache'),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const tarballs = readdirSync(packDir).filter((entry) => entry.endsWith('.tgz'));
    if (tarballs.length !== 1) {
      throw new Error(`Expected one packed create-experiment tarball, found ${tarballs.length}.`);
    }

    const packedPath = join(packDir, tarballs[0]);
    const stablePath = join(packDir, tarballName);
    copyFileSync(packedPath, stablePath);
    return readFileSync(stablePath).toString('base64');
  } finally {
    rmSync(packDir, { recursive: true, force: true });
  }
}

function mkdtemp() {
  const root = resolve(tmpdir(), `experiment-playground-pack-${process.pid}-${Date.now()}`);
  mkdirSync(root, { recursive: true });
  return root;
}

const artifact = {
  source: {
    sampleRoot: relative(repoRoot, sampleRoot).replaceAll('\\', '/'),
    frameworkRoot: relative(repoRoot, frameworkRoot).replaceAll('\\', '/'),
    tarballName,
  },
  files: withLocalCreateExperimentTarball(readFiles(sampleRoot)),
  binaryFiles: {
    [tarballName]: packFrameworkTarball(),
  },
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf-8');
console.log(`Wrote ${outputPath}`);
