import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import units from '@site/src/data/units.json';
import styles from './units.module.css';

const PART_BY_CHAPTER = {
  ch01: 'Part 1: 기초 문법',
  ch02: 'Part 1: 기초 문법',
  ch03: 'Part 1: 기초 문법',
  ch04: 'Part 1: 기초 문법',
  ch05: 'Part 2: 태와 준동사',
  ch06: 'Part 2: 태와 준동사',
  ch07: 'Part 2: 태와 준동사',
  ch08: 'Part 2: 태와 준동사',
  ch09: 'Part 2: 태와 준동사',
  ch10: 'Part 3: 품사 심화·연결어',
  ch11: 'Part 3: 품사 심화·연결어',
  ch12: 'Part 3: 품사 심화·연결어',
  ch13: 'Part 3: 품사 심화·연결어',
  ch14: 'Part 4: 관계사·특수구문',
  ch15: 'Part 4: 관계사·특수구문',
  ch16: 'Part 4: 관계사·특수구문',
  ch17: '실용',
  ch18: '실용',
};

function groupUnits(list) {
  const byPart = new Map();
  for (const u of list) {
    const part = PART_BY_CHAPTER[u.chapter] || '기타';
    if (!byPart.has(part)) byPart.set(part, new Map());
    const byChapter = byPart.get(part);
    if (!byChapter.has(u.chapter)) byChapter.set(u.chapter, {chapterTitle: u.chapterTitle, items: []});
    byChapter.get(u.chapter).items.push(u);
  }
  return byPart;
}

export default function UnitsIndex() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return units;
    return units.filter(
      (u) =>
        u.title.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.chapterTitle.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => groupUnits(filtered), [filtered]);

  return (
    <Layout title="전체 목차" description="107개 유닛 전체를 검색하고 바로 이동합니다.">
      <main className="container margin-vert--lg">
        <h1>📖 전체 목차</h1>
        <p>총 {units.length}개 유닛. 유닛 번호나 키워드로 검색해서 바로 이동할 수 있습니다.</p>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="예: 023, 현재완료, 관계대명사..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {filtered.length === 0 && <p className={styles.empty}>검색 결과가 없습니다.</p>}

        {[...grouped.entries()].map(([part, byChapter]) => (
          <div key={part} className={styles.partBlock}>
            <h2>{part}</h2>
            {[...byChapter.entries()].map(([chapterId, {chapterTitle, items}]) => (
              <div key={chapterId} className={styles.chapterBlock}>
                <h3>
                  <Link to={`/docs/chapters/${chapterId}`}>{chapterTitle}</Link>
                </h3>
                <ul className={styles.unitList}>
                  {items.map((u) => (
                    <li key={`${u.chapter}-${u.code}`}>
                      <Link to={`/docs/chapters/${u.chapter}#${u.anchor}`}>
                        <span className={styles.unitCode}>Unit {u.code}</span> {u.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </main>
    </Layout>
  );
}
