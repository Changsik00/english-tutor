import React from 'react';
import styles from './nuance.module.css';

function IntensityDots({level}) {
  const dots = [1, 2, 3, 4, 5].map((i) => (
    <span key={i} className={i <= level ? styles.dotFilled : styles.dotEmpty}>
      ●
    </span>
  ));
  return (
    <span className={styles.intensity} title={`강도 ${level}/5`}>
      {dots}
    </span>
  );
}

/**
 * 하나의 한국어 개념(예: "바보 같은")에 대응하는 영어 단어 묶음을
 * 품사·발음·강도·용도(뉘앙스) 표로 보여준다.
 */
export default function NuanceCluster({cluster}) {
  if (!cluster) return null;
  return (
    <div className={styles.cluster}>
      <div className={styles.clusterHeader}>
        <h3 className={styles.clusterConcept}>🇰🇷 {cluster.koreanConcept}</h3>
        <span className={styles.clusterCategory}>{cluster.category}</span>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>단어</th>
              <th>품사</th>
              <th>발음</th>
              <th>정도</th>
              <th>용도·뉘앙스 / 예문</th>
            </tr>
          </thead>
          <tbody>
            {cluster.entries.map((e) => (
              <tr key={e.word}>
                <td className={styles.word}>{e.word}</td>
                <td>
                  <span className={styles.pos}>{e.pos}</span>
                </td>
                <td className={styles.pron}>
                  <span className={styles.ipa}>{e.ipa}</span>
                  <span className={styles.kor}>{e.korPron}</span>
                </td>
                <td>
                  <IntensityDots level={e.intensity} />
                </td>
                <td>
                  <span className={styles.register}>{e.register}</span>
                  <p className={styles.nuance}>{e.nuance}</p>
                  <p className={styles.example}>{e.exampleEn}</p>
                  <p className={styles.exampleKo}>{e.exampleKo}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
