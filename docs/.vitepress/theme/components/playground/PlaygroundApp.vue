<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import seed from '../../playground/generated-seed.json';
import CodeEditor from './CodeEditor.vue';
import FileTree from './FileTree.vue';
import PlaygroundToolbar from './PlaygroundToolbar.vue';
import TerminalPane from './TerminalPane.vue';
import type { PlaygroundStatus, SeedArtifact, TerminalLine } from './types';
import { stopProcess, toFileSystemTree, writeProjectFile } from './webcontainer';

const playgroundComponents = {
  CodeEditor,
  FileTree,
  PlaygroundToolbar,
  TerminalPane,
};
void playgroundComponents;

const artifact = seed as SeedArtifact;
const editableFiles = ref<Record<string, string>>({ ...artifact.files });
const activePath = ref('src/js/v1/index.jsx');
const status = ref<PlaygroundStatus>('idle');
const errorMessage = ref('');
const terminalLines = ref<TerminalLine[]>([]);
const webcontainer = ref<WebContainer | null>(null);
const installProcess = ref<WebContainerProcess | null>(null);
const devProcess = ref<WebContainerProcess | null>(null);
const buildProcess = ref<WebContainerProcess | null>(null);
const isTransitioning = ref(false);
const dependenciesInstalled = ref(false);
const pendingBundle = ref<{ fileName: string; contents: string } | null>(null);
const bundleCopied = ref(false);
let bundleCopiedTimer: number | undefined;
let autoCopyTimer: number | undefined;
let lineId = 0;
let operationId = 0;
let writeGeneration = 0;
const writeTimers = new Map<string, number>();
const autoCopyDelayMs = 1000;
const sandboxBuildEnv = {
  EXP_BUILD_SKIP_LINT: '1',
  CI: '1',
  FORCE_COLOR: '0',
};

const _files = computed(() => Object.keys(editableFiles.value).sort());
const _activeContents = computed({
  get: () => editableFiles.value[activePath.value] ?? '',
  set: (value: string) => {
    editableFiles.value = { ...editableFiles.value, [activePath.value]: value };
    scheduleFileWrite(activePath.value, value);
  },
});

const isLifecycleLocked = computed(
  () =>
    isTransitioning.value ||
    status.value === 'booting' ||
    status.value === 'installing' ||
    status.value === 'building' ||
    status.value === 'starting',
);
const _canReset = computed(() => !isLifecycleLocked.value);
const _canRestart = computed(() => Boolean(webcontainer.value) && !isLifecycleLocked.value);
const _isEditorDisabled = computed(() => isLifecycleLocked.value);

function appendLine(source: TerminalLine['source'], text: string) {
  for (const line of text.split('\n')) {
    if (line.trim().length === 0) continue;
    lineId++;
    terminalLines.value.push({ id: lineId, source, text: line });
  }
}

function pipeProcessOutput(process: WebContainerProcess, source: TerminalLine['source']) {
  process.output
    .pipeTo(
      new WritableStream({
        write(data) {
          appendLine(source, data);
        },
      }),
    )
    .catch((error) => {
      if (error instanceof Error && error.name === 'AbortError') return;
      appendLine('system', error instanceof Error ? error.message : String(error));
    });
}

function beginOperation(options: { invalidateWrites?: boolean } = {}) {
  isTransitioning.value = true;
  operationId++;
  if (options.invalidateWrites) {
    writeGeneration++;
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
  if (buildProcess.value === process) buildProcess.value = null;
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
  appendLine('system', 'Installing sandbox dependencies...');
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

async function runBuild(instance: WebContainer, id: number, message = 'Building the initial bundle...') {
  if (!isCurrentOperation(id)) return false;
  status.value = 'building';
  appendLine('system', message);
  const process = await instance.spawn('npm', ['run', 'build'], { env: sandboxBuildEnv });
  buildProcess.value = process;
  pipeProcessOutput(process, 'build');
  if (!isCurrentOperation(id)) {
    await stopStartedProcesses([process]);
    return false;
  }
  const exitCode = await process.exit;
  clearProcessRef(process);
  if (!isCurrentOperation(id)) return false;
  if (exitCode !== 0) throw new Error(`Bundle build exited with code ${exitCode}.`);
  pendingBundle.value = await readGeneratedBundle(instance);
  return true;
}

async function startProcesses(instance: WebContainer, id: number) {
  if (!isCurrentOperation(id)) return;

  const built = await runBuild(instance, id);
  if (!built || !isCurrentOperation(id)) return;

  status.value = 'starting';
  appendLine('system', 'Starting generated watch process...');
  const dev = await instance.spawn('npm', ['run', 'dev'], { env: sandboxBuildEnv });
  devProcess.value = dev;
  pipeProcessOutput(dev, 'dev');
  if (!isCurrentOperation(id)) {
    await stopStartedProcesses([dev]);
    return;
  }

  appendLine('system', 'Sandbox watch process is running.');
  status.value = 'ready';
}

async function readGeneratedBundle(instance: WebContainer) {
  const fileName = 'v1-index.jsx';
  const contents = await instance.fs.readFile(`dist/${fileName}`, 'utf-8');
  return { fileName, contents };
}

async function writeClipboardText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    return copied;
  }
}

async function flushPendingFileWrites() {
  if (!webcontainer.value || writeTimers.size === 0) return;

  const instance = webcontainer.value;
  const generation = writeGeneration;
  const pendingPaths = [...writeTimers.keys()];
  for (const path of pendingPaths) {
    const timer = writeTimers.get(path);
    if (timer) window.clearTimeout(timer);
    writeTimers.delete(path);
  }

  await Promise.all(
    pendingPaths.map((path) => writeProjectFile(instance, path, editableFiles.value[path] ?? '')),
  );

  if (generation !== writeGeneration) {
    throw new Error('Editor changed while preparing the bundle. Try copying again.');
  }
}

async function buildPendingBundleForCopy(message: string) {
  if (!webcontainer.value || isLifecycleLocked.value) return false;

  const id = beginOperation();
  let built = false;
  try {
    errorMessage.value = '';
    pendingBundle.value = null;
    await flushPendingFileWrites();
    built = await runBuild(webcontainer.value, id, message);
    return built;
  } catch (error) {
    if (isCurrentOperation(id)) {
      pendingBundle.value = null;
      setOperationError(error);
    }
    return false;
  } finally {
    if (built && isCurrentOperation(id)) {
      status.value = 'ready';
    }
    finishOperation(id);
  }
}

async function copyBundleContents(options: { automatic: boolean }) {
  if (!pendingBundle.value) {
    appendLine('system', 'No generated bundle is ready yet.');
    return;
  }

  const { fileName, contents } = pendingBundle.value;
  const copied = await writeClipboardText(contents);
  if (copied) {
    bundleCopied.value = true;
    window.clearTimeout(bundleCopiedTimer);
    bundleCopiedTimer = window.setTimeout(() => {
      bundleCopied.value = false;
    }, 2000);
    appendLine(
      'system',
      options.automatic
        ? `Latest bundle copied automatically to browser clipboard (${fileName}).`
        : `Latest bundle copied to browser clipboard (${fileName}).`,
    );
    return;
  }

  appendLine(
    'system',
    options.automatic
      ? 'Automatic clipboard copy was blocked by the browser. Use Copy bundle to copy manually.'
      : 'Could not copy bundle to clipboard.',
  );
}

async function autoCopyBundle() {
  const built = await buildPendingBundleForCopy('Building latest bundle...');
  if (!built) return;
  await copyBundleContents({ automatic: true });
}

async function copyPendingBundle() {
  clearScheduledAutoCopy();
  const built = await buildPendingBundleForCopy('Building latest bundle...');
  if (!built) return;
  await copyBundleContents({ automatic: false });
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
  pendingBundle.value = null;
  dependenciesInstalled.value = false;
  appendLine('system', 'Booting WebContainer sandbox...');

  try {
    const { WebContainer } = await import('@webcontainer/api');
    if (!isCurrentOperation(id)) return;
    const instance = await WebContainer.boot();
    if (!isCurrentOperation(id)) {
      discardWebContainer(instance);
      return;
    }
    webcontainer.value = instance;
    await instance.mount(toFileSystemTree(editableFiles.value, artifact.binaryFiles));
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
  const results = await Promise.allSettled([
    stopProcess(installProcess.value),
    stopProcess(devProcess.value),
    stopProcess(buildProcess.value),
  ]);
  installProcess.value = null;
  devProcess.value = null;
  buildProcess.value = null;
  const failedStop = results.find((result) => result.status === 'rejected');
  if (failedStop?.status === 'rejected') throw failedStop.reason;
}

async function _restart() {
  if (!webcontainer.value || isLifecycleLocked.value) return;
  const id = beginOperation();
  clearScheduledAutoCopy();
  pendingBundle.value = null;
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

async function _reset() {
  if (isLifecycleLocked.value) return;
  const id = beginOperation({ invalidateWrites: true });
  clearScheduledAutoCopy();
  pendingBundle.value = null;
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

    await webcontainer.value.mount(toFileSystemTree(editableFiles.value, artifact.binaryFiles));
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
  pendingBundle.value = null;
  bundleCopied.value = false;
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
  scheduleAutoCopyBundle(generation);
}

function scheduleAutoCopyBundle(generation: number) {
  if (!webcontainer.value || isLifecycleLocked.value) return;
  window.clearTimeout(autoCopyTimer);
  autoCopyTimer = window.setTimeout(() => {
    if (generation !== writeGeneration) return;
    autoCopyTimer = undefined;
    autoCopyBundle();
  }, autoCopyDelayMs);
}

function clearScheduledAutoCopy() {
  window.clearTimeout(autoCopyTimer);
  autoCopyTimer = undefined;
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
  operationId++;
  writeGeneration++;
  isTransitioning.value = false;
  clearPendingWrites();
  clearScheduledAutoCopy();
  window.clearTimeout(bundleCopiedTimer);
  cleanupRunningProcesses();
});
</script>

<template>
  <div class="playground-shell">
    <PlaygroundToolbar
      :status="status"
      :can-reset="_canReset"
      :can-restart="_canRestart"
      @reset="_reset"
      @restart="_restart"
    />

    <div v-if="status === 'error'" class="playground-error" role="alert">
      {{ errorMessage }}
    </div>

    <div class="playground-grid">
      <FileTree :files="_files" :active-path="activePath" @select="activePath = $event" />
      <CodeEditor
        v-model="_activeContents"
        :path="activePath"
        :disabled="_isEditorDisabled"
      />
      <TerminalPane
        :lines="terminalLines"
        :pending-bundle="pendingBundle"
        :bundle-copied="bundleCopied"
        @copy-bundle="copyPendingBundle"
      />
    </div>
  </div>
</template>
