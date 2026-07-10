import React from 'react';
import styles from './diagrams.module.css';

/**
 * 한국어 vs 영어의 어순을 나란히 비교하는 다이어그램.
 * korean / english: [{ text: '나는', highlight: false }, ...]
 */
export default function WordOrderCompare({title, korean, english, caption}) {
  return (
    <div className={styles.compareWrap}>
      {title && <div className={styles.compareTitle}>{title}</div>}
      <div className={styles.compareGrid}>
        <div className={styles.compareLangLabel}>한국어</div>
        <div className={styles.compareChunks}>
          {korean.map((c, i) => (
            <span key={i} className={styles.compareChunk} data-highlight={c.highlight ? 'true' : 'false'}>
              {c.text}
            </span>
          ))}
        </div>
        <div className={styles.compareLangLabel}>영어</div>
        <div className={styles.compareChunks}>
          {english.map((c, i) => (
            <span key={i} className={styles.compareChunk} data-highlight={c.highlight ? 'true' : 'false'}>
              {c.text}
            </span>
          ))}
        </div>
      </div>
      {caption && <div className={styles.patternTranslation}>{caption}</div>}
    </div>
  );
}
