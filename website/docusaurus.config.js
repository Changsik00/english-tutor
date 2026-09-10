// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '영문법 기초 완성 노트',
  tagline: '원리로 이해하는 영문법, 성인 재학습자를 위한 자체 제작 교재',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://changsik00.github.io',
  baseUrl: '/english-tutor/',

  organizationName: 'Changsik00',
  projectName: 'english-tutor',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: ['en', 'ko'],
        indexDocs: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
      }),
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Changsik00/english-tutor/tree/main/website/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          // 기본 admonition 키워드(tip/info/warning 등)에 커스텀 콜아웃 3종을 추가.
          // design.md '콜아웃 5종' 참고.
          admonitions: {
            keywords: ['definition', 'myth', 'principle'],
            extendDefaults: true,
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '영문법 기초 완성 노트',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: '📚 교재',
          },
          {to: '/units', label: '📖 전체 목차', position: 'left'},
          {
            type: 'dropdown',
            label: '🗂 사전',
            position: 'left',
            items: [
              {to: '/vocabulary', label: '🗂 단어장 (패턴별 어휘)'},
              {to: '/nuance', label: '🎭 뉘앙스 사전'},
              {to: '/affixes', label: '🧩 접사 사전'},
              {to: '/verbs', label: '🔧 동사 패턴 사전'},
            ],
          },
          {to: '/dashboard', label: '📊 대시보드', position: 'left'},
          {to: '/review', label: '🔁 복습', position: 'left'},
          {
            href: 'https://github.com/Changsik00/english-tutor',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '교재',
            items: [
              {label: '1장부터 시작', to: '/docs/chapters/ch01'},
              {label: '전체 목차', to: '/units'},
              {label: '용어사전', to: '/docs/glossary'},
            ],
          },
          {
            title: '학습 전략 (원리)',
            items: [
              {label: '독해원리', to: '/docs/reading-strategy'},
              {label: '영작문 원리', to: '/docs/writing-strategy'},
              {label: '조어원리', to: '/docs/word-formation'},
              {label: '동사원리', to: '/docs/verb-principle'},
            ],
          },
          {
            title: '사전',
            items: [
              {label: '단어장', to: '/vocabulary'},
              {label: '뉘앙스 사전', to: '/nuance'},
              {label: '접사 사전', to: '/affixes'},
              {label: '동사 패턴 사전', to: '/verbs'},
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'GitHub', href: 'https://github.com/Changsik00/english-tutor'},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} 영문법 기초 완성 노트`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
