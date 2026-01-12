/**
 * 关于我们组件
 * 生成关于我们区域的 HTML
 */

/**
 * 生成关于我们区域 HTML
 * @param {boolean} isStandalonePage - 是否为独立页面，默认 false（首页用）
 * @returns {string} 关于我们区域 HTML 字符串
 */
export function renderAbout(isStandalonePage = false) {
  if (isStandalonePage) {
    return `
      <section id="about" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">关于 Mini Mall</h1>
          <p class="text-lg text-gray-600">了解我们的故事和使命</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
          <div class="max-w-3xl mx-auto">
            <div class="prose prose-lg max-w-none">
              <p class="text-lg text-gray-600 leading-relaxed mb-6">
                Mini Mall 是一个专注于提供高品质商品的独立购物平台。我们致力于为每一位顾客带来卓越的购物体验，
                精选优质商品，确保每一件产品都经过严格的质量把控。
              </p>
              
              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">我们的使命</h2>
              <p class="text-gray-600 leading-relaxed mb-6">
                我们的使命是为消费者提供优质、可靠的商品，让购物变得简单、愉快。我们相信，每一件商品都应该经过精心挑选，
                每一个细节都应该得到重视。
              </p>
              
              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">我们的价值观</h2>
              <ul class="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li><strong>品质第一</strong>：我们只选择经过严格质量检验的商品</li>
                <li><strong>客户至上</strong>：顾客的满意度是我们最大的追求</li>
                <li><strong>诚信经营</strong>：透明、公正、诚实地对待每一位顾客</li>
                <li><strong>持续创新</strong>：不断改进服务，提升购物体验</li>
              </ul>
              
              <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">为什么选择我们</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="p-4 bg-indigo-50 rounded-lg">
                  <h3 class="font-semibold text-gray-900 mb-2">精选商品</h3>
                  <p class="text-sm text-gray-600">每一件商品都经过严格筛选，确保品质</p>
                </div>
                <div class="p-4 bg-indigo-50 rounded-lg">
                  <h3 class="font-semibold text-gray-900 mb-2">优质服务</h3>
                  <p class="text-sm text-gray-600">专业的客服团队，随时为您解答疑问</p>
                </div>
                <div class="p-4 bg-indigo-50 rounded-lg">
                  <h3 class="font-semibold text-gray-900 mb-2">快速配送</h3>
                  <p class="text-sm text-gray-600">高效的物流系统，快速送达您的手中</p>
                </div>
                <div class="p-4 bg-indigo-50 rounded-lg">
                  <h3 class="font-semibold text-gray-900 mb-2">售后保障</h3>
                  <p class="text-sm text-gray-600">完善的售后服务体系，让您购物无忧</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
  
  // 首页版本（简化版）
  return `
    <section id="about" class="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 rounded-2xl shadow-lg my-20">
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">关于 Mini Mall</h2>
        <p class="text-lg text-gray-600 leading-relaxed mb-8">
          Mini Mall 是一个专注于提供高品质商品的独立购物平台。我们致力于为每一位顾客带来卓越的购物体验，
          精选优质商品，确保每一件产品都经过严格的质量把控。
        </p>
        <a href="about.html" class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium shadow-lg">
          了解更多 →
        </a>
      </div>
    </section>
  `;
}
