import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useAllProgress, useAllReviewItems, useStreak} from '@site/src/hooks/useAppData';
import {isDueForReview} from '@site/src/utils/storage';
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
  {id: 'ch17', title: '17. 실생활 표현과 오류패턴'},
  {id: 'ch18', title: '18. 실용 글쓰기 가이드'},
];

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

function DashboardInner() {
  const {all} = useAllProgress();
  const {all: reviewAll} = useAllReviewItems();
  const {streak} = useStreak();
  const chapters = all.chapters || {};
  const reviewItems = Object.values(reviewAll.items || {});

  const completedCount = Object.keys(chapters).length;
  const now = Date.now();
  const dueItems = reviewItems.filter((item) => isDueForReview(item, now));

  const dueByChapter = {};
  for (const item of dueItems) {
    dueByChapter[item.chapter] = (dueByChapter[item.chapter] || 0) + 1;
  }
  const chaptersWithDue = CHAPTERS.filter((c) => dueByChapter[c.id]);

  return (
    <>
      <div className={styles.dashboardGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>🔥 {streak.current}</div>
          <div className={styles.statLabel}>연속 학습일 (최고 {streak.longest}일)</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{completedCount}/{CHAPTERS.length}</div>
          <div className={styles.statLabel}>학습 완료 챕터</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{dueItems.length}</div>
          <div className={styles.statLabel}>오늘 복습할 문제</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{reviewItems.length}</div>
          <div className={styles.statLabel}>복습 목록 전체 문제 수</div>
        </div>
      </div>

      <h2>🔔 오늘 복습할 문제가 있는 챕터</h2>
      {chaptersWithDue.length === 0 ? (
        <div className={styles.emptyState}>오늘 복습할 문제가 없습니다. 새 챕터를 진행해보세요.</div>
      ) : (
        <div className={styles.reviewList}>
          {chaptersWithDue.map((c) => (
            <div key={c.id} className={styles.reviewRow}>
              <span>
                <strong>{c.title}</strong> · {dueByChapter[c.id]}개 복습 대기
              </span>
              <Link className="button button--sm button--primary" to="/review">
                복습하러 가기
              </Link>
            </div>
          ))}
        </div>
      )}

      <h2>📚 전체 챕터 현황</h2>
      <div className={styles.reviewList}>
        {CHAPTERS.map((c) => {
          const entry = chapters[c.id];
          const status = entry ? `✅ 완료 (${formatDate(entry.completedAt)})` : '학습 전';
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
    <Layout title="학습 대시보드" description="챕터별 학습 진행과 오늘 복습할 문제를 확인합니다.">
      <main className="container margin-vert--lg">
        <h1>📊 학습 대시보드</h1>
        <p>챕터를 다 보면 "학습 완료"로 표시하세요. 복습 일정은 챕터가 아니라 문제 단위로 따로 관리됩니다 — 연습문제를 풀고 자기채점하면 자동으로 쌓입니다.</p>
        <BrowserOnly>{() => <DashboardInner />}</BrowserOnly>
      </main>
    </Layout>
  );
}
