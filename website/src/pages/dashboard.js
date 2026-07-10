import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useAllProgress} from '@site/src/hooks/useAppData';
import {isDueForReview, REVIEW_STAGE_DAYS} from '@site/src/utils/storage';
import styles from '@site/src/components/progress/progress.module.css';

const CHAPTERS = [
  {id: 'ch01', title: '01. 기본 구조와 품사'},
  {id: 'ch02', title: '02. 문장의 종류'},
  {id: 'ch03', title: '03. 문장의 형식'},
  {id: 'ch04', title: '04. 시제'},
  {id: 'ch05', title: '05. 수동태'},
  {id: 'ch06', title: '06. 조동사'},
  {id: 'ch07', title: '07. to부정사'},
  {id: 'ch08', title: '08. 동명사'},
  {id: 'ch09', title: '09. 분사'},
  {id: 'ch10', title: '10. 관사·대명사·형용사·부사'},
  {id: 'ch11', title: '11. 비교'},
  {id: 'ch12', title: '12. 전치사'},
  {id: 'ch13', title: '13. 접속사'},
  {id: 'ch14', title: '14. 관계사'},
  {id: 'ch15', title: '15. 가정법'},
  {id: 'ch16', title: '16. 특수구문'},
];

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

function DashboardInner() {
  const {all} = useAllProgress();
  const chapters = all.chapters || {};

  const completedCount = Object.keys(chapters).length;
  const masteredCount = Object.values(chapters).filter((c) => c.mastered).length;
  const now = Date.now();
  const due = CHAPTERS.filter((c) => isDueForReview(chapters[c.id], now));

  return (
    <>
      <div className={styles.dashboardGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{completedCount}/{CHAPTERS.length}</div>
          <div className={styles.statLabel}>학습 완료 챕터</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{due.length}</div>
          <div className={styles.statLabel}>오늘 복습할 챕터</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{masteredCount}</div>
          <div className={styles.statLabel}>마스터한 챕터</div>
        </div>
      </div>

      <h2>🔔 오늘 복습할 챕터</h2>
      {due.length === 0 ? (
        <div className={styles.emptyState}>오늘 복습할 챕터가 없습니다. 새 챕터를 진행해보세요.</div>
      ) : (
        <div className={styles.reviewList}>
          {due.map((c) => {
            const entry = chapters[c.id];
            return (
              <div key={c.id} className={styles.reviewRow}>
                <span>
                  <strong>{c.title}</strong> · {REVIEW_STAGE_DAYS[entry.stage]}일 복습 주기
                </span>
                <Link className="button button--sm button--primary" to={`/docs/chapters/${c.id}`}>
                  복습하러 가기
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <h2>📚 전체 챕터 현황</h2>
      <div className={styles.reviewList}>
        {CHAPTERS.map((c) => {
          const entry = chapters[c.id];
          let status = '학습 전';
          if (entry?.mastered) status = '🏆 마스터';
          else if (entry) status = `✅ 완료 · 다음 복습 ${formatDate(entry.nextReviewAt)}`;
          return (
            <div key={c.id} className={styles.reviewRow}>
              <span>{c.title}</span>
              <span className={styles.mistakeMeta}>{status}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <Layout title="학습 대시보드" description="챕터별 학습 진행과 복습 주기를 확인합니다.">
      <main className="container margin-vert--lg">
        <h1>📊 학습 대시보드</h1>
        <p>챕터를 "학습 완료"로 표시하면 1일 → 3일 → 7일 → 30일 주기로 복습 시점을 자동으로 알려드립니다.</p>
        <BrowserOnly>{() => <DashboardInner />}</BrowserOnly>
      </main>
    </Layout>
  );
}
