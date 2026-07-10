import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

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
        </div>
      </div>
    </header>
  );
}

function WhySection() {
  return (
    <section className={styles.whySection}>
      <div className="container">
        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>
            <h3>💡 원리로 이해</h3>
            <p>107개 문법 규칙을 따로 외우지 않고, 어순·정보흐름·압축 같은 몇 가지 핵심 원리로 꿰어서 이해합니다.</p>
          </div>
          <div className={styles.whyCard}>
            <h3>📝 예문 중심</h3>
            <p>모든 유닛에 실생활·직장 소재의 예문을 풍부하게 실어서, 규칙이 아니라 문장으로 감을 익힙니다.</p>
          </div>
          <div className={styles.whyCard}>
            <h3>🔍 이해 확인</h3>
            <p>시험 형식이 아니라, 문제를 풀어보고 바로 "왜 그런지" 원리로 설명을 확인하는 방식입니다.</p>
          </div>
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
        <WhySection />
        <PartsSection />
      </main>
    </Layout>
  );
}
