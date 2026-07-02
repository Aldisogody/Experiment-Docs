import { defineConfig } from 'vitepress';

const ECOSYSTEM_LINKS = {
  samlinksV2: 'https://samlinks2.vercel.app/',
} as const;

const webcontainerHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
} as const;

function applyWebcontainerHeaders(_req: unknown, res: { setHeader: (name: string, value: string) => void }, next: () => void) {
  for (const [name, value] of Object.entries(webcontainerHeaders)) {
    res.setHeader(name, value);
  }
  next();
}

const webcontainerHeadersPlugin = {
  name: 'webcontainer-headers',
  configureServer(server: { middlewares: { use: (handler: typeof applyWebcontainerHeaders) => void } }) {
    server.middlewares.use(applyWebcontainerHeaders);
  },
  configurePreviewServer(server: { middlewares: { use: (handler: typeof applyWebcontainerHeaders) => void } }) {
    server.middlewares.use(applyWebcontainerHeaders);
  },
};

const docsSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Introduction', link: '/getting-started/' },
      { text: 'Quick Start', link: '/getting-started/quick-start' },
      { text: 'Prerequisites', link: '/getting-started/prerequisites' },
      { text: 'Installation', link: '/getting-started/installation' },
      {
        text: 'Project Structure',
        link: '/getting-started/project-structure',
      },
    ],
  },
  {
    text: 'Essentials',
    items: [
      { text: 'Build an Experiment', link: '/build-an-experiment' },
      { text: 'Variations', link: '/development/variations' },
      { text: 'Watch Mode & Clipboard', link: '/development/watch-mode' },
      { text: 'Configuration', link: '/development/config' },
      { text: 'Examples', link: '/examples' },
      { text: 'Playground', link: '/playground' },
    ],
  },
  {
    text: 'Development',
    items: [
      { text: 'Dev Loop Overview', link: '/development/' },
      { text: 'Scaffold Template', link: '/development/templates' },
      {
        text: 'AI Project Support',
        link: '/development/ai-project-support',
      },
    ],
  },
  {
    text: 'Framework API',
    items: [
      { text: 'Overview', link: '/framework-api/' },
      { text: 'runScript()', link: '/framework-api/run-script' },
      { text: 'mountExperiment()', link: '/framework-api/mount-experiment' },
      { text: 'waitFor() & watchFor()', link: '/framework-api/wait-for' },
      { text: 'Tracking', link: '/framework-api/tracking' },
      { text: 'Path & Market', link: '/framework-api/path-and-market' },
      { text: 'Logging & Debugging', link: '/framework-api/logging' },
    ],
  },
  {
    text: 'Best Practices',
    items: [
      { text: 'Run and Ship', link: '/run-and-ship' },
      { text: 'Testing Overview', link: '/testing' },
      { text: 'Linting & Formatting', link: '/linting/' },
      { text: 'Biome Rules', link: '/linting/biome-rules' },
      { text: 'Styling (SCSS Modules)', link: '/linting/stylelint' },
      { text: 'Editor Setup', link: '/linting/editor-setup' },
      { text: 'E2E Testing', link: '/e2e-testing/' },
      { text: 'E2E Setup', link: '/e2e-testing/setup' },
      { text: 'Writing Tests', link: '/e2e-testing/writing-tests' },
      { text: 'E2E Markets', link: '/e2e-testing/markets' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Reference Overview', link: '/reference/' },
      { text: 'CLI Prompts', link: '/reference/cli-prompts' },
      { text: 'Generated Commands', link: '/reference/generated-commands' },
      { text: 'Markets', link: '/reference/markets' },
      { text: 'Error Reference', link: '/error-reference' },
      {
        text: 'Migration Guide',
        link: '/reference/migration',
      },
      { text: 'Changelog', link: '/reference/changelog' },
      { text: 'Contributing', link: '/reference/contributing' },
    ],
  },
  {
    text: 'About',
    items: [
      { text: 'FAQ', link: '/faq' },
      { text: 'Team', link: '/team' },
      { text: 'Releases', link: '/releases' },
    ],
  },
];

export default defineConfig({
  title: 'Experiment Docs',
  description: 'Scaffold Adobe Target A/B experiments with Vite + Preact',
  lastUpdated: true,
  vite: {
    plugins: [webcontainerHeadersPlugin],
    server: {
      headers: webcontainerHeaders,
    },
    preview: {
      headers: webcontainerHeaders,
    },
  },

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
      {
        text: 'Docs',
        activeMatch:
          '^/(start-here|build-an-experiment|run-and-ship|testing|guide|tutorial|examples|error-reference|playground|getting-started|development|framework-api|linting|e2e-testing|reference)',
        items: [
          { text: 'Getting Started', link: '/getting-started/' },
          { text: 'Essentials', link: '/build-an-experiment' },
          { text: 'Development', link: '/development/' },
          { text: 'Framework API', link: '/framework-api/' },
          { text: 'Best Practices', link: '/run-and-ship' },
          { text: 'Reference', link: '/reference/' },
        ],
      },
      {
        text: 'Ecosystem',
        items: [
          {
            text: 'Resources',
            items: [
              {
                text: 'Samlinks v2',
                link: ECOSYSTEM_LINKS.samlinksV2,
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            ],
          },
        ],
      },
      {
        text: 'About',
        activeMatch: '^/(faq|team|releases)',
        items: [
          { text: 'FAQ', link: '/faq' },
          { text: 'Team', link: '/team' },
          { text: 'Releases', link: '/releases' },
        ],
      },
    ],

    sidebar: docsSidebar,

    editLink: {
      pattern:
        'https://github.com/Aldisogody/v2-docs-for-devs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Aldisogody/v2-docs-for-devs',
      },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Internal tool - Samsung / Sogody experimentation team',
    },
  },
});
