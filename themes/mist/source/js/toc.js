/* ════════════════════════════════════════════════════════════════
   Mist · toc.js — 目录滚动高亮与移动端抽屉
   ════════════════════════════════════════════════════════════════
   兑现 components.css §06 契约：
   - 滚动监听（rAF 节流）：以「导航高 + 余量」为界，当前标题 =
     视口内最后一个越界标题，为两个形态的面板（side / drawer）
     同步切换 .toc-link.is-active
   - 点击目录项立即高亮（平滑滚动由 CSS scroll-behavior 承担）
   - 抽屉（post.toc_position: drawer）：.js-toc-toggle 开合
     .js-toc-drawer 的 is-open；遮罩/关闭按钮/Esc/点击目录项关闭；
     打开期间锁定页面滚动（与移动端菜单同一套交互约定）
   ════════════════════════════════════════════════════════════════ */

const SPY_OFFSET = 100;   // 导航高 64 + 余量

export function initToc() {
  const panels = Array.from(document.querySelectorAll('.js-toc'));
  if (!panels.length) return;

  /* ── 滚动高亮 ─────────────────────────────────────────────── */
  // 每个面板建一份 标题id → 链接 映射（id 同时登记原样与解码两种
  // 形态，兼容链接里的百分号编码）
  const panelsMap = panels.map((panel) => {
    const map = new Map();
    panel.querySelectorAll('.toc-link').forEach((link) => {
      const hash = (link.getAttribute('href') || '').replace(/^#/, '');
      if (!hash) return;
      map.set(hash, link);
      try {
        const decoded = decodeURIComponent(hash);
        if (decoded !== hash) map.set(decoded, link);
      } catch (e) { /* 含裸 % 的 id，跳过解码形态 */ }
    });
    return map;
  });

  // 正文中有对应目录项的标题（document 顺序）
  const headings = Array.from(document.querySelectorAll('.post-full__content [id]'))
    .filter((el) => panelsMap.some((map) => map.has(el.id)));
  if (!headings.length) return;

  let activeId = '';
  const setActive = (id) => {
    if (id === activeId) return;
    activeId = id;
    panelsMap.forEach((map) => {
      map.forEach((link, key) => link.classList.toggle('is-active', key === id));
    });
  };

  let ticking = false;
  const spy = () => {
    ticking = false;
    let current = headings[0].id;
    for (const h of headings) {
      if (h.getBoundingClientRect().top > SPY_OFFSET) break;
      current = h.id;
    }
    setActive(current);
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(spy);
    }
  }, { passive: true });
  spy();

  // 点击目录项：立即高亮（随后滚动过程 spy 会自然接管）
  panels.forEach((panel) => {
    panel.addEventListener('click', (event) => {
      const link = event.target.closest('.toc-link');
      if (!link) return;
      const hash = (link.getAttribute('href') || '').replace(/^#/, '');
      if (hash) setActive(hash);
    });
  });

  /* ── 移动端抽屉（toc_position: drawer 时元素才存在） ──────── */
  const drawer = document.querySelector('.js-toc-drawer');
  const toggle = document.querySelector('.js-toc-toggle');
  if (!drawer || !toggle) return;

  const setOpen = (open) => {
    drawer.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(!drawer.classList.contains('is-open'));
  });
  drawer.querySelectorAll('.js-toc-close').forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });
  drawer.querySelectorAll('.toc-link').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
  });
}
