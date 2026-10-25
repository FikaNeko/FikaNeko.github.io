/* ════════════════════════════════════════════════════════════════
   本地开发服务器 404 兜底
   ════════════════════════════════════════════════════════════════
   hexo-server 对未知路径返回默认 Error 页，不会自动回退到 404.html
   （GitHub Pages / Netlify 等静态托管会自动做，本地不会）。
   此脚本借 hexo-server 的 server_middleware 过滤器，把一个兜底
   中间件追加到链条最末（站点脚本晚于插件注册，天然排在最后）：
   所有中间件都未处理且存在 404.html 路由时，以 404 状态码返回它。
   仅影响本地预览；生产部署行为由托管平台决定。
   ════════════════════════════════════════════════════════════════ */

hexo.extend.filter.register('server_middleware', function (app) {
  const route = this.route;
  const { root } = this.config;

  app.use(function (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    let url = req.url;
    try { url = decodeURIComponent(url); } catch (e) { /* 非法编码按原样 */ }
    if (root && root !== '/' && url.startsWith(root)) url = url.slice(root.length - 1);
    if (url === '/404.html') return next();   // 直接访问 404 页本身 → 200

    const data = route.get('404.html');
    if (!data) return next();

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    data.pipe(res);
  });
});
