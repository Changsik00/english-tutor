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
        {points.map((p, i) => {
          // 양 끝(10% 이하/90% 이상)에 가까운 지점은 중앙 정렬(translateX(-50%))을 쓰면
          // 남은 공간이 거의 없어 라벨이 세로로 깨진다. 끝에 가까울수록 그쪽으로 정렬을 붙여
          // 텍스트가 안쪽으로만 자라게 한다.
          const align = p.pos <= 15 ? 'Start' : p.pos >= 85 ? 'End' : 'Center';
          return (
            <div
              key={i}
              className={`${styles.scalePoint} ${styles[`scalePoint${align}`]}`}
              style={{left: `${p.pos}%`}}
            >
              <span>{p.label}</span>
              <div className={styles.scalePointMark} />
            </div>
          );
        })}
      </div>
      <div className={styles.scaleEnds}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
