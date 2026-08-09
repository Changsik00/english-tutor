import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const PRINCIPLES = [
  {icon: '🧭', title: '어순', desc: '한국어는 조사가 역할을 표시하지만, 영어는 위치가 역할을 결정합니다.'},
  {icon: '📡', title: '정보흐름', desc: '아는 정보에서 새로운 정보로. 문장이 왜 그 순서로 배열되는지 설명합니다.'},
  {icon: '🎯', title: '동사중심성', desc: '동사 하나가 문장의 형식·시제·태를 전부 결정합니다. 본동사부터 찾는 습관이 핵심입니다.'},
  {icon: '🗜️', title: '압축과 확장', desc: '절이 구로, 구가 단어로 압축되고 다시 펼쳐지는 원리로 준동사·분사구문을 이해합니다.'},
  {icon: '🎭', title: '심리적 거리', desc: '과거형·조동사 과거형이 시간이 아니라 화자의 심리적 거리를 나타내는 경우를 설명합니다.'},
];

const PARTS = [
  {
    label: 'Part 1: 기초 문법',
    desc: '문장의 기본 구조, 8품사, 문장 성분, 문장의 형식, 시제',
    to: '/docs/chapters/ch01',
  },
  {
    label: 'Part 2: 태와 준동사',
    desc: '수동태, 조동사, to부정사, 동명사, 분사',
    to: '/docs/chapters/ch05',
  },
  {
    label: 'Part 3: 품사 심화·연결어',
    desc: '관사·대명사·형용사·부사, 비교, 전치사, 접속사',
    to: '/docs/chapters/ch10',
  },
  {
    label: 'Part 4: 관계사·특수구문',
    desc: '관계사, 가정법, 강조·도치·일치 등 특수구문',
    to: '/docs/chapters/ch14',
  },
  {
    label: '실용',
    desc: '실생활 표현·오류 패턴, 업무 이메일과 글쓰기',
    to: '/docs/chapters/ch17',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/chapters/ch01">
            1장부터 시작하기 →
          </Link>
          <Link className="button button--outline button--lg" to="/units" style={{marginLeft: '0.75rem'}}>
            📖 전체 목차 보기
          </Link>
        </div>
      </div>
    </header>
  );
}

function PrinciplesSection() {
  return (
    <section className={styles.whySection}>
      <div className="container">
        <Heading as="h2" className={styles.partsHeading}>
          107개 규칙이 아니라 5개의 원리
        </Heading>
        <p className={styles.sectionLede}>
          영문법을 항목별로 따로 외우는 대신, 아래 5가지 원리로 꿰어서 이해합니다. 각 챕터의 "이 챕터와 관련된 원리" 섹션에서
          다시 만나게 됩니다.
        </p>
        <div className={styles.whyGrid}>
          {PRINCIPLES.map((p) => (
            <div key={p.title} className={styles.whyCard}>
              <div className={styles.whyIcon} aria-hidden="true">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaGrid}>
          <Link to="/docs/chapters/ch01" className={styles.ctaCard}>
            <span className={styles.ctaIcon}>🚀</span>
            <h3>처음이라면, 1장부터</h3>
            <p>기본 구조와 8품사부터 순서대로 시작하세요.</p>
          </Link>
          <Link to="/units" className={styles.ctaCard}>
            <span className={styles.ctaIcon}>📖</span>
            <h3>전체 목차 검색</h3>
            <p>107개 유닛을 한눈에 보고 원하는 항목으로 바로 이동하세요.</p>
          </Link>
          <Link to="/dashboard" className={styles.ctaCard}>
            <span className={styles.ctaIcon}>📊</span>
            <h3>학습 현황 보기</h3>
            <p>완료한 챕터와 오늘 복습할 항목을 확인하세요.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PartsSection() {
  return (
    <section className={styles.partsSection}>
      <div className="container">
        <Heading as="h2" className={styles.partsHeading}>
          목차
        </Heading>
        <div className={styles.partsGrid}>
          {PARTS.map((p) => (
            <Link key={p.label} to={p.to} className={styles.partCard}>
              <h3>{p.label}</h3>
              <p>{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="원리로 이해하는 영문법. 성인 재학습자를 위한 자체 제작 교재.">
      <HomepageHeader />
      <main>
        <PrinciplesSection />
        <PartsSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
