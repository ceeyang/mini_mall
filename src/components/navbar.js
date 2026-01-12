/**
 * 导航栏组件
 * 生成导航栏 HTML 并处理相关交互
 */

import { cartManager } from '../scripts/cart.js';

/**
 * 生成导航栏 HTML
 * @returns {string} 导航栏 HTML 字符串
 */
export function renderNavbar() {
  const cartCount = cartManager.getTotalItems();
  
  return `
    <nav class="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
      <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"></path>
            </svg>
            <span class="text-xl font-bold text-gray-900">Mini Mall</span>
          </div>
          <div class="hidden md:flex items-center space-x-6">
            <a href="index.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">首页</a>
            <a href="products.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">商品</a>
            <a href="index.html#about" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">关于</a>
            <a href="index.html#contact" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">联系</a>
          </div>
          <a href="cart.html" id="cart-button" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            购物车
            <span id="cart-count" class="ml-2 bg-indigo-700 px-2 py-1 rounded-full text-xs ${cartCount === 0 ? 'hidden' : ''}">${cartCount}</span>
          </a>
        </div>
      </div>
    </nav>
  `;
}

/**
 * 初始化导航栏交互
 */
export function initNavbar() {
  // 更新购物车数量
  const updateCartCount = () => {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      const count = cartManager.getTotalItems();
      cartCountElement.textContent = count;
      // 如果数量为0，隐藏徽章
      if (count === 0) {
        cartCountElement.classList.add('hidden');
      } else {
        cartCountElement.classList.remove('hidden');
      }
    }
  };

  // 监听购物车变化
  cartManager.onCartChange(() => {
    updateCartCount();
  });

  // 购物车按钮已经是链接，无需额外处理

  // 初始更新
  updateCartCount();
}
