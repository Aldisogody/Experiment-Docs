<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import seed from '../../playground/generated-seed.json';
import CodeEditor from './CodeEditor.vue';
import FileTree from './FileTree.vue';
import PlaygroundToolbar from './PlaygroundToolbar.vue';
import PreviewPane from './PreviewPane.vue';
import TerminalPane from './TerminalPane.vue';
import type { PlaygroundStatus, SeedArtifact, TerminalLine } from './types';
import { stopProcess, toFileSystemTree, writeProjectFile } from './webcontainer';

const artifact = seed as SeedArtifact;
const editableFiles = ref<Record<string, string>>({ ...artifact.files });
const activePath = ref('src/js/v1/index.jsx');
const status = ref<PlaygroundStatus>('idle');
const errorMessage = ref('');
const previewUrl = ref('');
const terminalLines = ref<TerminalLine[]>([]);
const webcontainer = ref<WebContainer | null>(null);
const installProcess = ref<WebContainerProcess | null>(null);
const devProcess = ref<WebContainerProcess | null>(null);
const previewProcess = ref<WebContainerProcess | null>(null);
let lineId = 0;
let writeTimer = 0;
let unsubscribeServerReady: (() => void) | null = null;

const files = computed(() => Object.keys(editableFiles.value).sort());
const activeContents = computed({
  get: () => editableFiles.value[activePath.value] ?? '',
  set: (value: string) => {
    editableFiles.value = { ...editableFiles.value, [activePath.value]: value };
    scheduleFileWrite(activePath.value, value);
  },
});

const canReset = computed(() => status.value !== 'booting' && status.value !== 'installing');
const canRestart = computed(() => Boolean(webcontainer.value) && status.value !== 'booting');
const previewStatus = computed(() => (previewUrl.value ? 'ready' : status.value));

function appendLine(source: TerminalLine['source'], text: string) {
  for (const line of text.split('\n')) {
    if (line.trim().length === 0) continue;
    terminalLines.value.push({ id: lineId += 1, source, text: line });
  }
}

function pipeProcessOutput(process: WebContainerProcess, source: TerminalLine['source']) {
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        appendLine(source, data);
      },
    }),
  ).catch((error) => {
    appendLine('system', error instanceof Error ? error.message : String(error));
  });
}

async function installDependencies(instance: WebContainer) {
  status.value = 'installing';
  appendLine('system', 'Installing generated project dependencies...');
  installProcess.value = await instance.spawn('npm', ['install']);
  pipeProcessOutput(installProcess.value, 'install');
  const exitCode = await installProcess.value.exit;
  installProcess.value = null;
  if (exitCode !== 0) throw new Error(`Dependency install exited with code ${exitCode}.`);
}

async function startProcesses(instance: WebContainer) {
  status.value = 'starting';
  appendLine('system', 'Starting generated watch process...');
  devProcess.value = await instance.spawn('npm', ['run', 'dev']);
  pipeProcessOutput(devProcess.value, 'dev');

  appendLine('system', 'Starting preview harness...');
  previewProcess.value = await instance.spawn('npx', ['vite', '--host', '0.0.0.0']);
  pipeProcessOutput(previewProcess.value, 'preview');

  unsubscribeServerReady?.();
  unsubscribeServerReady = instance.on('server-ready', (_port, url) => {
    previewUrl.value = `${url}/playground/`;
    status.value = 'ready';
    appendLine('system', `Preview ready at ${previewUrl.value}`);
  });
}

async function boot() {
  if (!window.crossOriginIsolated) {
    status.value = 'error';
    errorMessage.value = 'The playground requires cross-origin isolation headers.';
    return;
  }

  status.value = 'booting';
  errorMessage.value = '';
  terminalLines.value = [];
  appendLine('system', 'Booting WebContainer...');

  try {
    const { WebContainer } = await import('@webcontainer/api');
    const instance = await WebContainer.boot();
    webcontainer.value = instance;
    await instance.mount(toFileSystemTree(editableFiles.value));
    await installDependencies(instance);
    await startProcesses(instance);
  } catch (error) {
    status.value = 'error';
    errorMessage.value = error instanceof Error ? error.message : String(error);
    appendLine('system', errorMessage.value);
  }
}

async function stopRunningProcesses() {
  await Promise.all([
    stopProcess(installProcess.value),
    stopProcess(devProcess.value),
    stopProcess(previewProcess.value),
  ]);
  installProcess.value = null;
  devProcess.value = null;
  previewProcess.value = null;
}

async function restart() {
  if (!webcontainer.value) return;
  previewUrl.value = '';
  await stopRunningProcesses();
  await startProcesses(webcontainer.value);
}

async function reset() {
  previewUrl.value = '';
  window.clearTimeout(writeTimer);
  editableFiles.value = { ...artifact.files };
  activePath.value = 'src/js/v1/index.jsx';
  await stopRunningProcesses();
  if (webcontainer.value) {
    await webcontainer.value.mount(toFileSystemTree(editableFiles.value));
    await startProcesses(webcontainer.value);
  }
}

function scheduleFileWrite(path: string, contents: string) {
  if (!webcontainer.value || status.value === 'booting' || status.value === 'installing') return;
  window.clearTimeout(writeTimer);
  writeTimer = window.setTimeout(() => {
    if (!webcontainer.value) return;
    writeProjectFile(webcontainer.value, path, contents).catch((error) => {
      appendLine('system', error instanceof Error ? error.message : String(error));
    });
  }, 250);
}

onMounted(() => {
  boot();
});

onBeforeUnmount(() => {
  window.clearTimeout(writeTimer);
  unsubscribeServerReady?.();
  unsubscribeServerReady = null;
  stopRunningProcesses();
});
</script>

<template>
  <div class="playground-shell">
    <PlaygroundToolbar
      :status="status"
      :can-reset="canReset"
      :can-restart="canRestart"
      @reset="reset"
      @restart="restart"
    />

    <div v-if="status === 'error'" class="playground-error" role="alert">
      {{ errorMessage }}
    </div>

    <div class="playground-grid">
      <FileTree :files="files" :active-path="activePath" @select="activePath = $event" />
      <CodeEditor
        v-model="activeContents"
        :path="activePath"
        :disabled="status === 'booting' || status === 'installing'"
      />
      <PreviewPane :url="previewUrl" :status-label="previewStatus" />
      <TerminalPane :lines="terminalLines" />
    </div>
  </div>
</template>
