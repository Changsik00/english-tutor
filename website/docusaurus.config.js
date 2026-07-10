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
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Changsik00/english-tutor/tree/main/website/',
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
            label: '교재',
          },
          {to: '/dashboard', label: '📊 대시보드', position: 'left'},
          {to: '/mistakes', label: '📝 오답노트', position: 'left'},
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
              {label: '용어사전', to: '/docs/glossary'},
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
