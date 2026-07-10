import React from 'react';
import styles from './diagrams.module.css';

/**
 * 시제를 과거-현재-미래 축 위에 표시하는 타임라인.
 * points: [{ pos: 0~100, label: '과거' }]  (pos: 축 위 위치 %)
 * ranges: [{ from: 0, to: 40, label: '경험' }] (구간을 강조하고 싶을 때)
 */
export default function TenseTimeline({title, points = [], ranges = [], caption}) {
  return (
    <div className={styles.timelineWrap}>
      {title && <div className={styles.timelineTitle}>{title}</div>}
      <div className={styles.timelineTrack}>
        {ranges.map((r, i) => (
          <div
            key={i}
            className={styles.timelineRange}
            style={{left: `${r.from}%`, width: `${r.to - r.from}%`}}
            title={r.label}
          />
        ))}
        {points.map((p, i) => (
          <div key={i} className={styles.timelinePoint} style={{left: `${p.pos}%`}}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineLabel}>{p.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.timelineAxisLabels}>
        <span>← 과거</span>
        <span>현재</span>
        <span>미래 →</span>
      </div>
      {caption && <div className={styles.timelineCaption}>{caption}</div>}
    </div>
  );
}
