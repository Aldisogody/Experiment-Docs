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
const isTransitioning = ref(false);
const dependenciesInstalled = ref(false);
let lineId = 0;
let operationId = 0;
let writeGeneration = 0;
let unsubscribeServerReady: (() => void) | null = null;
const writeTimers = new Map<string, number>();

const files = computed(() => Object.keys(editableFiles.value).sort());
const activeContents = computed({
  get: () => editableFiles.value[activePath.value] ?? '',
  set: (value: string) => {
    editableFiles.value = { ...editableFiles.value, [activePath.value]: value };
    scheduleFileWrite(activePath.value, value);
  },
});

const isLifecycleLocked = computed(
  () => isTransitioning.value || status.value === 'booting' || status.value === 'installing' || status.value === 'starting',
);
const canReset = computed(() => !isLifecycleLocked.value);
const canRestart = computed(() => Boolean(webcontainer.value) && !isLifecycleLocked.value);
const isEditorDisabled = computed(() => isLifecycleLocked.value);
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
    if (error instanceof Error && error.name === 'AbortError') return;
    appendLine('system', error instanceof Error ? error.message : String(error));
  });
}

function beginOperation(options: { invalidateWrites?: boolean } = {}) {
  isTransitioning.value = true;
  operationId += 1;
  if (options.invalidateWrites) {
    writeGeneration += 1;
  }
  return operationId;
}

function isCurrentOperation(id: number) {
  return id === operationId;
}

function finishOperation(id: number) {
  if (isCurrentOperation(id)) {
    isTransitioning.value = false;
  }
}

function setOperationError(error: unknown) {
  status.value = 'error';
  errorMessage.value = error instanceof Error ? error.message : String(error);
  appendLine('system', errorMessage.value);
}

function clearProcessRef(process: WebContainerProcess) {
  if (installProcess.value === process) installProcess.value = null;
  if (devProcess.value === process) devProcess.value = null;
  if (previewProcess.value === process) previewProcess.value = null;
}

async function stopStartedProcesses(processes: WebContainerProcess[]) {
  const results = await Promise.allSettled(processes.map((process) => stopProcess(process)));
  for (const process of processes) {
    clearProcessRef(process);
  }
  const failedStop = results.find((result) => result.status === 'rejected');
  if (failedStop?.status === 'rejected') throw failedStop.reason;
}

function discardWebContainer(instance = webcontainer.value) {
  if (!instance) return;
  if (webcontainer.value === instance) {
    webcontainer.value = null;
  }
  dependenciesInstalled.value = false;
  try {
    instance.teardown();
  } catch (error) {
    appendLine('system', error instanceof Error ? error.message : String(error));
  }
}

async function installDependencies(instance: WebContainer, id: number) {
  if (!isCurrentOperation(id)) return false;
  status.value = 'installing';
  appendLine('system', 'Installing generated project dependencies...');
  const process = await instance.spawn('npm', ['install']);
  installProcess.value = process;
  pipeProcessOutput(process, 'install');
  if (!isCurrentOperation(id)) {
    await stopStartedProcesses([process]);
    return false;
  }
  const exitCode = await process.exit;
  clearProcessRef(process);
  if (!isCurrentOperation(id)) return false;
  if (exitCode !== 0) throw new Error(`Dependency install exited with code ${exitCode}.`);
  dependenciesInstalled.value = true;
  return true;
}

async function startProcesses(instance: WebContainer, id: number) {
  if (!isCurrentOperation(id)) return;
  status.value = 'starting';
  appendLine('system', 'Starting generated watch process...');
  const dev = await instance.spawn('npm', ['run', 'dev']);
  devProcess.value = dev;
  pipeProcessOutput(dev, 'dev');
  if (!isCurrentOperation(id)) {
    await stopStartedProcesses([dev]);
    return;
  }

  appendLine('system', 'Starting preview harness...');
  const preview = await instance.spawn('npx', ['vite', '--host', '0.0.0.0']);
  previewProcess.value = preview;
  pipeProcessOutput(preview, 'preview');
  if (!isCurrentOperation(id)) {
    await stopStartedProcesses([dev, preview]);
    return;
  }

  unsubscribeServerReady?.();
  unsubscribeServerReady = instance.on('server-ready', (_port, url) => {
    if (!isCurrentOperation(id)) return;
    previewUrl.value = `${url}/playground/`;
    status.value = 'ready';
    appendLine('system', `Preview ready at ${previewUrl.value}`);
  });
}

async function boot() {
  if (isTransitioning.value) return;
  const id = beginOperation({ invalidateWrites: true });

  if (!window.crossOriginIsolated) {
    status.value = 'error';
    errorMessage.value = 'The playground requires cross-origin isolation headers.';
    finishOperation(id);
    return;
  }

  status.value = 'booting';
  errorMessage.value = '';
  terminalLines.value = [];
  dependenciesInstalled.value = false;
  appendLine('system', 'Booting WebContainer...');

  try {
    const { WebContainer } = await import('@webcontainer/api');
    if (!isCurrentOperation(id)) return;
    const instance = await WebContainer.boot();
    if (!isCurrentOperation(id)) {
      discardWebContainer(instance);
      return;
    }
    webcontainer.value = instance;
    await instance.mount(toFileSystemTree(editableFiles.value));
    if (!isCurrentOperation(id)) {
      discardWebContainer(instance);
      return;
    }
    const installed = await installDependencies(instance, id);
    if (!installed || !isCurrentOperation(id)) {
      if (!isCurrentOperation(id)) discardWebContainer(instance);
      return;
    }
    await startProcesses(instance, id);
  } catch (error) {
    if (isCurrentOperation(id)) {
      setOperationError(error);
      await cleanupRunningProcesses();
      if (!dependenciesInstalled.value) {
        discardWebContainer();
      }
    }
  } finally {
    finishOperation(id);
  }
}

async function stopRunningProcesses() {
  unsubscribeServerReady?.();
  unsubscribeServerReady = null;
  const results = await Promise.allSettled([
    stopProcess(installProcess.value),
    stopProcess(devProcess.value),
    stopProcess(previewProcess.value),
  ]);
  installProcess.value = null;
  devProcess.value = null;
  previewProcess.value = null;
  const failedStop = results.find((result) => result.status === 'rejected');
  if (failedStop?.status === 'rejected') throw failedStop.reason;
}

async function restart() {
  if (!webcontainer.value || isLifecycleLocked.value) return;
  const id = beginOperation();
  previewUrl.value = '';
  try {
    await stopRunningProcesses();
    if (!dependenciesInstalled.value) {
      const installed = await installDependencies(webcontainer.value, id);
      if (!installed) return;
    }
    if (!isCurrentOperation(id)) return;
    await startProcesses(webcontainer.value, id);
  } catch (error) {
    if (isCurrentOperation(id)) {
      setOperationError(error);
      await cleanupRunningProcesses();
      if (!dependenciesInstalled.value) {
        discardWebContainer();
      }
    }
  } finally {
    finishOperation(id);
  }
}

async function reset() {
  if (isLifecycleLocked.value) return;
  const id = beginOperation({ invalidateWrites: true });
  previewUrl.value = '';
  clearPendingWrites();
  editableFiles.value = { ...artifact.files };
  activePath.value = 'src/js/v1/index.jsx';
  try {
    await stopRunningProcesses();
    if (!webcontainer.value) {
      finishOperation(id);
      await boot();
      return;
    }

    await webcontainer.value.mount(toFileSystemTree(editableFiles.value));
    if (!isCurrentOperation(id)) return;
    if (!dependenciesInstalled.value) {
      const installed = await installDependencies(webcontainer.value, id);
      if (!installed) return;
    }
    if (!isCurrentOperation(id)) return;
    await startProcesses(webcontainer.value, id);
  } catch (error) {
    if (isCurrentOperation(id)) {
      setOperationError(error);
      await cleanupRunningProcesses();
      if (!dependenciesInstalled.value) {
        discardWebContainer();
      }
    }
  } finally {
    finishOperation(id);
  }
}

function scheduleFileWrite(path: string, contents: string) {
  if (!webcontainer.value || isLifecycleLocked.value) return;
  const generation = writeGeneration;
  const existingTimer = writeTimers.get(path);
  if (existingTimer) window.clearTimeout(existingTimer);
  const timer = window.setTimeout(() => {
    writeTimers.delete(path);
    if (!webcontainer.value || generation !== writeGeneration) return;
    writeProjectFile(webcontainer.value, path, contents).catch((error) => {
      if (generation !== writeGeneration) return;
      appendLine('system', error instanceof Error ? error.message : String(error));
    });
  }, 250);
  writeTimers.set(path, timer);
}

function clearPendingWrites() {
  for (const timer of writeTimers.values()) {
    window.clearTimeout(timer);
  }
  writeTimers.clear();
}

async function cleanupRunningProcesses() {
  try {
    await stopRunningProcesses();
  } catch (error) {
    appendLine('system', error instanceof Error ? error.message : String(error));
  }
}

onMounted(() => {
  boot();
});

onBeforeUnmount(() => {
  operationId += 1;
  writeGeneration += 1;
  isTransitioning.value = false;
  clearPendingWrites();
  unsubscribeServerReady?.();
  unsubscribeServerReady = null;
  cleanupRunningProcesses();
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
        :disabled="isEditorDisabled"
      />
      <PreviewPane :url="previewUrl" :status-label="previewStatus" />
      <TerminalPane :lines="terminalLines" />
    </div>
  </div>
</template>
