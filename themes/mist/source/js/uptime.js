/* ════════════════════════════════════════════════════════════════
   Mist · uptime.js — 页脚网站运行时间
   ════════════════════════════════════════════════════════════════
   - 读取 .js-uptime 的 data-start（footer.uptime.start，精确到秒），
     渲染"前缀 + 天/时/分/秒 四段"，每秒刷新
   - 动画契约（CSS 见 layout.css / base.css）：
     · 整体进场 .is-live：从下到上 + 模糊渐清 + 淡入（参考一言出处，
       方向改为纵向）
     · 数字变动：加 .is-out（模糊淡出↑）→ 换字 → 加 .is-in（从下
       模糊淡入变清晰），秒位每秒循环"如此往复"
   - 数字用 tabular 等宽 + 两位补零（天数自然增长），避免跳动
   - 日期解析做 iOS 兼容（- 分隔替换为 /）
   ════════════════════════════════════════════════════════════════ */
const SEGMENTS = ['d', 'h', 'm', 's'];
const SWAP_MS = 300;   // 与 CSS 动画时长（--dur-fast）一致

export function initUptime() {
  const el = document.querySelector('.js-uptime');
  if (!el) return;

  const labels = (window.Mist && window.Mist.uptime) || {};
  const prefix = labels.prefix || '本站已运行';
  const units = labels.units || ['天', '时', '分', '秒'];

  /* iOS Safari 不认 "-" 分隔的日期串 */
  const start = new Date(String(el.dataset.start || '').replace(/-/g, '/')).getTime();
  if (isNaN(start)) return;

  /* 构建 DOM：前缀 + 四段（等宽数字 + 单位） */
  el.textContent = '';
  const prefixNode = document.createElement('span');
  prefixNode.className = 'site-footer__uptime-prefix';
  prefixNode.textContent = prefix;
  el.appendChild(prefixNode);

  const nums = {};
  SEGMENTS.forEach((key, i) => {
    const seg = document.createElement('span');
    seg.className = 'uptime-seg';
    const num = document.createElement('span');
    num.className = 'uptime-seg-num';
    const unit = document.createElement('span');
    unit.className = 'uptime-seg-unit';
    unit.textContent = units[i];
    nums[key] = num;
    seg.appendChild(num);
    seg.appendChild(unit);
    el.appendChild(seg);
  });

  const current = {};

  const setNum = (numEl, text, animate) => {
    if (!animate) { numEl.textContent = text; return; }
    numEl.classList.add('is-out');
    window.setTimeout(() => {
      numEl.textContent = text;
      numEl.classList.remove('is-out');
      numEl.classList.add('is-in');
      window.setTimeout(() => numEl.classList.remove('is-in'), SWAP_MS);
    }, SWAP_MS);
  };

  const tick = () => {
    let diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
    const d = Math.floor(diff / 86400); diff -= d * 86400;
    const h = Math.floor(diff / 3600); diff -= h * 3600;
    const m = Math.floor(diff / 60);
    const s = diff - m * 60;
    const next = {
      d: String(d),
      h: String(h).padStart(2, '0'),
      m: String(m).padStart(2, '0'),
      s: String(s).padStart(2, '0')
    };
    for (const key of SEGMENTS) {
      if (current[key] === next[key]) continue;
      setNum(nums[key], next[key], current[key] !== undefined);
      current[key] = next[key];
    }
  };

  tick();
  window.setInterval(tick, 1000);

  /* 整体进场：从下到上 + 模糊渐清 */
  window.requestAnimationFrame(() => el.classList.add('is-live'));
}
