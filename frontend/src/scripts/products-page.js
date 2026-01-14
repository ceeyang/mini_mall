/**
 * 商品列表页面入口文件
 * 初始化商品列表页面的所有组件
 */

import { renderFooter } from '../components/footer.js';
import { initNavbar, renderNavbar } from '../components/navbar.js';
import { initProductsList, renderProductsList } from '../components/products-list.js';
import { cartManager } from './cart.js';
import { initUI } from './ui.js';

/**
 * 生成加载占位视图
 * @returns {string} 加载占位 HTML
 */
function renderLoadingPlaceholder() {
  return `
    <section id="products" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">商品列表</h1>
        <p class="text-lg text-gray-600">发现更多优质商品，享受购物乐趣</p>
      </div>

      <!-- 筛选和排序工具栏占位 -->
      <div class="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200 animate-pulse">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="h-10 bg-gray-200 rounded-lg w-32"></div>
          <div class="h-10 bg-gray-200 rounded-lg w-32"></div>
          <div class="h-10 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>

      <!-- 商品网格占位 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${Array.from({ length: 6 }).map(() => `
          <div class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
            <div class="h-64 bg-gray-200"></div>
            <div class="p-6">
              <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div class="flex items-center justify-between">
                <div class="h-8 bg-gray-200 rounded w-24"></div>
                <div class="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

/**
 * 初始化商品列表页面
 */
function initProductsPage() {
  // 渲染导航栏
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar('pages');
    initNavbar();
  }

  // 渲染商品列表（先显示加载占位视图）
  const productsContainer = document.getElementById('products-container');
  if (productsContainer) {
    // 显示加载占位视图
    productsContainer.innerHTML = renderLoadingPlaceholder();
    
    // 异步加载商品列表
    renderProductsList().then(html => {
      productsContainer.innerHTML = html;
      initProductsList();
    }).catch(error => {
      console.error('加载商品列表失败:', error);
      productsContainer.innerHTML = '<div class="text-center py-12 text-gray-500">商品列表加载失败，请稍后重试</div>';
    });
  }

  // 渲染页脚
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }

  // 初始化 UI 功能
  initUI();

  // 监听购物车变化，更新导航栏购物车数量
  cartManager.onCartChange(() => {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      navbarContainer.innerHTML = renderNavbar('pages');
      initNavbar();
    }
  });
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsPage);
} else {
  initProductsPage();
}
