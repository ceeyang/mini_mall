/**
 * 联系我们组件
 * 生成联系表单区域的 HTML
 */

/**
 * 生成联系我们区域 HTML
 * @returns {string} 联系我们区域 HTML 字符串
 */
export function renderContact() {
  return `
    <section id="contact" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-2xl mx-auto border border-gray-200">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-8">联系我们</h2>
        <form class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="请输入您的姓名">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="your@email.com">
          </div>
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">留言</label>
            <textarea 
              id="message" 
              name="message" 
              rows="5" 
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
              placeholder="请输入您的留言..."></textarea>
          </div>
          <button 
            type="submit"
            class="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium shadow-lg">
            发送消息
          </button>
        </form>
      </div>
    </section>
  `;
}
