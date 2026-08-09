import React from 'react';
import vocabulary from '@site/src/data/vocabulary.json';
import styles from './vocab.module.css';

/**
 * 문법 패턴에 연동된 단어 목록을 유닛 안에 인라인으로 삽입한다.
 * 예: <VocabList pattern="전치사 없이 완결되는 자동사" />
 */
export default function VocabList({pattern}) {
  const items = vocabulary.filter((v) => v.pattern === pattern);

  if (items.length === 0) {
    return <p className={styles.empty}>"{pattern}" 패턴에 등록된 단어가 아직 없습니다.</p>;
  }

  return (
    <>
      <span className={styles.patternPill}>🗂 {pattern}</span>
      <div className={styles.grid}>
        {items.map((v) => (
          <div key={v.id} className={styles.card}>
            <div className={styles.wordRow}>
              <span className={styles.word}>{v.word}</span>
              <span className={styles.pos}>{v.pos}</span>
            </div>
            <p className={styles.meaning}>{v.meaningKo}</p>
            <p className={styles.example}>{v.exampleEn}</p>
            <p className={styles.exampleKo}>{v.exampleKo}</p>
          </div>
        ))}
      </div>
    </>
  );
}
