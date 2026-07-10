import React from 'react';
import styles from './diagrams.module.css';

/**
 * 문장 형식(1~5형식)을 색깔 박스로 보여주는 다이어그램.
 * parts: [{ label: 'S', text: 'She', role: 's' }, { label: 'V', text: 'gave', role: 'v' }, ...]
 * role은 's' | 'v' | 'o' | 'c' | 'io' | 'do' | 'oc' 중 하나로, 박스 색상을 결정합니다.
 */
export default function SentencePattern({title, parts, translation}) {
  return (
    <div className={styles.patternWrap}>
      {title && <div className={styles.patternTitle}>{title}</div>}
      <div className={styles.patternRow}>
        {parts.map((p, i) => (
          <div key={i} className={`${styles.box} ${styles[`role-${p.role}`]}`}>
            <div className={styles.boxLabel}>{p.label}</div>
            <div className={styles.boxText}>{p.text}</div>
          </div>
        ))}
      </div>
      {translation && <div className={styles.patternTranslation}>{translation}</div>}
    </div>
  );
}
