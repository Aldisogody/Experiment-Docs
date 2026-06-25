import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const artifactPath = resolve('docs/.vitepress/theme/playground/generated-seed.json');
const artifact = JSON.parse(readFileSync(artifactPath, 'utf-8'));

const requiredFiles = [
  'package.json',
  'experiment.config.js',
  'src/config.js',
  'src/js/v1/index.jsx',
  'src/js/v1/styles.module.scss',
  'playground/index.html',
  'playground/preview.js',
];

if (!artifact || typeof artifact !== 'object') {
  throw new Error('Playground seed artifact must be an object.');
}

if (!artifact.files || typeof artifact.files !== 'object') {
  throw new Error('Playground seed artifact must include a files object.');
}

for (const file of requiredFiles) {
  if (typeof artifact.files[file] !== 'string' || artifact.files[file].length === 0) {
    throw new Error(`Playground seed is missing ${file}.`);
  }
}

const packageJson = JSON.parse(artifact.files['package.json']);
if (packageJson.scripts?.dev !== 'exp-build --watch') {
  throw new Error('Generated project must expose the expected watch command.');
}

if (!artifact.files['src/js/v1/index.jsx'].includes("create-experiment/framework")) {
  throw new Error('Generated v1 entry must import the real framework runtime.');
}

console.log(`Validated ${requiredFiles.length} required playground seed files.`);
