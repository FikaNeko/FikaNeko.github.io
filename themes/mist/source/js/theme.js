/* ════════════════════════════════════════════════════════════════
   Mist · theme.js — 明暗模式切换
   ════════════════════════════════════════════════════════════════
   契约（与 head.ejs / layout.css §06 对应）：
   - 点击 .js-theme-toggle 翻转 html[data-theme]（图标显隐由 CSS
     按 [data-theme] 自动处理，本模块不碰图标）
   - 切换前设置 html[data-theme-anim]，400ms 后移除——仅在该属性
     存在期间全站启用颜色过渡（motion.theme_transition = false 或
     motion.enabled = false 时跳过，即瞬时切换）
   - 记忆：appearance.remember 开启时写入 localStorage['mist-theme']
     （与 head.ejs 防闪烁脚本同一键；remember = false 时不读不写）
   - 系统跟随：用户未手动选择过（无存储值）时，实时跟随系统
     prefers-color-scheme 变化
   ════════════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'mist-theme';

export function initTheme() {
  const root = document.documentElement;
  const btn = document.querySelector('.js-theme-toggle');
  if (!btn) return;

  const appearance = (window.Mist && window.Mist.appearance) || {};
  const motion = (window.Mist && window.Mist.motion) || {};
  const remember = appearance.remember !== false;

  const apply = (mode) => {
    root.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
    btn.setAttribute('aria-pressed', String(mode === 'dark'));
  };

  const readStored = () => {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  };

  const writeStored = (mode) => {
    if (!remember) return;
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) { /* 隐私模式等场景静默降级 */ }
  };

  // 平滑切换：短暂挂上 data-theme-anim，让 CSS 的全站颜色过渡生效
  const withTransition = (fn) => {
    const smooth = motion.enabled !== false && motion.theme_transition !== false;
    if (!smooth) { fn(); return; }
    root.setAttribute('data-theme-anim', '');
    fn();
    window.setTimeout(() => root.removeAttribute('data-theme-anim'), 400);
  };

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    withTransition(() => apply(next));
    writeStored(next);
  });

  // 系统跟随：仅在用户从未手动选择时启用
  if (window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (!readStored()) apply(media.matches ? 'dark' : 'light'); };
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange); // 旧 Safari
  }

  // 初始化 aria 状态
  btn.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
}
