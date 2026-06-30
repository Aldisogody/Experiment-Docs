<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { TerminalLine } from './types';

const props = defineProps<{
  lines: TerminalLine[];
  pendingBundle?: { fileName: string; contents: string } | null;
  bundleCopied?: boolean;
}>();

const emit = defineEmits<{
  copyBundle: [];
}>();

const outputRef = ref<HTMLPreElement | null>(null);

function formatLine(line: TerminalLine) {
  if (line.source === 'system') {
    return `[system] ${line.text}`;
  }

  return `[${line.source}] ${line.text}`;
}

async function scrollToBottom() {
  await nextTick();
  const output = outputRef.value;
  if (!output) return;
  output.scrollTop = output.scrollHeight;
}

watch(
  () => props.lines.length,
  () => {
    scrollToBottom();
  },
);
</script>

<template>
  <section class="playground-terminal" aria-label="Terminal">
    <div class="playground-terminal-header">
      <div class="playground-pane-heading">Terminal</div>
      <button
        v-if="pendingBundle"
        class="playground-copy-bundle"
        type="button"
        @click="emit('copyBundle')"
      >
        {{ bundleCopied ? 'Copied' : `Copy bundle (${pendingBundle.fileName})` }}
      </button>
    </div>
    <pre
      ref="outputRef"
      class="playground-terminal-output"
      :class="{ 'is-empty': lines.length === 0 }"
    ><template v-if="lines.length > 0"><template v-for="line in lines" :key="line.id">{{ formatLine(line) }}
</template></template><span v-else class="playground-empty">Sandbox logs will appear here.</span></pre>
  </section>
</template>
