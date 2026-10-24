/* ════════════════════════════════════════════════════════════════
   Mist · code.js — 代码块复制按钮与语言标签
   ════════════════════════════════════════════════════════════════
   兑现 components.css §09 预留契约：
   - 每个 figure.highlight 注入 .code-lang（右上角语言小标，
     从 figure 类名提取）与 .code-copy-btn（悬停浮现的玻璃按钮）
   - 点击复制代码文本；成功后按钮文字变为"已复制！"并加
     .is-copied（accent 色），2s 后复原并保持可见
   - 文案来自 window.Mist.code（layout.ejs 经 i18n 注入）；
     post.copy_button = false 时整模块跳过
   - 剪贴板：优先 navigator.clipboard（需安全上下文），
     失败回退 textarea + execCommand
   ════════════════════════════════════════════════════════════════ */

const COPY_SVG =
  '<svg class="icon" width="12" height="12" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true" focusable="false">' +
  '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>' +
  '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

export function initCode() {
  const mist = window.Mist || {};
  const post = mist.post || {};
  const labels = mist.code || {};
  const copyLabel = labels.copy || '复制';
  const copiedLabel = labels.copied || '已复制！';

  if (post.copy_button === false) return;

  document.querySelectorAll('figure.highlight').forEach((fig) => {
    /* 代码块头：语言标签（最左）+ 复制按钮（最右），
       底缘发丝分割线由 CSS 绘制 */
    const header = document.createElement('div');
    header.className = 'code-header';

    const lang = (fig.className.match(/highlight\s+([A-Za-z0-9+#-]+)/) || [])[1];
    const label = document.createElement('span');
    label.className = 'code-lang';
    label.textContent = lang || '';
    header.appendChild(label);

    /* 复制按钮（图标 + 文案） */
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-btn';
    btn.setAttribute('aria-label', copyLabel);
    btn.innerHTML = COPY_SVG;
    const textSpan = document.createElement('span');
    textSpan.className = 'code-copy-btn__text';
    textSpan.textContent = copyLabel;
    btn.appendChild(textSpan);
    header.appendChild(btn);
    fig.insertBefore(header, fig.firstChild);   // 置于代码表格之前（顶部）

    btn.addEventListener('click', async () => {
      const pre = fig.querySelector('.code pre') || fig.querySelector('pre');
      const text = (pre ? pre.innerText : '').replace(/\n+$/, '');

      let ok = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (e) { /* 权限被拒等，走兜底 */ }
      }
      if (!ok) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand('copy'); } catch (e) { /* 无法复制 */ }
        ta.remove();
      }
      if (!ok) return;

      btn.classList.add('is-copied');
      textSpan.textContent = copiedLabel;
      clearTimeout(btn._resetTimer);
      btn._resetTimer = window.setTimeout(() => {
        btn.classList.remove('is-copied');
        textSpan.textContent = copyLabel;
      }, 2000);
    });
  });
}
