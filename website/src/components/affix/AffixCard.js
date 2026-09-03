import React from 'react';
import styles from './affix.module.css';

export default function AffixCard({item}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.affixName}>{item.affix}</h3>
        <span className={styles.typeBadge}>{item.type === 'prefix' ? '접두사' : '접미사'}</span>
        <span className={item.posChange ? styles.posBadgeChange : styles.posBadgeSame}>
          {item.posChange ? `${item.posFrom} → ${item.posTo}` : `${item.posFrom} (품사 유지)`}
        </span>
      </div>

      <p className={styles.meaning}>{item.meaningKo}</p>
      {item.note && <p className={styles.note}>💡 {item.note}</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>원어</th>
              <th>파생어</th>
              <th>뜻</th>
            </tr>
          </thead>
          <tbody>
            {item.words.map((w) => (
              <tr key={w.derived}>
                <td className={styles.base}>{w.base}</td>
                <td className={styles.derived}>{w.derived}</td>
                <td>{w.meaningKo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {item.exampleEn && (
        <blockquote className={styles.example}>
          <p>{item.exampleEn}</p>
          <p>{item.exampleKo}</p>
        </blockquote>
      )}
    </div>
  );
}
