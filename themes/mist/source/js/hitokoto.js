/* ════════════════════════════════════════════════════════════════
   Mist · hitokoto.js — 一言打字机（hero 全屏封面模式）
   ════════════════════════════════════════════════════════════════
   - 从 home.hitokoto_api（默认 https://v1.hitokoto.cn/）取句，
     逐字打进 .js-hitokoto；打字完成后把出处（—— 作品名）
     追加到 .js-hitokoto-from
   - 接口失败/离线时使用 home.hitokoto_fallback 兜底
     （字符串或句子列表，列表随机取一）
   - motion.enabled = false 或系统"减少动态效果"时直接整句显示
   - 光标闪烁与预留行高由 CSS 负责，打字过程零布局跳动
   ════════════════════════════════════════════════════════════════ */
const TYPE_SPEED = 100; // ms/字

export function initHitokoto() {
  const textEl = document.querySelector('.js-hitokoto');
  if (!textEl) return;
  const fromEl = document.querySelector('.js-hitokoto-from');

  const home = (window.Mist && window.Mist.home) || {};
  const motion = (window.Mist && window.Mist.motion) || {};
  const animate =
    motion.enabled !== false &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fallbackRaw = home.hitokoto_fallback;
  const fallback = Array.isArray(fallbackRaw)
    ? fallbackRaw[Math.floor(Math.random() * fallbackRaw.length)]
    : (fallbackRaw || '');

  /* 出处显示：占位宽度从 0 平滑撑开（居中的正文随之连续左移），
     叠加 from-reveal 动画（右→左滑入 + 模糊渐清 + 淡入）；
     无出处时不触发 */
  const showFrom = (from) => {
    if (!fromEl) return;
    fromEl.textContent = from ? '—— ' + from : '';
    if (!from) return;

    fromEl.style.width = '0px';            // 先归零占位，避免文本瞬跳
    const target = fromEl.scrollWidth;      // 实际内容宽（nowrap 下稳定）
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        fromEl.classList.add('is-in');
        fromEl.style.width = target + 'px'; // 过渡撑开（transition 在 CSS 中）
      });
    });
  };

  const render = (text, from) => {
    if (!animate) {
      textEl.textContent = text || '';
      showFrom(from);
      return;
    }
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      textEl.textContent = text.slice(0, i);
      if (i >= text.length) {
        window.clearInterval(timer);
        showFrom(from);
      }
    }, TYPE_SPEED);
  };

  const url = home.hitokoto_api;
  if (!url) { render(fallback, ''); return; }

  fetch(url)
    .then((res) => res.json())
    .then((data) => render(data.hitokoto || fallback, data.from || data.from_who || ''))
    .catch(() => render(fallback, ''));
}
