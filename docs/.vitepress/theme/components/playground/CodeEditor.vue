<script setup lang="ts">
defineProps<{
  path: string;
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <section class="playground-editor" aria-label="Code editor">
    <div class="playground-pane-heading">{{ path }}</div>
    <textarea
      class="playground-code"
      spellcheck="false"
      :disabled="disabled"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </section>
</template>
