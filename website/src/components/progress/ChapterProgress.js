import React, {useEffect} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import {useChapterProgress, useAllReviewItems} from '@site/src/hooks/useAppData';
import {recordActivity, isDueForReview} from '@site/src/utils/storage';
import styles from './progress.module.css';

function ChapterProgressInner({chapterId}) {
  const {entry, markComplete, reset} = useChapterProgress(chapterId);
  const {all} = useAllReviewItems();

  useEffect(() => {
    recordActivity();
  }, []);

  const dueCount = Object.values(all.items || {}).filter(
    (item) => item.chapter === chapterId && isDueForReview(item),
  ).length;

  return (
    <div className={styles.progressBox}>
      {entry ? (
        <>
          <span>✅ 학습 완료</span>
          <button className={styles.textBtn} onClick={reset}>
            취소
          </button>
        </>
      ) : (
        <>
          <span>이 챕터를 다 보셨나요?</span>
          <button className={styles.primaryBtn} onClick={markComplete}>
            ✅ 학습 완료로 표시
          </button>
        </>
      )}
      {dueCount > 0 && (
        <span className={styles.dueLabel}>
          🔔 이 챕터에 오늘 복습할 문제 {dueCount}개 —{' '}
          <Link to="/review">복습하러 가기</Link>
        </span>
      )}
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
