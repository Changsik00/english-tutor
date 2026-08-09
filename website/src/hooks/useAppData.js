import {useState, useEffect, useCallback} from 'react';
import * as store from '@site/src/utils/storage';

// 챕터 하나의 완료 여부를 구독하는 훅.
export function useChapterProgress(chapterId) {
  const [entry, setEntry] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setEntry(store.getChapterProgress(chapterId));
    setReady(true);
  }, [chapterId]);

  useEffect(() => {
    refresh();
    return store.subscribe(refresh);
  }, [refresh]);

  return {
    entry,
    ready,
    markComplete: () => store.markChapterComplete(chapterId),
    reset: () => store.resetChapterProgress(chapterId),
  };
}

// 전체 챕터 진행 현황(대시보드용).
export function useAllProgress() {
  const [all, setAll] = useState({chapters: {}});
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setAll(store.getAllProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return store.subscribe(refresh);
  }, [refresh]);

  return {all, ready};
}

// 문제 하나의 복습 상태를 구독하는 훅. meta: {id, chapter, chapterTitle, prompt, anchor}
export function useReviewItem(meta) {
  const [item, setItem] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setItem(store.getReviewItem(meta.id));
    setReady(true);
  }, [meta.id]);

  useEffect(() => {
    refresh();
    return store.subscribe(refresh);
  }, [refresh]);

  const grade = (g) => store.gradeReviewItem(meta, g);
  const remove = () => store.removeReviewItem(meta.id);

  return {item, ready, grade, remove};
}

// 복습 항목 전체(복습 페이지용).
export function useAllReviewItems() {
  const [all, setAll] = useState({items: {}});
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setAll(store.getAllReviewItems());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return store.subscribe(refresh);
  }, [refresh]);

  return {
    all,
    ready,
    remove: (id) => store.removeReviewItem(id),
    grade: (meta, g) => store.gradeReviewItem(meta, g),
  };
}

// 학습 스트릭(연속 학습일) 구독 훅.
export function useStreak() {
  const [streak, setStreak] = useState({current: 0, longest: 0, lastActiveDay: null});
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setStreak(store.getStreak());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return store.subscribe(refresh);
  }, [refresh]);

  return {streak, ready};
}
