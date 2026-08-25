<script lang="ts">
let nextRenderId = 0
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  source: string
}>()

const { isDark } = useData()
const svg = ref('')
const error = ref(false)
const loading = ref(true)

let renderGeneration = 0

function readToken(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

async function renderDiagram() {
  const generation = ++renderGeneration
  const currentId = `docs-mermaid-${++nextRenderId}`

  loading.value = svg.value.length === 0
  error.value = false

  try {
    const { default: mermaid } = await import('mermaid')

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme: 'base',
      fontFamily: "'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif",
      flowchart: {
        curve: 'linear',
        htmlLabels: false,
        padding: 16,
        useMaxWidth: true,
      },
      themeVariables: {
        background: readToken('--docs-diagram-surface', isDark.value ? '#1f2421' : '#f7faf8'),
        primaryColor: readToken('--docs-diagram-node', isDark.value ? '#243b31' : '#ffffff'),
        primaryTextColor: readToken('--vp-c-text-1', isDark.value ? '#f6f6f7' : '#242424'),
        primaryBorderColor: readToken('--vp-c-brand-1', isDark.value ? '#42d392' : '#18794e'),
        secondaryColor: readToken('--docs-diagram-node-accent', isDark.value ? '#173d2d' : '#eaf7f0'),
        secondaryTextColor: readToken('--vp-c-text-1', isDark.value ? '#f6f6f7' : '#242424'),
        secondaryBorderColor: readToken('--vp-c-brand-1', isDark.value ? '#42d392' : '#18794e'),
        tertiaryColor: readToken('--docs-diagram-node-muted', isDark.value ? '#292d2b' : '#f2f4f3'),
        tertiaryTextColor: readToken('--vp-c-text-1', isDark.value ? '#f6f6f7' : '#242424'),
        tertiaryBorderColor: readToken('--docs-diagram-border-strong', isDark.value ? '#65706a' : '#9aa49f'),
        lineColor: readToken('--docs-diagram-line', isDark.value ? '#a8b0ac' : '#66736d'),
        edgeLabelBackground: readToken('--docs-diagram-surface', isDark.value ? '#1f2421' : '#f7faf8'),
        clusterBkg: readToken('--docs-diagram-cluster', isDark.value ? '#202824' : '#f1f6f3'),
        clusterBorder: readToken('--docs-diagram-border', isDark.value ? '#45524c' : '#d8e1dc'),
        fontSize: '16px',
      },
    })

    const result = await mermaid.render(currentId, decodeURIComponent(props.source))
    if (generation !== renderGeneration) return

    svg.value = result.svg
    loading.value = false
  } catch {
    if (generation !== renderGeneration) return

    svg.value = ''
    loading.value = false
    error.value = true
  }
}

onMounted(renderDiagram)
watch(isDark, renderDiagram)
onBeforeUnmount(() => {
  renderGeneration += 1
})
</script>

<template>
  <figure class="docs-diagram" :aria-busy="loading">
    <p v-if="loading" class="docs-diagram__status" role="status">Rendering diagram…</p>
    <p v-else-if="error" class="docs-diagram__status docs-diagram__status--error" role="alert">
      <strong>Diagram unavailable.</strong> Read the surrounding explanation for this flow.
    </p>
    <div v-else class="docs-diagram__canvas" v-html="svg" />
  </figure>
</template>
