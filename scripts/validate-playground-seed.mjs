import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const artifactPath = resolve('docs/.vitepress/theme/playground/generated-seed.json');
const artifact = JSON.parse(readFileSync(artifactPath, 'utf-8'));
const playgroundApp = readFileSync(
  resolve('docs/.vitepress/theme/components/playground/PlaygroundApp.vue'),
  'utf-8',
);
const playgroundPage = readFileSync(resolve('docs/playground.md'), 'utf-8');

const requiredFiles = [
  'package.json',
  'experiment.config.js',
  'src/config.js',
  'src/components/ExperimentButton/index.jsx',
  'src/components/ExperimentButton/styles.module.scss',
  'src/js/v1/index.jsx',
  'src/js/v1/styles.module.scss',
  'vite.config.js',
];
const forbiddenFiles = [
  '.editorconfig',
  '.gitignore',
  '.nvmrc',
  'README.md',
  'biome.json',
  'jsconfig.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'yarn.lock',
];

if (!artifact || typeof artifact !== 'object') {
  throw new Error('Playground seed artifact must be an object.');
}

if (!artifact.source || artifact.source.sampleRoot !== 'docs/playground/sample') {
  throw new Error('Playground seed must be generated from docs/playground/sample.');
}

if (!artifact.files || typeof artifact.files !== 'object') {
  throw new Error('Playground seed artifact must include a files object.');
}

for (const file of requiredFiles) {
  if (typeof artifact.files[file] !== 'string' || artifact.files[file].length === 0) {
    throw new Error(`Playground seed is missing ${file}.`);
  }
}

for (const file of forbiddenFiles) {
  if (file in artifact.files) {
    throw new Error(`npm-native playground seed must not include ${file}.`);
  }
}

const packageJson = JSON.parse(artifact.files['package.json']);
if (packageJson.scripts?.dev !== 'exp-build --watch') {
  throw new Error('Generated project must expose the expected watch command.');
}

if (packageJson.devDependencies?.['@sogody/experiment-framework'] !== '^2.0.0') {
  throw new Error('Generated project must use the published @sogody/experiment-framework package.');
}

if (packageJson.devDependencies?.['@biomejs/biome']) {
  throw new Error('Sandbox package metadata must not install @biomejs/biome.');
}

if (packageJson.engines?.pnpm || packageJson.pnpm) {
  throw new Error('npm-native sandbox package metadata must not include pnpm configuration.');
}

if (!artifact.files['src/js/v1/index.jsx'].includes('@sogody/experiment-framework/framework')) {
  throw new Error('Generated v1 entry must import the real framework runtime.');
}

if (artifact.files['package.json'].includes('.playground-cache')) {
  throw new Error('Generated seed must not reference the local playground cache.');
}

if (artifact.files['package.json'].includes('file:./') || artifact.files['package.json'].includes('.tgz')) {
  throw new Error('Generated seed must not use local package tarballs.');
}

if ('playground/index.html' in artifact.files || 'playground/preview.js' in artifact.files) {
  throw new Error('Generated seed must not include preview harness files.');
}

if (packageJson.scripts?.['playground:preview']) {
  throw new Error('Generated project must not expose the preview command.');
}

if (!playgroundApp.includes("instance.spawn('npm', ['install'])")) {
  throw new Error('Playground dependency installation must use npm.');
}

if (
  !playgroundApp.includes('function disposePlayground()') ||
  !playgroundApp.includes('onBeforeUnmount(disposePlayground)')
) {
  throw new Error('Playground must dispose its WebContainer when the component unmounts.');
}

if (playgroundApp.includes('.then(() => refreshPendingBundle())')) {
  throw new Error('Playground must not refresh the copyable bundle after source writes only.');
}

if (!playgroundApp.includes('Building latest bundle...')) {
  throw new Error('Playground copy flow must announce that it is building the latest bundle.');
}

if (!playgroundApp.includes('Latest bundle copied')) {
  throw new Error('Playground copy flow must confirm only after the latest bundle is copied.');
}

if (
  !playgroundPage.includes('src/components/ExperimentButton/styles.module.scss') ||
  !playgroundPage.includes('src/js/v1/styles.module.scss')
) {
  throw new Error('Playground page must explain button styles versus mount-root styles.');
}

if (!playgroundPage.includes('uses npm') || !playgroundPage.includes('does not ship a lockfile')) {
  throw new Error('Playground page must document the npm-native sandbox install policy.');
}

console.log(`Validated ${requiredFiles.length} required playground seed files.`);
