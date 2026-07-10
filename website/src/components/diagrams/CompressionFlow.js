import React from 'react';
import styles from './diagrams.module.css';

/**
 * 긴 절이 압축되는 과정을 화살표 흐름으로 보여주는 다이어그램.
 * steps: ['The man who lives next door', 'The man living next door']
 */
export default function CompressionFlow({title, steps = [], note}) {
  return (
    <div className={styles.flowWrap}>
      {title && <div className={styles.flowTitle}>{title}</div>}
      <div className={styles.flowRow}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={styles.flowStep}>{s}</div>
            {i < steps.length - 1 && <span className={styles.flowArrow}>→</span>}
          </React.Fragment>
        ))}
      </div>
      {note && <div className={styles.flowNote}>{note}</div>}
    </div>
  );
}
