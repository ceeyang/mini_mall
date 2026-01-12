/**
 * 关于我们组件
 * 生成关于我们区域的 HTML
 */

/**
 * 生成关于我们区域 HTML
 * @returns {string} 关于我们区域 HTML 字符串
 */
export function renderAbout() {
  return `
    <section id="about" class="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 rounded-2xl shadow-lg my-20">
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">关于 Mini Mall</h2>
        <p class="text-lg text-gray-600 leading-relaxed">
          Mini Mall 是一个专注于提供高品质商品的独立购物平台。我们致力于为每一位顾客带来卓越的购物体验，
          精选优质商品，确保每一件产品都经过严格的质量把控。
        </p>
      </div>
    </section>
  `;
}
