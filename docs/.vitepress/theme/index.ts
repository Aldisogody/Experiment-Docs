import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CopyEmail from './CopyEmail.vue'
import './brand.css'
import './home.css'
import './nav.css'
import './sidebar.css'
import './team.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CopyEmail', CopyEmail)
  },
} satisfies Theme
