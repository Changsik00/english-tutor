import {useState, useEffect, useCallback} from 'react';
import * as store from '@site/src/utils/storage';

// 챕터 하나의 진행 상태를 구독하는 훅.
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
    isDue: store.isDueForReview(entry),
    markComplete: () => store.markChapterComplete(chapterId),
    markReviewed: () => store.markChapterReviewed(chapterId),
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

// 문제 하나의 오답 저장 여부를 구독하는 훅.
export function useMistakeToggle(meta) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setSaved(store.isMistakeSaved(meta.id));
    setReady(true);
  }, [meta.id]);

  useEffect(() => {
    refresh();
    return store.subscribe(refresh);
  }, [refresh]);

  const toggle = () => {
    store.toggleMistake(meta);
  };

  return {saved, ready, toggle};
}

// 오답노트 전체(오답노트 페이지용).
export function useAllMistakes() {
  const [all, setAll] = useState({items: {}});
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setAll(store.getAllMistakes());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return store.subscribe(refresh);
  }, [refresh]);

  return {
    all,
    ready,
    remove: (id) => store.removeMistake(id),
  };
}
