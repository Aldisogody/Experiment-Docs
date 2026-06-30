import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CopyEmail from './CopyEmail.vue'
import PlaygroundApp from './components/playground/PlaygroundApp.vue'
import './brand.css'
import './home.css'
import './nav.css'
import './playground.css'
import './sidebar.css'
import './team.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CopyEmail', CopyEmail)
    app.component('PlaygroundApp', PlaygroundApp)
  },
} satisfies Theme
