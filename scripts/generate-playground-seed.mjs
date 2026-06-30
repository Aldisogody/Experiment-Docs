import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
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

function copyIfExists(source, destination) {
  if (!existsSync(source)) return;
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true });
}

function packFrameworkTarball() {
  const packageJsonPath = resolve(frameworkRoot, 'package.json');
  if (!existsSync(packageJsonPath)) {
    throw new Error(
      `create-experiment framework not found at ${frameworkRoot}. Set --framework-root or clone experiment-framework-v2 next to this repo.`,
    );
  }

  const packRoot = mkdtemp();
  const packageRoot = join(packRoot, 'package');
  const packDir = join(packRoot, 'dist');
  try {
    mkdirSync(packageRoot, { recursive: true });
    mkdirSync(packDir, { recursive: true });

    const sourcePackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const packageJson = {
      name: sourcePackageJson.name,
      version: sourcePackageJson.version,
      description: sourcePackageJson.description,
      type: sourcePackageJson.type,
      license: sourcePackageJson.license,
      bin: {
        'exp-build': './bin/build.js',
      },
      exports: {
        './framework': './runtime/framework.js',
      },
      peerDependencies: {
        esbuild: sourcePackageJson.dependencies?.esbuild ?? '^0.27.0',
        vite: '>=5',
      },
    };

    writeFileSync(join(packageRoot, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8');
    copyIfExists(resolve(frameworkRoot, 'LICENSE'), join(packageRoot, 'LICENSE'));
    copyIfExists(resolve(frameworkRoot, 'README.md'), join(packageRoot, 'README.md'));
    copyIfExists(resolve(frameworkRoot, 'bin/build.js'), join(packageRoot, 'bin/build.js'));
    copyIfExists(resolve(frameworkRoot, 'lib/adobe-target-output.js'), join(packageRoot, 'lib/adobe-target-output.js'));
    copyIfExists(resolve(frameworkRoot, 'lib/experiment-config.js'), join(packageRoot, 'lib/experiment-config.js'));
    copyIfExists(resolve(frameworkRoot, 'runtime'), join(packageRoot, 'runtime'));

    execFileSync('npm', ['pack', '--pack-destination', packDir], {
      cwd: packageRoot,
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
    rmSync(packRoot, { recursive: true, force: true });
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
