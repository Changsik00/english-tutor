import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import verbs from '@site/src/data/verbPatterns.json';
import VerbModal from '@site/src/components/verb/VerbModal';
import styles from '@site/src/components/verb/verb.module.css';
import unitsStyles from './units.module.css';

function groupByCategory(list) {
  const byCategory = new Map();
  for (const item of list) {
    if (!byCategory.has(item.category)) byCategory.set(item.category, []);
    byCategory.get(item.category).push(item);
  }
  return byCategory;
}

export default function VerbPatternDictionary() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return verbs;
    return verbs.filter(
      (item) =>
        item.verb.toLowerCase().includes(q) ||
        item.meaningKo.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.patterns.some((p) => p.structure.toLowerCase().includes(q))
    );
  }, [query]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);
  const activeItem = verbs.find((item) => item.id === activeId) || null;

  return (
    <Layout
      title="동사 패턴 사전"
      description="동사마다 목적어를 몇 개 요구하는지, 전치사가 필요한지 아닌지를 정리한 동사 구조 사전입니다."
    >
      <main className="container margin-vert--lg">
        <h1>🔧 동사 패턴 사전</h1>
        <p>
          "동사가 3형식인지 4형식인지", "목적어 앞에 전치사가 있어야 하는지 없어야 하는지"는
          동사를 통째로 외우지 않으면 계속 헷갈립니다. 이 사전은 고빈도 동사 {verbs.length}개를
          골라 각 동사가 요구하는 문장 구조(패턴)를 예문과 함께 정리했습니다. explain처럼 4형식이
          불가능한 동사, ask처럼 여러 패턴을 가진 동사, discuss처럼 전치사가 필요 없는 동사, listen처럼
          전치사가 반드시 필요한 동사를 구분해서 모아두었습니다. 카드를 클릭하면 상세 패턴과 흔한
          실수가 열립니다.
        </p>
        <input
          className={unitsStyles.searchInput}
          type="text"
          placeholder="예: explain, discuss, listen, 자동사..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {filtered.length === 0 && <p className={unitsStyles.empty}>검색 결과가 없습니다.</p>}

        {[...grouped.entries()].map(([category, categoryItems]) => (
          <div key={category} className={unitsStyles.partBlock}>
            <h2>{category}</h2>
            <div className={styles.indexGrid}>
              {categoryItems.map((item) => (
                <button
                  key={item.id}
                  className={styles.indexCard}
                  onClick={() => setActiveId(item.id)}
                >
                  <div className={styles.indexCardTop}>
                    <span className={styles.indexVerb}>{item.verb}</span>
                    <span className={styles.indexMeaning}>{item.meaningKo}</span>
                  </div>
                  <p className={styles.indexPreview}>
                    {item.patterns.map((p) => p.structure).join(' / ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}

        <VerbModal item={activeItem} onClose={() => setActiveId(null)} />
      </main>
    </Layout>
  );
}
