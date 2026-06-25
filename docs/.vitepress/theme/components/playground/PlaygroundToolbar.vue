<script setup lang="ts">
import type { PlaygroundStatus } from './types';

defineProps<{
  status: PlaygroundStatus;
  canReset: boolean;
  canRestart: boolean;
}>();

const emit = defineEmits<{
  reset: [];
  restart: [];
}>();
</script>

<template>
  <header class="playground-toolbar">
    <div>
      <p class="playground-kicker">Experiment playground</p>
      <h1>Run a generated create-experiment project in your browser</h1>
    </div>
    <div class="playground-actions">
      <span class="playground-status">{{ status }}</span>
      <button type="button" :disabled="!canRestart" @click="emit('restart')">Restart</button>
      <button type="button" :disabled="!canReset" @click="emit('reset')">Reset</button>
    </div>
  </header>
</template>
