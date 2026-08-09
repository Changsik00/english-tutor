import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import vocabulary from '@site/src/data/vocabulary.json';
import vocabStyles from '@site/src/components/vocab/vocab.module.css';
import styles from './units.module.css';

function groupByPattern(list) {
  const byPattern = new Map();
  for (const v of list) {
    if (!byPattern.has(v.pattern)) byPattern.set(v.pattern, []);
    byPattern.get(v.pattern).push(v);
  }
  return byPattern;
}

export default function Vocabulary() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vocabulary;
    return vocabulary.filter(
      (v) =>
        v.word.toLowerCase().includes(q) ||
        v.meaningKo.includes(q) ||
        v.pattern.toLowerCase().includes(q) ||
        v.pos.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => groupByPattern(filtered), [filtered]);

  return (
    <Layout title="단어장" description="문법 패턴에 연동된 단어를 검색합니다.">
      <main className="container margin-vert--lg">
        <h1>🗂 단어장</h1>
        <p>
          단순 단어 암기 목록이 아니라, "전치사 없이 완결되는 자동사"처럼 <strong>문법 패턴에 실제로 연동된 단어</strong>를
          모아둔 곳입니다. 각 챕터 본문에서도 관련 유닛에 같은 목록이 인라인으로 등장합니다.
        </p>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="예: happen, 자동사, 불가산명사..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {filtered.length === 0 && <p className={styles.empty}>검색 결과가 없습니다.</p>}

        {[...grouped.entries()].map(([pattern, items]) => (
          <div key={pattern} className={styles.partBlock}>
            <h2>
              🗂 {pattern}{' '}
              {items[0]?.chapter && (
                <Link
                  to={`/docs/chapters/${items[0].chapter}#unit-${items[0].unit}`}
                  style={{fontSize: '0.85rem', fontWeight: 400}}
                >
                  (관련 유닛 보기 →)
                </Link>
              )}
            </h2>
            <div className={vocabStyles.grid}>
              {items.map((v) => (
                <div key={v.id} className={vocabStyles.card}>
                  <div className={vocabStyles.wordRow}>
                    <span className={vocabStyles.word}>{v.word}</span>
                    <span className={vocabStyles.pos}>{v.pos}</span>
                  </div>
                  <p className={vocabStyles.meaning}>{v.meaningKo}</p>
                  <p className={vocabStyles.example}>{v.exampleEn}</p>
                  <p className={vocabStyles.exampleKo}>{v.exampleKo}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </Layout>
  );
}
