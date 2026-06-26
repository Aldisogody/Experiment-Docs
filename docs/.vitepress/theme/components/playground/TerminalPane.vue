<script setup lang="ts">
import type { TerminalLine } from './types';

defineProps<{
	lines: TerminalLine[];
}>();
</script>

<template>
  <section class="playground-terminal" aria-label="Terminal output">
    <div class="playground-pane-heading">Terminal</div>
    <pre class="playground-terminal-output"><template v-for="line in lines" :key="line.id">[{{ line.source }}] {{ line.text }}
</template></pre>
  </section>
</template>
