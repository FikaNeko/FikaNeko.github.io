/* ════════════════════════════════════════════════════════════════
   Mist · reveal.js — 滚动渐入
   ════════════════════════════════════════════════════════════════
   兑现 components.css §11 契约：
   - .js-reveal 进入视口时添加 .is-visible（触发 fade-up + 错峰延迟）
   - motion.enabled / motion.reveal 关闭、或浏览器不支持
     IntersectionObserver 时，立即为全部元素补 .is-visible，
     避免内容停留隐藏态（opacity: 0）
   - 一次性动画：显示后即 unobserve
   ════════════════════════════════════════════════════════════════ */
export function initReveal() {
  const els = Array.from(document.querySelectorAll('.js-reveal'));
  if (!els.length) return;

  const motion = (window.Mist && window.Mist.motion) || {};
  const enabled = motion.enabled !== false && motion.reveal !== false;

  if (!enabled || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    },
    // 底部略收 8%：元素接近视口下沿时才触发，观感更从容
    { rootMargin: '0px 0px -8% 0px' }
  );

  els.forEach((el) => io.observe(el));
}
