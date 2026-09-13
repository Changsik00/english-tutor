// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Part 1: 기초 문법',
      collapsed: false,
      items: [
        'chapters/ch01',
        'chapters/ch02',
        'chapters/ch03',
        'chapters/ch04',
      ],
    },
    {
      type: 'category',
      label: 'Part 2: 태와 준동사',
      items: [
        'chapters/ch05',
        'chapters/ch06',
        'chapters/ch07',
        'chapters/ch08',
        'chapters/ch09',
      ],
    },
    {
      type: 'category',
      label: 'Part 3: 품사 심화·연결어',
      items: [
        'chapters/ch10',
        'chapters/ch11',
        'chapters/ch12',
        'chapters/ch13',
      ],
    },
    {
      type: 'category',
      label: 'Part 4: 관계사·특수구문',
      items: [
        'chapters/ch14',
        'chapters/ch15',
        'chapters/ch16',
      ],
    },
    {
      type: 'category',
      label: '실용',
      items: [
        'chapters/ch17',
        'chapters/ch18',
      ],
    },
    'glossary',
    {
      type: 'category',
      label: '학습 전략 (원리)',
      items: [
        'reading-strategy',
        'writing-strategy',
        'word-formation',
        'verb-principle',
      ],
    },
    {
      type: 'category',
      label: '구문실전연습 (챕터별 문제은행)',
      items: [
        'syntax-practice/overview',
        'syntax-practice/ch01',
        'syntax-practice/ch02',
        'syntax-practice/ch03',
        'syntax-practice/ch04',
        'syntax-practice/ch05',
        'syntax-practice/ch06',
        'syntax-practice/ch07',
        'syntax-practice/ch08',
        'syntax-practice/ch09',
        'syntax-practice/ch10',
        'syntax-practice/ch11',
        'syntax-practice/ch12',
        'syntax-practice/ch13',
        'syntax-practice/ch14',
      ],
    },
  ],
};

export default sidebars;
