import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clusters from '@site/src/data/nuanceClusters.json';
import NuanceModal from '@site/src/components/nuance/NuanceModal';
import styles from '@site/src/components/nuance/nuance.module.css';
import unitsStyles from './units.module.css';

function groupByCategory(list) {
  const byCategory = new Map();
  for (const c of list) {
    if (!byCategory.has(c.category)) byCategory.set(c.category, []);
    byCategory.get(c.category).push(c);
  }
  return byCategory;
}

export default function NuanceDictionary() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clusters;
    return clusters.filter(
      (c) =>
        c.koreanConcept.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.entries.some((e) => e.word.toLowerCase().includes(q) || e.nuance.toLowerCase().includes(q))
    );
  }, [query]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);
  const totalWords = clusters.reduce((sum, c) => sum + c.entries.length, 0);
  const activeCluster = clusters.find((c) => c.id === activeId) || null;

  return (
    <Layout
      title="뉘앙스 사전"
      description="한국어로는 비슷해 보이지만 영어로는 품사·강도·용도가 다른 단어들을 묶어서 비교합니다."
    >
      <main className="container margin-vert--lg">
        <h1>🎭 뉘앙스 사전</h1>
        <p>
          "바보"라는 한 단어도 영어로는 fool(명사), fool(동사: 속이다), foolish, naive, clumsy처럼 품사와 강도,
          격식에 따라 전혀 다른 단어로 갈립니다. 이 사전은 그런 <strong>한국어 개념 하나에 몰려있는 영어 단어
          묶음</strong>을 품사·발음·강도·용도로 비교해서 보여줍니다. 카드를 클릭하면 상세 표가 열립니다.
          현재 중학교 수준의 핵심 개념 {clusters.length}개, 단어 {totalWords}개를 다룹니다.
          say/tell, look/see처럼 동사가 포함된 개념은 여기서 격식·강도 차이를 비교하고, 그 동사가
          문장에서 목적어를 어떻게 받는지(구조)는 <Link to="/verbs">동사 패턴 사전</Link>에서
          확인하세요.
        </p>
        <input
          className={unitsStyles.searchInput}
          type="text"
          placeholder="예: 바보, 화난, angry, 감정..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {filtered.length === 0 && <p className={unitsStyles.empty}>검색 결과가 없습니다.</p>}

        {[...grouped.entries()].map(([category, categoryClusters]) => (
          <div key={category} className={unitsStyles.partBlock}>
            <h2>{category}</h2>
            <div className={styles.indexGrid}>
              {categoryClusters.map((c) => (
                <button
                  key={c.id}
                  className={styles.indexCard}
                  onClick={() => setActiveId(c.id)}
                >
                  <div className={styles.indexCardTop}>
                    <span className={styles.indexConcept}>{c.koreanConcept}</span>
                    <span className={styles.indexCount}>{c.entries.length}개 단어</span>
                  </div>
                  <p className={styles.indexPreview}>
                    {c.entries.map((e) => e.word).join(' · ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}

        <NuanceModal cluster={activeCluster} onClose={() => setActiveId(null)} />
      </main>
    </Layout>
  );
}
