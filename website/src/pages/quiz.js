import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import questions from '@site/src/data/questions.json';
import {addMistake, removeMistake, recordActivity} from '@site/src/utils/storage';
import styles from './quiz.module.css';

const CHAPTER_OPTIONS = [...new Map(questions.map((q) => [q.chapter, q.chapterTitle])).entries()].sort((a, b) =>
  a[0].localeCompare(b[0])
);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SetupScreen({onStart}) {
  const [chapter, setChapter] = useState('all');
  const [count, setCount] = useState(10);

  const pool = chapter === 'all' ? questions : questions.filter((q) => q.chapter === chapter);

  return (
    <div className={styles.setupBox}>
      <label className={styles.field}>
        <span>범위</span>
        <select value={chapter} onChange={(e) => setChapter(e.target.value)}>
          <option value="all">전체 ({questions.length}문제)</option>
          {CHAPTER_OPTIONS.map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span>문제 수</span>
        <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
          {[5, 10, 15, 20, 30].map((n) => (
            <option key={n} value={n}>
              {n}문제
            </option>
          ))}
        </select>
      </label>
      <button
        className="button button--primary button--lg"
        disabled={pool.length === 0}
        onClick={() => onStart(shuffle(pool).slice(0, Math.min(count, pool.length)))}>
        퀴즈 시작 ({Math.min(count, pool.length)}문제)
      </button>
    </div>
  );
}

function QuizScreen({items, onFinish}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);

  const current = items[index];

  const answer = (correct) => {
    if (correct) {
      removeMistake(current.id);
    } else {
      addMistake(current);
    }
    const nextResults = [...results, {id: current.id, correct}];
    setResults(nextResults);
    setRevealed(false);
    if (index + 1 >= items.length) {
      onFinish(nextResults);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <div className={styles.quizBox}>
      <div className={styles.progressLine}>
        {index + 1} / {items.length}
      </div>
      <div className={styles.chapterTag}>{current.chapterTitle}</div>
      <div className={styles.prompt}>{current.prompt}</div>

      {!revealed ? (
        <button className="button button--secondary button--lg" onClick={() => setRevealed(true)}>
          정답 확인하기
        </button>
      ) : (
        <>
          <p className={styles.revealHint}>
            해당 챕터로 가서 정답을 직접 확인해보세요:{' '}
            <Link to={`/docs/chapters/${current.chapter}#${current.id}`} target="_blank">
              문제 위치로 이동 →
            </Link>
          </p>
          <div className={styles.gradeRow}>
            <button className="button button--success button--lg" onClick={() => answer(true)}>
              ✅ 맞았어요
            </button>
            <button className="button button--danger button--lg" onClick={() => answer(false)}>
              ❌ 틀렸어요
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ResultScreen({results, onRestart}) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  return (
    <div className={styles.resultBox}>
      <div className={styles.resultScore}>
        {correct} / {total}
      </div>
      <p>
        틀린 문제는 자동으로 <Link to="/mistakes">오답노트</Link>에 저장되었습니다.
      </p>
      <button className="button button--primary button--lg" onClick={onRestart}>
        다시 풀기
      </button>
    </div>
  );
}

function QuizInner() {
  const [phase, setPhase] = useState('setup'); // setup | quiz | result
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);

  const start = (selected) => {
    recordActivity();
    setItems(selected);
    setPhase('quiz');
  };

  const finish = (r) => {
    setResults(r);
    setPhase('result');
  };

  const restart = () => {
    setPhase('setup');
    setResults([]);
  };

  if (phase === 'setup') return <SetupScreen onStart={start} />;
  if (phase === 'quiz') return <QuizScreen items={items} onFinish={finish} />;
  return <ResultScreen results={results} onRestart={restart} />;
}

export default function Quiz() {
  return (
    <Layout title="퀴즈 모드" description="저장된 연습문제 중에서 무작위로 뽑아 자가 테스트합니다.">
      <main className="container margin-vert--lg">
        <h1>🎯 퀴즈 모드</h1>
        <p>전체 244개 문제 중 범위를 골라 무작위로 풀어봅니다. 맞았는지 스스로 채점하면 됩니다.</p>
        <BrowserOnly>{() => <QuizInner />}</BrowserOnly>
      </main>
    </Layout>
  );
}
