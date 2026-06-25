<script setup lang="ts">
defineProps<{
  url: string;
  statusLabel: string;
}>();
</script>

<template>
  <section class="playground-preview" aria-label="Preview">
    <div class="playground-pane-heading">Preview · {{ statusLabel }}</div>
    <iframe v-if="url" class="playground-preview-frame" :src="url" title="Experiment preview" />
    <div v-else class="playground-empty">Preview will appear after the playground starts.</div>
  </section>
</template>
