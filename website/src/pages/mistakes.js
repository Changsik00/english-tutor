import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useAllMistakes} from '@site/src/hooks/useAppData';
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

function MistakeRow({item, remove, markReviewed}) {
  const [justGraduated, setJustGraduated] = useState(false);
  const due = isDueForReview(item);

  const handleReview = () => {
    const {graduated} = markReviewed(item.id);
    if (graduated) setJustGraduated(true);
  };

  if (justGraduated) {
    return (
      <div className={styles.mistakeRow}>
        <span className={styles.masteredLabel}>🎓 졸업! 오답노트에서 제거되었습니다.</span>
      </div>
    );
  }

  return (
    <div className={styles.mistakeRow}>
      <div>
        <div>{item.prompt}</div>
        <div className={styles.mistakeMeta}>
          저장일: {formatDateTime(item.addedAt)}
          {' · '}
          {due ? (
            <span className={styles.dueLabel}>🔔 오늘 복습 ({REVIEW_STAGE_DAYS[item.stage]}일 주기)</span>
          ) : (
            <>다음 복습: {formatDateTime(item.nextReviewAt)}</>
          )}
        </div>
      </div>
      <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
        <Link className="button button--sm button--secondary" to={`/docs/chapters/${item.chapter}#${item.anchor}`}>
          문제로 이동
        </Link>
        {due && (
          <button className="button button--sm button--primary" onClick={handleReview}>
            복습 완료
          </button>
        )}
        <button className="button button--sm button--outline button--danger" onClick={() => remove(item.id)}>
          이해했어요, 삭제
        </button>
      </div>
    </div>
  );
}

function MistakesInner() {
  const {all, remove, markReviewed} = useAllMistakes();
  const items = all.items || {};
  const itemList = Object.values(items);
  const total = itemList.length;
  const dueItems = itemList.filter((i) => isDueForReview(i));
  const groups = groupByChapter(items);
  const chapterIds = Object.keys(groups).sort();

  if (total === 0) {
    return (
      <div className={styles.emptyState}>
        아직 저장된 오답이 없습니다. 연습문제를 풀다가 틀린 문제가 있으면 정답 확인 후 "틀렸어요" 버튼을 눌러보세요.
      </div>
    );
  }

  return (
    <>
      <p>
        총 <strong>{total}개</strong>의 문제가 저장되어 있습니다. 챕터와 마찬가지로 1→3→7→30일 주기로 복습하면
        자동으로 "졸업"되어 목록에서 사라집니다.
      </p>

      <h2>🔔 오늘 복습할 오답 ({dueItems.length}개)</h2>
      {dueItems.length === 0 ? (
        <div className={styles.emptyState}>오늘 복습할 오답이 없습니다.</div>
      ) : (
        <div className={styles.mistakeList}>
          {dueItems.map((item) => (
            <MistakeRow key={item.id} item={item} remove={remove} markReviewed={markReviewed} />
          ))}
        </div>
      )}

      <h2>📚 챕터별 전체 오답노트</h2>
      {chapterIds.map((chapterId) => {
        const group = groups[chapterId];
        return (
          <div key={chapterId}>
            <h3>{group.chapterTitle || chapterId}</h3>
            <div className={styles.mistakeList}>
              {group.items
                .sort((a, b) => b.addedAt - a.addedAt)
                .map((item) => (
                  <MistakeRow key={item.id} item={item} remove={remove} markReviewed={markReviewed} />
                ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function Mistakes() {
  return (
    <Layout title="오답노트" description="틀린 문제를 모아서 복습주기에 맞춰 다시 복습합니다.">
      <main className="container margin-vert--lg">
        <h1>📝 오답노트</h1>
        <BrowserOnly>{() => <MistakesInner />}</BrowserOnly>
      </main>
    </Layout>
  );
}
