/**
 * 联系我们组件
 * 生成联系表单区域的 HTML
 */

/**
 * 生成联系我们区域 HTML
 * @param {boolean} isStandalonePage - 是否为独立页面，默认 false（首页用）
 * @returns {string} 联系我们区域 HTML 字符串
 */
export function renderContact(isStandalonePage = false) {
  if (isStandalonePage) {
    return `
      <section id="contact" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">联系我们</h1>
          <p class="text-lg text-gray-600">我们很乐意听到您的声音</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 联系信息 -->
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">联系方式</h2>
            <div class="space-y-6">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-indigo-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">邮箱</h3>
                  <p class="text-gray-600">contact@minimall.com</p>
                  <p class="text-gray-600">support@minimall.com</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg class="w-6 h-6 text-indigo-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">电话</h3>
                  <p class="text-gray-600">+86 123 4567 8900</p>
                  <p class="text-gray-600">工作时间：周一至周五 9:00-18:00</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg class="w-6 h-6 text-indigo-600 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">地址</h3>
                  <p class="text-gray-600">中国北京市朝阳区</p>
                  <p class="text-gray-600">示例街道 123 号</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 联系表单 -->
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">发送消息</h2>
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
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">电话（可选）</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="请输入您的电话">
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
        </div>
      </section>
    `;
  }
  
  // 首页版本（简化版）
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
        <div class="mt-6 text-center">
          <a href="contact.html" class="text-indigo-600 hover:text-indigo-700 transition-colors duration-200 cursor-pointer font-medium">
            查看完整联系方式 →
          </a>
        </div>
      </div>
    </section>
  `;
}
