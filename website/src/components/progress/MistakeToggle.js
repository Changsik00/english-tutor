import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useMistakeToggle} from '@site/src/hooks/useAppData';
import styles from './progress.module.css';

function MistakeToggleInner({id, chapter, chapterTitle, prompt}) {
  const {saved, toggle} = useMistakeToggle({id, chapter, chapterTitle, prompt, anchor: id});

  return (
    <button
      className={saved ? styles.mistakeBtnSaved : styles.mistakeBtn}
      onClick={toggle}
      id={id}
    >
      {saved ? '✅ 오답노트에 저장됨 (누르면 해제)' : '❌ 틀렸어요, 오답노트에 저장'}
    </button>
  );
}

/**
 * 연습문제/원리 적용 연습 문항 하나에 붙이는 오답 저장 토글 버튼.
 * id: 사이트 전체에서 고유해야 함 (예: "ch04-u023-q2")
 * chapter: 챕터 id (예: "ch04")
 * chapterTitle: 챕터 제목(오답노트 목록에 표시)
 * prompt: 문제 내용 짧은 요약(오답노트 목록에 표시, 40~60자 권장)
 */
export default function MistakeToggle({id, chapter, chapterTitle, prompt}) {
  return (
    <BrowserOnly fallback={<button className={styles.mistakeBtn} disabled>❌ 틀렸어요, 오답노트에 저장</button>}>
      {() => <MistakeToggleInner id={id} chapter={chapter} chapterTitle={chapterTitle} prompt={prompt} />}
    </BrowserOnly>
  );
}
