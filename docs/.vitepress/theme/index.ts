import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import CopyEmail from './CopyEmail.vue'
import FrameworkFeedback from './FrameworkFeedback.vue'
import MermaidDiagram from './MermaidDiagram.vue'
import MountPositionDiagram from './MountPositionDiagram.vue'
import PlaygroundApp from './components/playground/PlaygroundApp.vue'
import './brand.css'
import './diagrams.css'
import './feedback.css'
import './home.css'
import './nav.css'
import './playground.css'
import './sidebar.css'
import './team.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(FrameworkFeedback),
    }),
  enhanceApp({ app }) {
    app.component('CopyEmail', CopyEmail)
    app.component('MermaidDiagram', MermaidDiagram)
    app.component('MountPositionDiagram', MountPositionDiagram)
    app.component('PlaygroundApp', PlaygroundApp)
  },
} satisfies Theme
