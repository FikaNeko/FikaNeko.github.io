/* ════════════════════════════════════════════════════════════════
   Mist · main.js — 唯一脚本入口（ES Module，隐式 defer）
   ════════════════════════════════════════════════════════════════
   按 THEME_DESIGN 实施路线逐步接入各模块，当前：
     nav     吸顶导航玻璃化（is-scrolled）+ 移动端菜单抽屉开合
     reveal  滚动渐入（is-visible 添加，兑现 components.css §11 契约）
     theme   明暗模式切换（data-theme 翻转 + data-theme-anim 过渡）
     hitokoto 首页一言打字机（hero 全屏封面模式）
     code    代码块复制按钮与语言标签（components.css §09 契约）
     uptime  页脚网站运行时间（每秒刷新 + 数字切换动画）
   后续在此追加 toc 模块的 init 调用。
   无 JS 环境页面仍完整可用（渐进增强）。
   ════════════════════════════════════════════════════════════════ */
import { initNav, initMobileMenu } from './nav.js';
import { initReveal } from './reveal.js';
import { initTheme } from './theme.js';
import { initHitokoto } from './hitokoto.js';
import { initCode } from './code.js';
import { initUptime } from './uptime.js';

const boot = () => {
  /* 首页强制回到顶部：浏览器滚动恢复在布局稳定前应用会带偏置，
     #posts 锚点残留也会把刷新拉离顶部（用户要求刷新总在首屏）。
     文章页保留原生行为（阅读位置恢复 / 标题深链）。 */
  const page = document.querySelector('.page');
  if (page && page.classList.contains('page--index')) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (location.hash) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  initNav();
  initMobileMenu();
  initReveal();
  initTheme();
  initHitokoto();
  initCode();
  initUptime();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
