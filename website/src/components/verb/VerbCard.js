import React from 'react';
import styles from './verb.module.css';

export default function VerbCard({item}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.verbName}>{item.verb}</h3>
        <span className={styles.meaning}>{item.meaningKo}</span>
        <span className={styles.categoryBadge}>{item.category}</span>
      </div>

      {item.patterns.map((p) => (
        <div key={p.label + p.structure} className={styles.patternBlock}>
          <div className={styles.patternHead}>
            <span className={styles.patternLabel}>{p.label}</span>
            <span className={styles.patternStructure}>{p.structure}</span>
          </div>
          <blockquote className={styles.example}>
            <p>{p.exampleEn}</p>
            <p>{p.exampleKo}</p>
          </blockquote>
        </div>
      ))}

      {item.note && <p className={styles.note}>💡 {item.note}</p>}

      {item.commonMistake && (
        <div className={styles.mistakeBox}>
          <p className={styles.mistakeLabel}>❌ 흔한 실수</p>
          <p className={styles.wrong}>{item.commonMistake.wrong}</p>
          <p className={styles.right}>✅ {item.commonMistake.right}</p>
          {item.commonMistake.note && <p className={styles.mistakeNote}>{item.commonMistake.note}</p>}
        </div>
      )}

      {item.relatedVerbs && item.relatedVerbs.length > 0 && (
        <p className={styles.related}>비교해보기: {item.relatedVerbs.join(', ')}</p>
      )}
    </div>
  );
}
