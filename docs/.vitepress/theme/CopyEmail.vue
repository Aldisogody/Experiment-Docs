<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  email: string
}>()

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(props.email)
  } catch {
    const input = document.createElement('textarea')
    input.value = props.email
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    input.remove()
  }

  copied.value = true
  window.clearTimeout(resetTimer)
  resetTimer = window.setTimeout(() => {
    copied.value = false
  }, 2000)
}

onBeforeUnmount(() => {
  window.clearTimeout(resetTimer)
})
</script>

<template>
  <div class="team-email">
    <a :href="`mailto:${email}`">{{ email }}</a>
    <button
      class="team-email-copy"
      type="button"
      :aria-label="copied ? `${email} copied` : `Copy ${email}`"
      :title="copied ? 'Copied' : 'Copy email'"
      @click="copyEmail"
    >
      <svg v-if="copied" aria-hidden="true" viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6" />
      </svg>
      <svg v-else aria-hidden="true" viewBox="0 0 24 24">
        <rect x="9" y="9" width="10" height="10" rx="2" />
        <path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      </svg>
    </button>
    <span class="team-email-status" aria-live="polite">
      {{ copied ? 'Email copied to clipboard' : '' }}
    </span>
  </div>
</template>
