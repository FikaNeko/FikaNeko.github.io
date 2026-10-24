/* ════════════════════════════════════════════════════════════════
   Mist · nav.js — 吸顶导航交互
   ════════════════════════════════════════════════════════════════
   滚动超过 8px 为 .js-nav 切换 is-scrolled；其余全部由 CSS 完成：
   高度收缩（--nav-height 64→52）与模糊度增强（--glass-blur ×1.6）。
   data-glass-on-scroll="false" 时 CSS 常驻玻璃态，本模块不受影响。
   ════════════════════════════════════════════════════════════════ */
export function initNav() {
  const nav = document.querySelector('.js-nav');
  if (!nav) return;

  // 滞回带：>8px 进入玻璃态（设计 §3.1），≤2px 才退出。
  // 单一阈值会在临界区因输入抖动/亚像素来回翻转（配合 CSS 的
  // margin 补偿双保险，彻底消除导航临界振荡）
  const THRESHOLD_ON = 8;
  const THRESHOLD_OFF = 2;
  let scrolled = nav.classList.contains('is-scrolled');

  const update = () => {
    const y = window.scrollY;
    if (!scrolled && y > THRESHOLD_ON) scrolled = true;
    else if (scrolled && y <= THRESHOLD_OFF) scrolled = false;
    if (scrolled !== nav.classList.contains('is-scrolled')) {
      nav.classList.toggle('is-scrolled', scrolled);
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update(); // 处理刷新后停留在滚动位置的情况

  /* 首页下滑箭头：JS 平滑滚动替代原生锚点跳转，
     避免往 URL 写入 #posts（残留锚点会让后续每次刷新都离顶） */
  const arrow = document.querySelector('.hero__scroll-down');
  if (arrow) {
    arrow.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(arrow.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* 移动端菜单抽屉：汉堡按钮开合（.mobile-menu 的 is-open），
   遮罩 / 关闭按钮 / Esc / 选中菜单项均关闭；打开期间锁定页面滚动 */
export function initMobileMenu() {
  const menu = document.querySelector('.js-mobile-menu');
  const toggle = document.querySelector('.js-menu-toggle');
  if (!menu || !toggle) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  menu.querySelectorAll('.js-menu-close, .mobile-menu__link').forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
    }
  });
}
