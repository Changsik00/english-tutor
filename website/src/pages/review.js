import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useAllReviewItems} from '@site/src/hooks/useAppData';
import {isDueForReview, REVIEW_STAGE_DAYS} from '@site/src/utils/storage';
import styles from '@site/src/components/progress/progress.module.css';

function formatDateTime(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

function groupByChapter(items) {
  const groups = {};
  for (const item of Object.values(items)) {
    if (!groups[item.chapter]) {
      groups[item.chapter] = {chapterTitle: item.chapterTitle, items: []};
    }
    groups[item.chapter].items.push(item);
  }
  return groups;
}

function ReviewRow({item, remove}) {
  const due = isDueForReview(item);
  return (
    <div className={styles.mistakeRow}>
      <div>
        <div>{item.prompt}</div>
        <div className={styles.mistakeMeta}>
          {due ? (
            <span className={styles.dueLabel}>🔔 오늘 복습 ({REVIEW_STAGE_DAYS[item.stage]}일 주기)</span>
          ) : (
            <>다음 복습: {formatDateTime(item.nextReviewAt)}</>
          )}
        </div>
      </div>
      <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
        <Link className="button button--sm button--primary" to={`/docs/chapters/${item.chapter}#${item.anchor}`}>
          문제 다시 풀어보기
        </Link>
        <button className="button button--sm button--outline button--danger" onClick={() => remove(item.id)}>
          목록에서 삭제
        </button>
      </div>
    </div>
  );
}

function ReviewInner() {
  const {all, remove} = useAllReviewItems();
  const items = all.items || {};
  const itemList = Object.values(items);
  const total = itemList.length;
  const dueItems = itemList.filter((i) => isDueForReview(i)).sort((a, b) => a.nextReviewAt - b.nextReviewAt);
  const groups = groupByChapter(items);
  const chapterIds = Object.keys(groups).sort();

  if (total === 0) {
    return (
      <div className={styles.emptyState}>
        아직 복습 목록에 담긴 문제가 없습니다. 챕터의 연습문제 정답을 확인한 뒤, 다시 떠올려보고 "다시 / 헷갈림 /
        기억남" 중 하나를 눌러보세요.
      </div>
    );
  }

  return (
    <>
      <p>
        총 <strong>{total}개</strong>의 문제가 복습 목록에 있습니다. "기억남"을 계속 선택하면 1→3→7→30일 간격으로
        점점 뜸하게 노출되다가, 마지막 단계를 통과하면 자동으로 졸업(제거)됩니다.
      </p>

      <h2>🔔 오늘의 복습 큐 ({dueItems.length}개)</h2>
      {dueItems.length === 0 ? (
        <div className={styles.emptyState}>오늘 복습할 문제가 없습니다.</div>
      ) : (
        <div className={styles.mistakeList}>
          {dueItems.map((item) => (
            <ReviewRow key={item.id} item={item} remove={remove} />
          ))}
        </div>
      )}

      <h2>📚 전체 복습 목록</h2>
      {chapterIds.map((chapterId) => {
        const group = groups[chapterId];
        return (
          <div key={chapterId}>
            <h3>{group.chapterTitle || chapterId}</h3>
            <div className={styles.mistakeList}>
              {group.items
                .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
                .map((item) => (
                  <ReviewRow key={item.id} item={item} remove={remove} />
                ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function Review() {
  return (
    <Layout title="오늘의 복습" description="능동회상 방식으로 문제를 다시 풀어보고 스스로 채점합니다.">
      <main className="container margin-vert--lg">
        <h1>🔁 오늘의 복습</h1>
        <BrowserOnly>{() => <ReviewInner />}</BrowserOnly>
      </main>
    </Layout>
  );
}
