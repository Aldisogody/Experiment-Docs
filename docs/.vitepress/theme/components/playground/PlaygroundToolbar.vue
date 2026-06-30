<script setup lang="ts">
import type { PlaygroundStatus } from './types';

defineProps<{
  status: PlaygroundStatus;
  canReset: boolean;
  canRestart: boolean;
}>();

defineEmits<{
  reset: [];
  restart: [];
}>();
</script>

<template>
  <header class="playground-toolbar">
    <div>
      <p class="playground-kicker">Experiment playground</p>
      <h1>Edit a sandboxed create-experiment project</h1>
    </div>
    <div class="playground-actions">
      <button type="button" :disabled="!canRestart" @click="$emit('restart')">Restart</button>
      <button type="button" :disabled="!canReset" @click="$emit('reset')">Reset</button>
      <span class="playground-status">{{ status }}</span>
    </div>
  </header>
</template>
