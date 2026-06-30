<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type * as Monaco from 'monaco-editor';

const props = defineProps<{
  path: string;
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

type MonacoApi = typeof Monaco;
type MonacoEditor = Monaco.editor.IStandaloneCodeEditor;
type MonacoModel = Monaco.editor.ITextModel;
type MonacoDisposable = Monaco.IDisposable;
type MonacoWorkerModule = { default: new () => Worker };

const editorHostRef = ref<HTMLElement | null>(null);

let monaco: MonacoApi | null = null;
let editor: MonacoEditor | null = null;
let model: MonacoModel | null = null;
let contentListener: MonacoDisposable | null = null;
let resizeObserver: ResizeObserver | null = null;
let isUnmounted = false;
let isApplyingExternalUpdate = false;

const fileName = computed(() => props.path.split('/').pop() ?? props.path);
const extension = computed(() => {
  const parts = fileName.value.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() ?? '' : '';
});
const languageId = computed(() => getLanguageId(props.path));
const languageLabel = computed(() => {
  switch (languageId.value) {
    case 'javascript':
      return extension.value === 'jsx' ? 'JavaScript JSX' : 'JavaScript';
    case 'scss':
      return 'SCSS';
    case 'css':
      return 'CSS';
    case 'json':
      return 'JSON';
    case 'markdown':
      return 'Markdown';
    case 'html':
      return 'HTML';
    default:
      return 'Plain text';
  }
});
const fileKindClass = computed(() => {
  switch (extension.value) {
    case 'js':
    case 'jsx':
      return 'is-javascript';
    case 'json':
      return 'is-json';
    case 'md':
      return 'is-markdown';
    case 'scss':
    case 'css':
      return 'is-stylesheet';
    case 'html':
      return 'is-html';
    default:
      return 'is-file';
  }
});

watch(
  () => props.modelValue,
  (value) => {
    if (!model || value === model.getValue()) return;
    isApplyingExternalUpdate = true;
    try {
      model.setValue(value);
    } finally {
      isApplyingExternalUpdate = false;
    }
  },
);

watch(
  () => props.path,
  () => {
    replaceModel();
  },
);

watch(
  () => props.disabled,
  (disabled) => {
    editor?.updateOptions({
      domReadOnly: Boolean(disabled),
      readOnly: Boolean(disabled),
    });
  },
);

onMounted(async () => {
  await installMonacoWorkers();
  monaco = await import('monaco-editor');

  if (isUnmounted || !editorHostRef.value || !monaco) return;

  editor = monaco.editor.create(editorHostRef.value, {
    automaticLayout: false,
    domReadOnly: Boolean(props.disabled),
    fixedOverflowWidgets: true,
    fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontLigatures: false,
    fontSize: 13,
    lineHeight: 20,
    minimap: { enabled: false },
    model: null,
    overviewRulerLanes: 0,
    readOnly: Boolean(props.disabled),
    renderLineHighlight: 'line',
    renderWhitespace: 'selection',
    scrollBeyondLastLine: false,
    scrollbar: {
      alwaysConsumeMouseWheel: false,
      horizontalScrollbarSize: 10,
      verticalScrollbarSize: 10,
    },
    tabSize: 2,
    theme: 'vs-dark',
    wordWrap: 'off',
    ariaLabel: `Code editor for ${props.path}`,
  });

  contentListener = editor.onDidChangeModelContent(() => {
    const value = model?.getValue();
    if (isApplyingExternalUpdate || value === undefined) return;
    emit('update:modelValue', value);
  });

  replaceModel();

  resizeObserver = new ResizeObserver(() => {
    editor?.layout();
  });
  resizeObserver.observe(editorHostRef.value);
  await nextTick();
  editor.layout();
});

onBeforeUnmount(() => {
  isUnmounted = true;
  resizeObserver?.disconnect();
  resizeObserver = null;
  contentListener?.dispose();
  contentListener = null;
  editor?.dispose();
  editor = null;
  model?.dispose();
  model = null;
});

async function installMonacoWorkers() {
  const [
    editorWorker,
    typescriptWorker,
    cssWorker,
    jsonWorker,
    htmlWorker,
  ] = (await Promise.all([
    import('monaco-editor/esm/vs/editor/editor.worker?worker'),
    import('monaco-editor/esm/vs/language/typescript/ts.worker?worker'),
    import('monaco-editor/esm/vs/language/css/css.worker?worker'),
    import('monaco-editor/esm/vs/language/json/json.worker?worker'),
    import('monaco-editor/esm/vs/language/html/html.worker?worker'),
  ])) as MonacoWorkerModule[];

  const workerScope = self as typeof self & {
    MonacoEnvironment?: {
      getWorker: (_workerId: string, label: string) => Worker;
    };
  };

  workerScope.MonacoEnvironment = {
    getWorker(_workerId, label) {
      if (label === 'typescript' || label === 'javascript') {
        return new typescriptWorker.default();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker.default();
      }
      if (label === 'json') {
        return new jsonWorker.default();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker.default();
      }
      return new editorWorker.default();
    },
  };
}

function replaceModel() {
  if (!monaco || !editor) return;

  const previousModel = model;
  model = monaco.editor.createModel(props.modelValue, languageId.value, createModelUri(props.path));
  editor.setModel(model);
  editor.updateOptions({ ariaLabel: `Code editor for ${props.path}` });
  previousModel?.dispose();
}

function createModelUri(path: string) {
  if (!monaco) throw new Error('Monaco has not been initialized.');
  return monaco.Uri.from({
    scheme: 'file',
    path: path.startsWith('/') ? path : `/${path}`,
  });
}

function getLanguageId(path: string) {
  const extension = path.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'json':
      return 'json';
    case 'scss':
      return 'scss';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
}
</script>

<template>
  <section class="playground-editor" :class="{ 'is-readonly': disabled }" aria-label="Code editor">
    <div class="playground-editor-tabs">
      <div class="playground-editor-tab" :class="fileKindClass">
        <span class="playground-editor-file-dot" aria-hidden="true" />
        <span class="playground-editor-file-name">{{ fileName }}</span>
        <span class="playground-editor-file-path">{{ path }}</span>
      </div>
      <div class="playground-editor-state" aria-live="polite">
        {{ disabled ? 'Read only' : 'Editing' }}
      </div>
    </div>

    <div class="playground-editor-body">
      <div
        ref="editorHostRef"
        class="playground-monaco-editor"
        :aria-label="`Code editor for ${path}`"
        :data-language="languageLabel"
      />
    </div>
  </section>
</template>
