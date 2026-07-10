// localStorage 기반 학습 진행/오답노트 저장소.
// 브라우저 환경에서만 동작 (Docusaurus 빌드 시 Node에는 window/localStorage가 없음).

const PROGRESS_KEY = 'egn:progress:v1';
const MISTAKES_KEY = 'egn:mistakes:v1';

// 완료 후 복습 간격(일 단위): 1일 -> 3일 -> 7일 -> 30일 -> 그 뒤로는 마스터 처리
export const REVIEW_STAGE_DAYS = [1, 3, 7, 30];
const DAY_MS = 24 * 60 * 60 * 1000;

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJSON(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // 저장 실패(용량 초과 등)는 조용히 무시 — 학습 자체를 막지 않음
  }
}

function emitChange() {
  if (isBrowser()) {
    window.dispatchEvent(new Event('egn:data-changed'));
  }
}

// ---------- 진행/복습 ----------

export function getAllProgress() {
  return readJSON(PROGRESS_KEY, {chapters: {}});
}

export function getChapterProgress(chapterId) {
  const all = getAllProgress();
  return all.chapters[chapterId] || null;
}

export function markChapterComplete(chapterId) {
  const all = getAllProgress();
  const now = Date.now();
  all.chapters[chapterId] = {
    completedAt: now,
    stage: 0,
    lastReviewedAt: now,
    nextReviewAt: now + REVIEW_STAGE_DAYS[0] * DAY_MS,
    mastered: false,
  };
  writeJSON(PROGRESS_KEY, all);
  emitChange();
}

export function markChapterReviewed(chapterId) {
  const all = getAllProgress();
  const entry = all.chapters[chapterId];
  if (!entry) return;
  const nextStage = entry.stage + 1;
  const now = Date.now();
  if (nextStage >= REVIEW_STAGE_DAYS.length) {
    entry.mastered = true;
    entry.nextReviewAt = null;
  } else {
    entry.stage = nextStage;
    entry.nextReviewAt = now + REVIEW_STAGE_DAYS[nextStage] * DAY_MS;
  }
  entry.lastReviewedAt = now;
  writeJSON(PROGRESS_KEY, all);
  emitChange();
}

export function resetChapterProgress(chapterId) {
  const all = getAllProgress();
  delete all.chapters[chapterId];
  writeJSON(PROGRESS_KEY, all);
  emitChange();
}

export function isDueForReview(entry, now = Date.now()) {
  if (!entry || entry.mastered) return false;
  return entry.nextReviewAt != null && entry.nextReviewAt <= now;
}

// ---------- 오답노트 ----------

export function getAllMistakes() {
  return readJSON(MISTAKES_KEY, {items: {}});
}

export function isMistakeSaved(id) {
  const all = getAllMistakes();
  return Boolean(all.items[id]);
}

export function addMistake({id, chapter, chapterTitle, prompt, anchor}) {
  const all = getAllMistakes();
  all.items[id] = {
    id,
    chapter,
    chapterTitle,
    prompt,
    anchor: anchor || id,
    addedAt: Date.now(),
  };
  writeJSON(MISTAKES_KEY, all);
  emitChange();
}

export function removeMistake(id) {
  const all = getAllMistakes();
  delete all.items[id];
  writeJSON(MISTAKES_KEY, all);
  emitChange();
}

export function toggleMistake(meta) {
  if (isMistakeSaved(meta.id)) {
    removeMistake(meta.id);
    return false;
  }
  addMistake(meta);
  return true;
}

export function subscribe(callback) {
  if (!isBrowser()) return () => {};
  window.addEventListener('egn:data-changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('egn:data-changed', callback);
    window.removeEventListener('storage', callback);
  };
}
