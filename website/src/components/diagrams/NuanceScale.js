import React from 'react';
import styles from './diagrams.module.css';

/**
 * 뉘앙스/강도를 스펙트럼 바 위에 표시 (예: 조동사의 확신 강도, 가정법의 심리적 거리).
 * points: [{ pos: 10, label: 'can (가능성 낮음)' }, { pos: 90, label: 'must (강한 확신)' }]
 */
export default function NuanceScale({title, leftLabel, rightLabel, points = []}) {
  return (
    <div className={styles.scaleWrap}>
      {title && <div className={styles.scaleTitle}>{title}</div>}
      <div className={styles.scaleBar}>
        {points.map((p, i) => (
          <div key={i} className={styles.scalePoint} style={{left: `${p.pos}%`}}>
            <span>{p.label}</span>
            <div className={styles.scalePointMark} />
          </div>
        ))}
      </div>
      <div className={styles.scaleEnds}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
