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
     toc     目录滚动高亮与移动端抽屉（components.css §06 契约）
     leave   页面离开过渡（.page-transition.is-leaving，播完再跳转）
   无 JS 环境页面仍完整可用（渐进增强）。
   ════════════════════════════════════════════════════════════════ */
import { initNav, initMobileMenu } from './nav.js';
import { initReveal } from './reveal.js';
import { initTheme } from './theme.js';
import { initHitokoto } from './hitokoto.js';
import { initCode } from './code.js';
import { initUptime } from './uptime.js';
import { initToc } from './toc.js';

/* 页面离开过渡：拦截同源普通链接点击 → 为 .js-page-transition 加
   is-leaving（page-out：淡出 + 模糊渐隐）→ 动画播完再跳转。
   契约（layout.css §02）：动画时长取自 --dur-fast（0.3s）；
   动画被禁用（motion 关闭 → 时长 0s）时 animationend 不触发，
   以计算出的时长兜底跳转；bfcache 返回时移除 is-leaving 复原。
   放行：修饰键点击 / target=_blank / download / 纯锚点 /
   mailto·tel·javascript / 跨域链接。 */
const initPageLeave = () => {
  const wrap = document.querySelector('.js-page-transition');
  if (!wrap) return;

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) wrap.classList.remove('is-leaving');
  });

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return;

    let url;
    try { url = new URL(link.href, location.href); } catch (e) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

    event.preventDefault();
    if (wrap.classList.contains('is-leaving')) { location.href = url.href; return; }

    wrap.classList.add('is-leaving');
    let fired = false;
    const go = () => { if (!fired) { fired = true; location.href = url.href; } };

    const durSec = parseFloat(getComputedStyle(wrap).animationDuration) || 0;
    window.setTimeout(go, durSec * 1000 + 50);           // 动画禁用/极短时的兜底
    wrap.addEventListener('animationend', go, { once: true });
  });
};

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
  initToc();
  initPageLeave();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
