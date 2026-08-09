// localStorage 기반 학습 진행/복습 저장소.
// 브라우저 환경에서만 동작 (Docusaurus 빌드 시 Node에는 window/localStorage가 없음).
//
// v2: 챕터 단위 진행과 복습 항목(구 오답노트)이 각자 독립적인 1/3/7/30일 스케줄을
// 갖던 v1 구조를 정리했다. 이제 스케줄은 "문제 단위 복습 항목"에만 존재하고,
// 챕터 진행은 단순 완료 체크로 축소했다(중복 시스템 제거).

const PROGRESS_KEY = 'egn:progress:v2';
const REVIEW_KEY = 'egn:review:v2';
const STREAK_KEY = 'egn:streak:v1';

// 복습 간격(일 단위): 1일 -> 3일 -> 7일 -> 30일 -> 그 뒤로는 "기억남" 선택 시 졸업(목록에서 제거)
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

// ---------- 챕터 진행 (단순 완료 체크) ----------

export function getAllProgress() {
  return readJSON(PROGRESS_KEY, {chapters: {}});
}

export function getChapterProgress(chapterId) {
  const all = getAllProgress();
  return all.chapters[chapterId] || null;
}

export function markChapterComplete(chapterId) {
  const all = getAllProgress();
  all.chapters[chapterId] = {completedAt: Date.now()};
  writeJSON(PROGRESS_KEY, all);
  emitChange();
}

export function resetChapterProgress(chapterId) {
  const all = getAllProgress();
  delete all.chapters[chapterId];
  writeJSON(PROGRESS_KEY, all);
  emitChange();
}

// ---------- 복습 (문제 단위 능동회상 SRS) ----------
//
// 문제 하나(연습문제 항목)마다 "정답을 다시 떠올려본 뒤" 3단계로 자기 채점한다.
//   again(다시)   : 아직 모름 -> 1단계로 리셋, 내일 다시 노출
//   unsure(헷갈림): 애매함    -> 현재 단계 유지, 같은 간격으로 다시 노출
//   good(기억남)  : 잘 기억함 -> 다음 단계로 승급, 마지막 단계 이후엔 "졸업"(목록에서 제거)

export function getAllReviewItems() {
  return readJSON(REVIEW_KEY, {items: {}});
}

export function getReviewItem(id) {
  const all = getAllReviewItems();
  return all.items[id] || null;
}

export function isDueForReview(item, now = Date.now()) {
  if (!item) return false;
  return item.nextReviewAt != null && item.nextReviewAt <= now;
}

export function removeReviewItem(id) {
  const all = getAllReviewItems();
  delete all.items[id];
  writeJSON(REVIEW_KEY, all);
  emitChange();
}

// meta: {id, chapter, chapterTitle, prompt, anchor}, grade: 'again' | 'unsure' | 'good'
export function gradeReviewItem(meta, grade) {
  const all = getAllReviewItems();
  const now = Date.now();
  const existing = all.items[meta.id];
  const stage = existing ? existing.stage : 0;

  if (grade === 'good') {
    const nextStage = stage + 1;
    if (nextStage >= REVIEW_STAGE_DAYS.length) {
      delete all.items[meta.id];
      writeJSON(REVIEW_KEY, all);
      emitChange();
      return {graduated: true};
    }
    all.items[meta.id] = {
      ...meta,
      stage: nextStage,
      lastGrade: grade,
      addedAt: existing ? existing.addedAt : now,
      lastReviewedAt: now,
      nextReviewAt: now + REVIEW_STAGE_DAYS[nextStage] * DAY_MS,
    };
  } else if (grade === 'unsure') {
    all.items[meta.id] = {
      ...meta,
      stage,
      lastGrade: grade,
      addedAt: existing ? existing.addedAt : now,
      lastReviewedAt: now,
      nextReviewAt: now + REVIEW_STAGE_DAYS[stage] * DAY_MS,
    };
  } else {
    // again
    all.items[meta.id] = {
      ...meta,
      stage: 0,
      lastGrade: grade,
      addedAt: existing ? existing.addedAt : now,
      lastReviewedAt: now,
      nextReviewAt: now + REVIEW_STAGE_DAYS[0] * DAY_MS,
    };
  }
  writeJSON(REVIEW_KEY, all);
  emitChange();
  return {graduated: false};
}

export function getDueReviewItems(now = Date.now()) {
  const all = getAllReviewItems();
  return Object.values(all.items).filter((item) => isDueForReview(item, now));
}

export function getDueReviewCountForChapter(chapterId, now = Date.now()) {
  return getDueReviewItems(now).filter((item) => item.chapter === chapterId).length;
}

// ---------- 학습 스트릭 ----------

function todayKey(ts = Date.now()) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function getStreak() {
  return readJSON(STREAK_KEY, {current: 0, longest: 0, lastActiveDay: null});
}

// 하루에 한 번만 반영됨 (같은 날 여러 번 호출해도 안전).
export function recordActivity() {
  const streak = getStreak();
  const today = todayKey();
  if (streak.lastActiveDay === today) return streak;

  const yesterday = todayKey(Date.now() - DAY_MS);
  const current = streak.lastActiveDay === yesterday ? streak.current + 1 : 1;
  const next = {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDay: today,
  };
  writeJSON(STREAK_KEY, next);
  emitChange();
  return next;
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
