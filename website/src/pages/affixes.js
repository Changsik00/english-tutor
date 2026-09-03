import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import affixes from '@site/src/data/affixes.json';
import AffixModal from '@site/src/components/affix/AffixModal';
import styles from '@site/src/components/affix/affix.module.css';
import unitsStyles from './units.module.css';

function groupByCategory(list) {
  const byCategory = new Map();
  for (const item of list) {
    if (!byCategory.has(item.category)) byCategory.set(item.category, []);
    byCategory.get(item.category).push(item);
  }
  return byCategory;
}

export default function AffixDictionary() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return affixes;
    return affixes.filter(
      (item) =>
        item.affix.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.meaningKo.toLowerCase().includes(q) ||
        item.words.some(
          (w) => w.base.toLowerCase().includes(q) || w.derived.toLowerCase().includes(q)
        )
    );
  }, [query]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);
  const totalWords = affixes.reduce((sum, item) => sum + item.words.length, 0);
  const activeItem = affixes.find((item) => item.id === activeId) || null;

  return (
    <Layout
      title="접사 사전"
      description="접두사·접미사가 품사와 의미를 어떻게 바꾸는지 규칙과 예시 단어로 정리한 사전입니다."
    >
      <main className="container margin-vert--lg">
        <h1>🧩 접사 사전</h1>
        <p>
          영어 단어는 접미사(suffix)가 붙으면 대개 <strong>품사가 바뀌고</strong>, 접두사(prefix)가
          붙으면 대개 <strong>품사는 그대로 두고 의미만 바뀝니다</strong>(단, en-/be-/a- 같은
          예외도 있습니다). 이 사전은 그 규칙을 접사별로 묶어서, 원어와 파생어를 나란히 비교해
          보여줍니다. 카드를 클릭하면 상세 표가 열립니다. 현재 접사 {affixes.length}개, 단어{' '}
          {totalWords}개를 다룹니다. 접사가 붙을 때의 철자 변화 규칙과, 여러 접사가 겹쳐 하나의
          "단어 가족"을 이루는 원리, 낯선 단어를 분해해서 추측하는 절차는{' '}
          <Link to="/docs/word-formation">조어원리</Link> 문서에서 다룹니다.
        </p>
        <input
          className={unitsStyles.searchInput}
          type="text"
          placeholder="예: -tion, un-, careful, 접두사..."
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
                    <span className={styles.indexAffix}>{item.affix}</span>
                    <span className={styles.indexCount}>{item.words.length}개 단어</span>
                  </div>
                  <p className={styles.indexPreview}>
                    {item.words.map((w) => w.derived).join(' · ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}

        <AffixModal item={activeItem} onClose={() => setActiveId(null)} />
      </main>
    </Layout>
  );
}
