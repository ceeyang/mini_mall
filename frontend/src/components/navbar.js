/**
 * 导航栏组件
 * 生成导航栏 HTML 并处理相关交互
 * 支持移动端响应式设计，包含汉堡菜单
 */

import { authManager } from '../scripts/auth.js';
import { cartManager } from '../scripts/cart.js';

/**
 * 生成导航栏 HTML
 * @param {string} currentPage - 当前页面路径，用于确定相对路径
 * @returns {string} 导航栏 HTML 字符串
 */
export function renderNavbar(currentPage = 'index') {
  const cartCount = cartManager.getTotalItems();
  const user = authManager.getCurrentUser();
  const isAuthenticated = authManager.isAuthenticated();
  
  // 根据当前页面确定路径前缀
  // index.html 在 frontend/ 目录，其他页面在 frontend/src/pages/ 目录
  const pathPrefix = currentPage === 'index' ? 'src/pages/' : '';
  const indexPath = currentPage === 'index' ? 'index.html' : '../../index.html';
  
  // 用户菜单 HTML
  const userMenuHTML = isAuthenticated ? `
    <div class="relative group">
      <button 
        id="user-menu-button"
        class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
        <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          ${user.avatar ? `
            <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover">
          ` : `
            <span class="text-sm font-bold text-indigo-600">${user.name.charAt(0).toUpperCase()}</span>
          `}
        </div>
        <span class="hidden lg:inline text-gray-700 font-medium">${user.name}</span>
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <!-- 用户下拉菜单 -->
      <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
        <a href="${pathPrefix}user-center.html" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">我的订单</a>
        <a href="${pathPrefix}user-center.html" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">账户设置</a>
        <div class="border-t border-gray-200 my-1"></div>
        <button id="navbar-logout-btn" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer">退出登录</button>
      </div>
    </div>
  ` : `
    <a href="${pathPrefix}login.html" class="px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer font-medium">
      登录
    </a>
  `;
  
  return `
    <nav class="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
      <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 px-4 md:px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo 区域 -->
          <div class="flex items-center space-x-2">
            <a href="${indexPath}" class="flex items-center space-x-2">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"></path>
              </svg>
              <span class="text-xl font-bold text-gray-900">Mini Mall</span>
            </a>
          </div>
          
          <!-- 桌面端导航菜单 -->
          <div class="hidden md:flex items-center space-x-6">
            <a href="${indexPath}" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">首页</a>
            <a href="${pathPrefix}products.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">商品</a>
            <a href="${pathPrefix}about.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">关于</a>
            <a href="${pathPrefix}contact.html" class="text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer">联系</a>
          </div>
          
          <!-- 右侧操作区 -->
          <div class="flex items-center space-x-3">
            <!-- 用户菜单 -->
            <div class="hidden md:block">
              ${userMenuHTML}
            </div>
            
            <!-- 购物车按钮 -->
            <a href="${pathPrefix}cart.html" id="cart-button" class="bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium flex items-center">
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
            <a href="${indexPath}" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">首页</a>
            <a href="${pathPrefix}products.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">商品</a>
            <a href="${pathPrefix}about.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">关于</a>
            <a href="${pathPrefix}contact.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">联系</a>
            ${isAuthenticated ? `
              <a href="${pathPrefix}user-center.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">我的订单</a>
              <button id="mobile-logout-btn" class="mobile-menu-link text-left text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">退出登录</button>
            ` : `
              <a href="${pathPrefix}login.html" class="mobile-menu-link text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer">登录</a>
            `}
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

  // 用户下拉菜单
  const userMenuButton = document.getElementById('user-menu-button');
  const userDropdown = document.getElementById('user-dropdown');
  if (userMenuButton && userDropdown) {
    userMenuButton.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('hidden');
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', function(event) {
      if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.add('hidden');
      }
    });
  }

  // 导航栏退出登录按钮
  const navbarLogoutBtn = document.getElementById('navbar-logout-btn');
  if (navbarLogoutBtn) {
    navbarLogoutBtn.addEventListener('click', function() {
      if (confirm('确定要退出登录吗？')) {
        authManager.logout();
        window.location.reload();
      }
    });
  }

  // 移动端退出登录按钮
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', function() {
      if (confirm('确定要退出登录吗？')) {
        authManager.logout();
        window.location.reload();
      }
    });
  }

  // 监听认证状态变化
  authManager.onAuthChange(() => {
    // 如果导航栏已渲染，重新渲染以更新用户状态
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      // 检测当前页面类型
      const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
      const currentPage = isIndexPage ? 'index' : 'pages';
      navbarContainer.innerHTML = renderNavbar(currentPage);
      initNavbar();
    }
  });

  // 初始更新
  updateCartCount();
}
