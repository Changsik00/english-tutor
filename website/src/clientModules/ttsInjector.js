// 문서 페이지 안의 영어 예문(굵게 표시된 텍스트)에 자동으로 "듣기" 버튼을 붙여주는 클라이언트 모듈.
// 각 챕터 마크다운을 일일이 수정하지 않고, 렌더링된 DOM을 스캔해서 전역으로 적용한다.

function isMostlyLatin(text) {
  const trimmed = text.trim();
  if (trimmed.length < 3) return false;
  const letters = trimmed.replace(/[^A-Za-z가-힣]/g, '');
  if (letters.length === 0) return false;
  const latin = trimmed.replace(/[^A-Za-z]/g, '');
  return latin.length / letters.length > 0.6;
}

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.92;
  window.speechSynthesis.speak(utter);
}

function makeButton(text) {
  const btn = document.createElement('button');
  btn.className = 'egn-tts-btn';
  btn.type = 'button';
  btn.title = '영어 발음 듣기';
  btn.textContent = '🔊';
  btn.setAttribute('aria-label', `${text} 발음 듣기`);
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    speak(text);
  });
  return btn;
}

function injectButtons() {
  if (!window.speechSynthesis) return;
  const article = document.querySelector('article .markdown, article .theme-doc-markdown');
  if (!article) return;

  const candidates = article.querySelectorAll('strong, b');
  candidates.forEach((el) => {
    if (el.dataset.egnTts) return;
    const text = el.textContent.trim();
    if (!isMostlyLatin(text) || text.length > 200) return;
    el.dataset.egnTts = '1';
    el.insertAdjacentElement('afterend', makeButton(text));
  });
}

let observer;

function setup() {
  if (typeof window === 'undefined') return;
  injectButtons();
  if (observer) observer.disconnect();
  const root = document.querySelector('#__docusaurus') || document.body;
  observer = new MutationObserver(() => {
    injectButtons();
  });
  observer.observe(root, {childList: true, subtree: true});
}

export function onRouteDidUpdate() {
  if (typeof window === 'undefined') return;
  setTimeout(setup, 200);
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => setTimeout(setup, 200));
}
