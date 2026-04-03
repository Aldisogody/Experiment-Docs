import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Create Experiment',
  description: 'Scaffold Adobe Target A/B experiments with Vite + Preact',
  lastUpdated: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: '',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap',
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started/' },
          { text: 'Development', link: '/development/' },
        ],
      },
      { text: 'Framework API', link: '/framework-api/' },
      {
        text: 'Tooling',
        items: [
          { text: 'Linting & Formatting', link: '/linting/' },
          { text: 'E2E Testing (Optional)', link: '/e2e-testing/' },
        ],
      },
      { text: 'Reference', link: '/reference/' },
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Overview', link: '/getting-started/' },
            {
              text: 'Quick Start',
              link: '/getting-started/quick-start',
              // badge: { type: 'tip', text: 'Start here' },
            },
            { text: 'Prerequisites', link: '/getting-started/prerequisites' },
            { text: 'Installation', link: '/getting-started/installation' },
            {
              text: 'Project Structure',
              link: '/getting-started/project-structure',
            },
          ],
        },
      ],
      '/development/': [
        {
          text: 'Development',
          items: [
            { text: 'Dev Loop Overview', link: '/development/' },
            { text: 'Watch Mode & Clipboard', link: '/development/watch-mode' },
            { text: 'Variations', link: '/development/variations' },
            { text: 'Configuration', link: '/development/config' },
            { text: 'Templates', link: '/development/templates' },
          ],
        },
      ],
      '/framework-api/': [
        {
          text: 'Framework API',
          items: [
            { text: 'Overview', link: '/framework-api/' },
            { text: 'runScript()', link: '/framework-api/run-script' },
            { text: 'waitFor() & watchFor()', link: '/framework-api/wait-for' },
            { text: 'Tracking', link: '/framework-api/tracking' },
          ],
        },
      ],
      '/linting/': [
        {
          text: 'Linting & Formatting',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/linting/' },
            { text: 'Biome Rules', link: '/linting/biome-rules' },
            { text: 'Stylelint (SCSS)', link: '/linting/stylelint' },
            { text: 'Editor Setup', link: '/linting/editor-setup' },
          ],
        },
      ],
      '/e2e-testing/': [
        {
          text: 'E2E Testing',
          collapsed: true,
          items: [
            {
              text: 'Overview',
              link: '/e2e-testing/',
              // badge: { type: 'info', text: 'Optional' },
            },
            { text: 'Setup', link: '/e2e-testing/setup' },
            { text: 'Writing Tests', link: '/e2e-testing/writing-tests' },
            { text: 'Markets', link: '/e2e-testing/markets' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Overview', link: '/reference/' },
            { text: 'CLI Prompts', link: '/reference/cli-prompts' },
            {
              text: 'Generated Commands',
              link: '/reference/generated-commands',
            },
            { text: 'Markets', link: '/reference/markets' },
          ],
        },
        {
          text: 'Project',
          items: [
            { text: 'Migration Guide', link: '/reference/migration' },
            { text: 'Changelog', link: '/reference/changelog' },
            { text: 'Contributing', link: '/reference/contributing' },
          ],
        },
      ],
    },

    editLink: {
      pattern:
        'https://github.com/andi-sogody/experiment-framework-v2/edit/main/v2-framework/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/andi-sogody/experiment-framework-v2',
      },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Internal tool — Samsung / Sogody experimentation team',
    },
  },
});
