<script setup lang="ts">
defineProps<{
  files: string[];
  activePath: string;
}>();

const emit = defineEmits<{
  select: [path: string];
}>();
</script>

<template>
  <nav class="playground-file-tree" aria-label="Playground files">
    <button
      v-for="file in files"
      :key="file"
      class="playground-file"
      :class="{ 'is-active': file === activePath }"
      :aria-pressed="file === activePath"
      type="button"
      @click="emit('select', file)"
    >
      {{ file }}
    </button>
  </nav>
</template>
