/**
 * Hero 区域组件
 * 生成首页 Hero 区域的 HTML
 */

/**
 * 生成 Hero 区域 HTML
 * @returns {string} Hero 区域 HTML 字符串
 */
export function renderHero() {
  return `
    <section id="home" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          欢迎来到 <span class="text-indigo-600">Mini Mall</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          发现精选商品，享受优质购物体验
        </p>
        <div class="flex justify-center space-x-4">
                    <a href="/products" class="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium shadow-lg">
                      浏览商品
                    </a>
          <a href="#about" class="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer font-medium border-2 border-indigo-600">
            了解更多
          </a>
        </div>
      </div>
    </section>
  `;
}
