import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './brand.css'
import './home.css'
import './nav.css'
import './sidebar.css'

export default {
  extends: DefaultTheme,
} satisfies Theme
