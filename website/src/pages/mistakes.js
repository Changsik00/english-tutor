import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useAllMistakes} from '@site/src/hooks/useAppData';
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

function MistakesInner() {
  const {all, remove} = useAllMistakes();
  const items = all.items || {};
  const groups = groupByChapter(items);
  const chapterIds = Object.keys(groups).sort();
  const total = Object.keys(items).length;

  if (total === 0) {
    return (
      <div className={styles.emptyState}>
        아직 저장된 오답이 없습니다. 연습문제를 풀다가 틀린 문제가 있으면 정답 확인 후 "틀렸어요" 버튼을 눌러보세요.
      </div>
    );
  }

  return (
    <>
      <p>총 <strong>{total}개</strong>의 문제가 저장되어 있습니다. 다시 이해했다면 목록에서 지워보세요.</p>
      {chapterIds.map((chapterId) => {
        const group = groups[chapterId];
        return (
          <div key={chapterId}>
            <h2>{group.chapterTitle || chapterId}</h2>
            <div className={styles.mistakeList}>
              {group.items
                .sort((a, b) => b.addedAt - a.addedAt)
                .map((item) => (
                  <div key={item.id} className={styles.mistakeRow}>
                    <div>
                      <div>{item.prompt}</div>
                      <div className={styles.mistakeMeta}>저장일: {formatDateTime(item.addedAt)}</div>
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <Link
                        className="button button--sm button--secondary"
                        to={`/docs/chapters/${item.chapter}#${item.anchor}`}>
                        문제로 이동
                      </Link>
                      <button
                        className="button button--sm button--outline button--danger"
                        onClick={() => remove(item.id)}>
                        이해했어요, 삭제
                      </button>
                    </div>
                  </div>
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
    <Layout title="오답노트" description="틀린 문제를 모아서 다시 복습합니다.">
      <main className="container margin-vert--lg">
        <h1>📝 오답노트</h1>
        <BrowserOnly>{() => <MistakesInner />}</BrowserOnly>
      </main>
    </Layout>
  );
}
