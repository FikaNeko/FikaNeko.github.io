/* ════════════════════════════════════════════════════════════════
   Mist · uptime.js — 页脚网站运行时间
   ════════════════════════════════════════════════════════════════
   结构由 footer.ejs 服务端渲染（前缀 + 天/时/分/秒四段，数字留空、
   min-width 预占宽），首屏排版完整、零布局位移；本模块只负责：
   - 首帧把数字填入（不做动画，current 由 DOM 现状播种）
   - 每秒计算并更新，数字变动播放 .is-out（模糊淡出↑）→ .is-in
     （从下模糊淡入变清晰），关键帧见 base.css
   - 数字 tabular 等宽 + 两位补零（天数自然增长），避免跳动
   - 日期解析做 iOS 兼容（- 分隔替换为 /）
   ════════════════════════════════════════════════════════════════ */

const SEGMENTS = ['d', 'h', 'm', 's'];
const SWAP_MS = 300;   // 与 CSS 动画时长（--dur-fast）一致

export function initUptime() {
  const el = document.querySelector('.js-uptime');
  if (!el) return;

  /* 服务端已渲染结构；缺段（旧缓存等）则放弃，避免半初始化状态 */
  const nums = {};
  let ok = true;
  SEGMENTS.forEach((key, i) => {
    const seg = el.querySelectorAll('.uptime-seg-num')[i];
    if (!seg) { ok = false; return; }
    nums[key] = seg;
  });
  if (!ok) return;

  /* iOS Safari 不认 "-" 分隔的日期串 */
  const start = new Date(String(el.dataset.start || '').replace(/-/g, '/')).getTime();
  if (isNaN(start)) return;

  const current = {};
  let firstTick = true;   // 首帧填数不做动画

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
      setNum(nums[key], next[key], !firstTick);
      current[key] = next[key];
    }
    firstTick = false;
  };

  tick();
  window.setInterval(tick, 1000);
}
