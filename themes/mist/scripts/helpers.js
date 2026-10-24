/* ════════════════════════════════════════════════════════════════
   Mist · scripts/helpers.js — Hexo 自定义助手（主题启动时自动加载）
   ════════════════════════════════════════════════════════════════
   重要约定：scripts/ 目录下的脚本由 loadPlugin 包裹为
   (function(exports, require, module, __filename, __dirname, hexo){...})
   直接执行，hexo 实例以参数注入——必须顶层直接使用 hexo，
   不要写 module.exports = function(hexo){...}（导出函数不会被调用，
   2026-10-24 实测踩坑）。Butterfly 等主题的 scripts 同此风格。

   当前提供：
   - custom_icon(name)：用户自定义图标，供 partial/icon.ejs 优先调用
     查找 <站点>/source/icons/<name>.svg，存在则返回
     { fill: true, vb: viewBox, d: 内部标记 }，不存在返回 null
     （回落到 icon.ejs 内置字形表）。
     处理规则（面向单色图标，随主题 currentColor 变色）：
     - 剥离 XML 注释与内部 fill 属性（继承外层 currentColor）
     - 保留原 viewBox，保证字形比例不变形
     - name 仅允许 [a-z0-9-]，防路径穿越
   ════════════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');

hexo.extend.helper.register('custom_icon', function (name) {
  if (!/^[a-z0-9-]+$/.test(name || '')) return null;

  const file = path.join(hexo.source_dir, 'icons', name + '.svg');
  let svg;
  try {
    svg = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return null; // 无自定义图标，回落内置字形
  }

  const vbMatch = svg.match(/viewBox="([^"]+)"/);
  if (!vbMatch) return null;

  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>[\s\S]*$/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\sfill="[^"]*"/g, '')
    .trim();

  return { fill: true, vb: vbMatch[1], d: inner };
});
