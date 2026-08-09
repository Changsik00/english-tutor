import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import clsx from 'clsx';
import {useReviewItem} from '@site/src/hooks/useAppData';
import {REVIEW_STAGE_DAYS} from '@site/src/utils/storage';
import styles from './progress.module.css';

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const GRADES = [
  {key: 'again', label: '🔴 다시', className: 'gradeAgain'},
  {key: 'unsure', label: '🟡 헷갈림', className: 'gradeUnsure'},
  {key: 'good', label: '🟢 기억남', className: 'gradeGood'},
];

function ReviewCheckInner({id, chapter, chapterTitle, prompt, anchor}) {
  const meta = {id, chapter, chapterTitle, prompt, anchor: anchor || id};
  const {item, grade} = useReviewItem(meta);
  const [justGraduated, setJustGraduated] = React.useState(false);

  const handleGrade = (g) => {
    const {graduated} = grade(g);
    setJustGraduated(graduated);
  };

  return (
    <div className={styles.reviewCheckBox}>
      <span className={styles.reviewCheckLabel}>정답을 다시 떠올려봤다면, 얼마나 기억하고 있었나요?</span>
      <div className={styles.gradeRow}>
        {GRADES.map((g) => (
          <button
            key={g.key}
            className={clsx(styles.gradeBtn, styles[g.className], item?.lastGrade === g.key && styles.gradeBtnActive)}
            onClick={() => handleGrade(g.key)}
          >
            {g.label}
          </button>
        ))}
      </div>
      {justGraduated ? (
        <span className={styles.masteredLabel}>🎓 4단계를 모두 통과해 복습 목록에서 졸업했습니다!</span>
      ) : item ? (
        <span className={styles.mistakeMeta}>
          다음 복습: {formatDate(item.nextReviewAt)} ({REVIEW_STAGE_DAYS[item.stage]}일 주기)
        </span>
      ) : null}
    </div>
  );
}

/**
 * 연습문제 하나에 붙이는 능동회상 자기채점 위젯.
 * id: 사이트 전체에서 고유해야 함 (예: "ch01-u001-q1")
 * chapter: 챕터 id (예: "ch01")
 * chapterTitle: 챕터 제목(복습 페이지 목록에 표시)
 * prompt: 문제 내용 짧은 요약(복습 페이지 목록에 표시, 40~60자 권장)
 * anchor: 문서 내 이동 앵커(생략 시 id 사용)
 */
export default function ReviewCheck({id, chapter, chapterTitle, prompt, anchor}) {
  return (
    <BrowserOnly fallback={<div className={styles.reviewCheckBox} />}>
      {() => (
        <ReviewCheckInner id={id} chapter={chapter} chapterTitle={chapterTitle} prompt={prompt} anchor={anchor} />
      )}
    </BrowserOnly>
  );
}
