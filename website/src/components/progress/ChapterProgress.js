import React, {useEffect} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useChapterProgress} from '@site/src/hooks/useAppData';
import {REVIEW_STAGE_DAYS, recordActivity} from '@site/src/utils/storage';
import styles from './progress.module.css';

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function ChapterProgressInner({chapterId}) {
  const {entry, markComplete, markReviewed, reset, isDue} = useChapterProgress(chapterId);

  useEffect(() => {
    recordActivity();
  }, []);

  if (!entry) {
    return (
      <div className={styles.progressBox}>
        <span>이 챕터를 다 보셨나요?</span>
        <button className={styles.primaryBtn} onClick={markComplete}>
          ✅ 학습 완료로 표시
        </button>
      </div>
    );
  }

  if (entry.mastered) {
    return (
      <div className={styles.progressBox}>
        <span className={styles.masteredLabel}>🏆 복습 4단계를 모두 마쳤습니다 (마스터)</span>
        <button className={styles.textBtn} onClick={reset}>
          다시 학습하기
        </button>
      </div>
    );
  }

  const stageLabel = `${REVIEW_STAGE_DAYS[entry.stage]}일 복습 주기 (${entry.stage + 1}/${REVIEW_STAGE_DAYS.length}단계)`;

  return (
    <div className={styles.progressBox}>
      {isDue ? (
        <>
          <span className={styles.dueLabel}>🔔 오늘 복습할 차례입니다! ({stageLabel})</span>
          <button className={styles.primaryBtn} onClick={markReviewed}>
            복습 완료
          </button>
        </>
      ) : (
        <span>
          ✅ 학습 완료 · 다음 복습: <strong>{formatDate(entry.nextReviewAt)}</strong> ({stageLabel})
        </span>
      )}
      <button className={styles.textBtn} onClick={reset}>
        초기화
      </button>
    </div>
  );
}

export default function ChapterProgress({chapterId}) {
  return (
    <BrowserOnly fallback={<div className={styles.progressBox} />}>
      {() => <ChapterProgressInner chapterId={chapterId} />}
    </BrowserOnly>
  );
}
