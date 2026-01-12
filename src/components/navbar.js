/**
 * 导航栏组件
 * 生成导航栏 HTML 并处理相关交互
 * 支持移动端响应式设计，包含汉堡菜单
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
      <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 px-4 md:px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo 区域 -->
          <div class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"></path>
            </svg>
            <span class="text-xl font-bold text-gray-900">Mini Mall</span>
          </div>
          
          <!-- 桌面端导航菜单 -->
          <div class="hidden md:flex items-center space-x-6">
            <a href="index.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">首页</a>
            <a href="products.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">商品</a>
            <a href="about.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">关于</a>
            <a href="contact.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">联系</a>
          </div>
          
          <!-- 右侧操作区 -->
          <div class="flex items-center space-x-3">
            <!-- 购物车按钮 -->
            <a href="cart.html" id="cart-button" class="bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium flex items-center">
              <svg class="w-5 h-5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span class="hidden md:inline">购物车</span>
              <span id="cart-count" class="ml-2 bg-indigo-700 px-2 py-1 rounded-full text-xs ${cartCount === 0 ? 'hidden' : ''}">${cartCount}</span>
            </a>
            
            <!-- 移动端汉堡菜单按钮 -->
            <button 
              id="mobile-menu-button" 
              class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              aria-label="打开菜单">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <svg class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="close-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 移动端菜单（默认隐藏） -->
        <div id="mobile-menu" class="hidden md:hidden mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-col space-y-3">
            <a href="index.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">首页</a>
            <a href="products.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">商品</a>
            <a href="about.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">关于</a>
            <a href="contact.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">联系</a>
          </div>
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

  // 移动端菜单切换
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      const isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        // 打开菜单
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
      } else {
        // 关闭菜单
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        // 恢复背景滚动
        document.body.style.overflow = '';
      }
    });

    // 点击菜单链接后关闭菜单
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
      });
    });

    // 点击外部区域关闭菜单
    document.addEventListener('click', function(event) {
      const isClickInsideNav = event.target.closest('nav');
      const isClickOnButton = event.target.closest('#mobile-menu-button');
      
      if (!isClickInsideNav && !isClickOnButton && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });

    // 窗口大小改变时，如果是桌面端，关闭移动菜单
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768) {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }

  // 初始更新
  updateCartCount();
}
