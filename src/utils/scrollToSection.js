// 平滑滚动到指定锚点（替代原 HTML 底部的脚本），供 Navbar/Footer 调用
export function scrollToSection(id) {
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
