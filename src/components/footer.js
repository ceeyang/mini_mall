/**
 * 页脚组件
 * 生成页脚区域的 HTML
 */

/**
 * 生成页脚区域 HTML
 * @returns {string} 页脚区域 HTML 字符串
 */
export function renderFooter() {
  return `
    <footer class="bg-gray-900 text-gray-300 py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Mini Mall</h3>
            <p class="text-gray-400">为您提供优质购物体验</p>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-4">快速链接</h3>
            <ul class="space-y-2">
              <li><a href="#home" class="hover:text-white transition-colors duration-200 cursor-pointer">首页</a></li>
              <li><a href="#products" class="hover:text-white transition-colors duration-200 cursor-pointer">商品</a></li>
              <li><a href="#about" class="hover:text-white transition-colors duration-200 cursor-pointer">关于</a></li>
              <li><a href="#contact" class="hover:text-white transition-colors duration-200 cursor-pointer">联系</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-4">联系方式</h3>
            <p class="text-gray-400">邮箱: contact@minimall.com</p>
            <p class="text-gray-400">电话: +86 123 4567 8900</p>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Mini Mall. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  `;
}
